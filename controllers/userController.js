const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
  }
};

// Create a new user (Admin Only)
exports.createUser = async (req, res) => {
  const { username, email, password, role, name, phone, address } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên người dùng hoặc email đã tồn tại' });
    }

    const newUser = new User({
      username,
      email,
      password,
      role,
      name,
      phone,
      address,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo người dùng', error });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error });
  }
};

// Delete user (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ message: 'Người dùng đã bị xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error });
  }
};

// Add a rental history to a user
exports.addRentalHistory = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    user.rental_history.push(rentalId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm lịch sử thuê xe', error });
  }
};

// Remove a rental history from a user
exports.removeRentalHistory = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    user.rental_history = user.rental_history.filter(
      (history) => history.toString() !== rentalId
    );
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa lịch sử thuê xe', error });
  }
};
