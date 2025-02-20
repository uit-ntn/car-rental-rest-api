const Rental = require('../models/Rental');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new rental
exports.createRental = async (req, res) => {
  try {
    const { car_id, customer_id, start_date, end_date, total_cost } = req.body;

    // Check if the car is available
    const car = await Car.findById(car_id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (car.status !== 'rented' && car.status !== 'maintenance') {
      return res.status(400).json({ message: 'Car is not available for rental' });
    }

    // Create rental
    const rental = new Rental({
      car_id,
      customer_id,
      start_date,
      end_date,
      total_cost,
      status: 'pending' // Default status
    });

    // Save rental
    await rental.save();

    // Update car status to 'rented'
    car.status = 'rented';
    await car.save();

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error creating rental', error: error.message });
  }
};

// Get all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find();
    const rentalList = [];

    for (const rental of rentals) {
      const car = await Car.findById(rental.car_id);
      const customer = await User.findById(rental.customer_id);

      // Check if car or customer is not found
      if (!car) {
        console.log('Car with ID', rental.car_id, 'not found');
        // Bỏ qua hợp đồng không có xe
        continue;
      }
      if (!customer) {

        console.log('Customer with ID', rental.customer_id, 'not found');
        // Bỏ qua hợp đồng không có khách hàng
        continue;
      }

      // Format rental data
      const rentalData = {
        _id: rental._id,
        car_id: rental.car_id,
        carInfo: `${car.model} ${car.make} ${car.year}`,
        customer_id: rental.customer_id,
        customerInfo: customer.full_name,
        start_date: rental.start_date,
        end_date: rental.end_date,
        total_cost: rental.total_cost,
        status: rental.status
      };
      rentalList.push(rentalData);
    }

    res.status(200).json(rentalList);
  } catch (error) {
    console.error(error);  // Log the full error for debugging
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
};



// Get a rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    const userInfo = await User.findById(rental.customer_id);
    const carInfo = await Car.findById(rental.car_id);
    const rentalData = {
      _id: rental._id,
      car_id: rental.car_id,
      carInfo: `${carInfo.make} ${carInfo.model} ${carInfo.year}`,
      customer_id: rental.customer_id,
      customerInfo: userInfo.full_name,
      start_date: rental.start_date,
      end_date: rental.end_date,
      total_cost: rental.total_cost,
      status: rental.status
    };
    res.status(200).json(rentalData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental', error: error.message });
  }
};

// Update rental status
exports.updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    if (rental.status === 'pending' && req.body.status === 'active') {
      const car = await Car.findById(rental.car_id);
      car.status = 'rented';
      await car.save();
    }
    else {
      const car = await Car.findById(rental.car_id);
      car.status = 'available';
      await car.save();
    }
    rental.status = req.body.status;
    await rental.save();
    res.status(200).json({ message: 'Rental status updated', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rental', error: error.message });
  }
};

// Delete a rental
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);

    // Update car status to 'available'
    const car = await Car.findById(rental.car_id);
    car.status = 'available';
    await car.save();

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rental', error: error.message });
  }
};

// Get all rentals by customer ID
exports.getRentalsByCustomerId = async (req, res) => {
  try {
    const rentals = await Rental.find({ customer_id: req.params.id });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
};

// Get all rentals by car ID
exports.getRentalsByCarId = async (req, res) => {
  try {
    const rentals = await Rental.find({ car_id: req.params.id });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
}



