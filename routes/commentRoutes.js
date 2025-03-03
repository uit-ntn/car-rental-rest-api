const commentController = require('../controllers/commentController');
const express = require('express');


const router = express.Router();
router.post('/', commentController.createComment);          // Create a comment
router.get('/', commentController.getAllComments);          // Get all comments
router.get('/:car_id', commentController.getCommentsByCarId); // Get comments by car_id
router.delete("/:comment_id",commentController.deleteComment); // Delete commment by id
module.exports = router;