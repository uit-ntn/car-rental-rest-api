const Car = require('../models/Car');
const Rental = require('../models/Rental');

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
    console.log('Error creating car:', error);
    res.status(500).json({ message: 'Error creating car', error: error.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;  // Get the car ID from the URL parameters
    const car = await Car.findById(carId);  // Find the car by ID

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    const carData = req.body;  // Get the updated car data from the request body

    // Only handle rental contracts if the car is available
    if (carData.status === 'available') {
      // Check for any rental contracts with status 'Đang thuê' or start date in the future
      const rentals = await Rental.find({
        car_id: carId,
        $or: [
          { status: 'Đang thuê' },  // Currently rented
          { start_date: { $gte: new Date() } }  // Future rentals
        ]
      });

      // If rentals are found, delete them
      if (rentals.length > 0) {
        await Rental.deleteMany({ car_id: carId, _id: { $in: rentals.map(r => r._id) } });
        console.log('Deleted rentals:', rentals);
      }
    }
    await Car.findByIdAndUpdate
      (carId, carData, { new: true, runValidators: true });
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error updating car', error: error.message });
  }
};


// Delete a car by ID
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    const rentals = await Rental.find({ car_id: req.params.id });
    rentals.forEach(async (rental) => {
      await Rental.findByIdAndDelete(rental._id);
    }
    );
    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
};

// Update car's insurance info
exports.updateInsuranceInfo = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.insurance_info = req.body;
    await car.save();
    res.status(200).json({ message: 'Insurance info updated successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Error updating insurance info', error: error.message });
  }
};


