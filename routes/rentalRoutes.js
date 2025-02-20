const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

// Rental routes
router.post('/', rentalController.createRental); // Create a new rental
router.get('/', rentalController.getAllRentals); // Get all rentals
router.get('/:id', rentalController.getRentalById); // Get a rental by ID
router.put('/:id', rentalController.updateRentalStatus); // Update rental status
router.delete('/:id', rentalController.deleteRental); // Delete a rental
router.get('/user/:id', rentalController.getRentalsByCustomerId); // Get all rentals by customer ID
router.get('/car/:id', rentalController.getRentalsByCarId); // Get all rentals by car ID

module.exports = router;
