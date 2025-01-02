const Rental = require('../models/Rental');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new rental
exports.createRental = async (req, res) => {
  try {
    const { car_id, customer_id, sales_id, start_date, end_date, total_cost } = req.body;

    // Check if the car is available
    const car = await Car.findById(car_id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (car.status !== 'available') {
      return res.status(400).json({ message: 'Car is not available for rental' });
    }

    // Create rental
    const rental = new Rental({
      car_id,
      customer_id,
      car_owner_id: car.owner_id,
      sales_id,
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
    const rentals = await Rental.find().populate('car_id customer_id sales_id');
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
};


// Get a rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('car_id customer_id sales_id');
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental', error: error.message });
  }
};

// Update rental status
exports.updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    rental.status = req.body.status || rental.status;
    await rental.save();
    res.status(200).json({ message: 'Rental status updated', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rental', error: error.message });
  }
};

// Delete a rental
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    await rental.remove();
    res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rental', error: error.message });
  }
};
