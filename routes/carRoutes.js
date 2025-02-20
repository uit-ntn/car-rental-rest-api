const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/', carController.createCar);          // Create a car
router.get('/', carController.getAllCars);          // Get all cars
router.get('/:id', carController.getCarById);       // Get a car by ID
router.put('/:id', carController.updateCar);        // Update a car by ID
router.delete('/:id', carController.deleteCar);     // Delete a car by ID
router.put('/:id/insurance', carController.updateInsuranceInfo); // Update car's insurance info

module.exports = router;
