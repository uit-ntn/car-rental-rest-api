const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// User routes
router.get('/', UserController.getAllUsers); // Get all users
router.get('/:id', UserController.getUserById); // Get a user by ID
router.post('/', UserController.createUser); // Create a new user
router.put('/:id', UserController.updateUser); // Update user information
router.delete('/:id', UserController.deleteUser); // Delete a user
router.get('/:id/rentals', UserController.getRentalsByCustomerId); // Get rentals by user ID

module.exports = router;
