const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/', carController.createCar);          // Create a car
router.get('/', carController.getAllCars);          // Get all cars
router.get('/:id', carController.getCarById);       // Get a car by ID
router.put('/:id', carController.updateCar);        // Update a car by ID
router.delete('/:id', carController.deleteCar);     // Delete a car by ID
router.get('/status/:status', carController.getCarsByStatus);    // Get cars by status
router.get('/location/:location', carController.getCarsByLocation); // Get cars by location
router.post('/:id/documents', carController.addDocumentToCar);   // Add a document to a car
router.put('/:id/insurance', carController.updateInsuranceInfo); // Update car's insurance info
router.get('/owner/:owner_id', carController.getCarsByOwner);    // Get cars by owner ID

module.exports = router;
