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
