const Comment = require('../models/Comment');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        console.log("📩 Request nhận từ FE:", req.body); // Kiểm tra dữ liệu nhận được

        const { user_id, car_id, content, rating, user_name } = req.body;

        if (!content || content.trim() === "") {
            console.log("❌ Lỗi: content rỗng hoặc không hợp lệ!");
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }

        const comment = new Comment({
            user_id,
            car_id,
            content,
            rating,
            user_name
        });

        await comment.save();
        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.error("❌ Lỗi tạo comment:", error);
        res.status(500).json({ message: "Error creating comment", error: error.message });
    }
};



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
            return res.status(404).json({ message: 'Bình luận không tồn tại' });
        }
        res.status(200).json({ message: 'Bình luận đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa bình luận', error: error.message });
    }
}


