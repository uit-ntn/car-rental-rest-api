const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/cars', carController.createCar);          // Create a car
router.get('/cars', carController.getAllCars);          // Get all cars
router.get('/cars/:id', carController.getCarById);      // Get a car by ID
router.put('/cars/:id', carController.updateCar);       // Update a car by ID
router.delete('/cars/:id', carController.deleteCar);    // Delete a car by ID

module.exports = router;
