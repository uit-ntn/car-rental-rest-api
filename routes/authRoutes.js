const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

module.exports = router;
