const commentController = require('../controllers/commentController');
const express = require('express');


const router = express.Router();
router.post('/', commentController.createComment);          // Create a comment
router.get('/', commentController.getAllComments);          // Get all comments
module.exports = router;