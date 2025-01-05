const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/cars', carController.createCar);          // Create a car
router.get('/cars', carController.getAllCars);          // Get all cars
router.get('/cars/:id', carController.getCarById);      // Get a car by ID
router.put('/cars/:id', carController.updateCar);       // Update a car by ID
router.delete('/cars/:id', carController.deleteCar);    // Delete a car by ID
router.get('/cars/status/:status', carController.getCarsByStatus);    // Get cars by status
router.get('/cars/location/:location', carController.getCarsByLocation); // Get cars by location
router.post('/cars/:id/documents', carController.addDocumentToCar);   // Add a document to a car
router.put('/cars/:id/insurance', carController.updateInsuranceInfo); // Update car's insurance info
router.get('/cars/owner/:owner_id', carController.getCarsByOwner);    // Get cars by owner ID

module.exports = router;
