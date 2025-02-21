const User = require('../models/User');
const Car = require('../models/Car');
const Rental = require('../models/Rental');

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
    console.error('Lỗi khi lấy thông tin người dùng theo ID:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
  }
};

// Create a new user (Admin Only)
exports.createUser = async (req, res) => {
  const { email, password, role, full_name, phone, address } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên người dùng hoặc email đã tồn tại' });
    }

    const newUser = new User({
      email,
      password,
      role,
      full_name,
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
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error });
  }
};

// Delete user (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    const rentals = await Rental.getRentalsByCustomerId(req.params.id);
    rentals.forEach(async (rental) => {
      const car = await Car.findById(rental.car_id);
      if (car)
        car.status = 'available';
      await car.save();
    });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Người dùng đã bị xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error });
  }
};


// Get all rentals by customer ID
exports.getRentalsByCustomerId = async (req, res) => {
  try {
    const rentals = await Rental.find({ customer_id: req.params.id });
    rentals.forEach(async (rental) => {
      const car = await Car.findById(rental.car_id);
      rental.car = car;
      console.log(rental);
    }
    );
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thuê xe', error });
  }
};

