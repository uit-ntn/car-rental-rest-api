const Car = require('../models/Car');
const mongoose = require('mongoose');

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
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

// Update a car by ID
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating car', error: error.message });
  }
};

// Delete a car by ID
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
};

// Get cars by status
exports.getCarsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const cars = await Car.find({ status });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars by status', error: error.message });
  }
};

// Get cars by location
exports.getCarsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const cars = await Car.find({ location });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars by location', error: error.message });
  }
};

// Add a document to a car
exports.addDocumentToCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.documents.push(req.body);
    await car.save();
    res.status(200).json({ message: 'Document added successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Error adding document', error: error.message });
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

// Get cars by owner ID
exports.getCarsByOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;
    const cars = await Car.find({ owner_id });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars by owner', error: error.message });
  }
};

