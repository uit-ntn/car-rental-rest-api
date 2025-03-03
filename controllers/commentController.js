const Comment = require('../models/Comment');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const { user_id, car_id, content, rating, user_name } = req.body;

        // Check if the car and user exist
        const car = await Car.findById(car_id);
        const user = await User.findById(user_id);
        if (!car || !user) {
            if (!car) console.log(`Car : ${car_id}  not found`);
            if (!user) console.log(`User ${user_id} not found`);
            console.log('Car or user not found');
            return res.status(404).json({ message: 'Car or user not found' });
        }

        // Check if the rating is valid
        if (rating < 1 || rating > 5) {
            console.log('Invalid rating');
            return res.status(400).json({ message: 'Invalid rating' });
        }

        // Create comment
        const comment = new Comment({
            user_id,
            car_id,
            content,
            rating,
            user_name
        });

        // Save comment
        await comment.save();

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error(error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
}


// Get all comments
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};


// Get comments by car_id
exports.getCommentsByCarId = async (req, res) => {
    try {
        const { car_id } = req.params;
        const comments = await Comment.find({ car_id });
        res.status(200).json(comments);

    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
}

// Delete a comment by id
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            console.log('Comment not found');
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
}

