const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Add Car
router.post('/', carController.addCar);

// Get Car Details
router.get('/:id', carController.getCarDetails);

// List Available Cars
router.get('/', carController.listAvailableCars);

module.exports = router;
