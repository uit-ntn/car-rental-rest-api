const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/:id/rental-history', UserController.addRentalHistory);
router.delete('/:id/rental-history', UserController.removeRentalHistory);

module.exports = router;
