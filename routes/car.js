const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Add Car
router.post('/', carController.addCar);

// Get Car Details
router.get('/:id', carController.getCarById);

// List Available Cars
router.get('/', carController.getAllCars);

module.exports = router;
