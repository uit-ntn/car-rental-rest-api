const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Create Customer
router.post('/', customerController.createCustomer);

// Get Customer Details
router.get('/:id', customerController.getCustomerDetails);

// Update Customer
router.put('/:id', customerController.updateCustomer);

// Delete Customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
