const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sentMail = require('../configs/mailer');
const jwt = require('jsonwebtoken');
const exp = require('constants');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    const newUser = new User({ email, password, role: 'customer' });
    await newUser.save();
    res.status(201).json({ message: 'Đã tạo tài khoản thành công' });
  } catch (error) {
    console.error(`Error in signup: ${error.message}`);  // Ghi log lỗi vào console
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Không tìm thấy Email' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Sai mật khẩu' });
    }

    // return token and user ID 
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, _id: user._id });
  } catch (error) {
    console.error(`Error in login: ${error.message}`);  // Ghi log lỗi vào console
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }

    // Generate a new random password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send password to email
    const subject = 'Car rental - Your New Password';
    const text = `Mật khẩu mới của bạn là : ${newPassword}. Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập.`;

    await sentMail(email, subject, text);

    res.json({ msg: 'Mật khẩu mới đã được gửi đến email của bạn' });
  } catch (error) {
    console.error(`Error in forgotPassword: ${error.message}`);  // Ghi log lỗi vào console
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy hoặc token hết hạn' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
  } catch (error) {
    console.error(`Error in resetPassword: ${error.message}`);  // Ghi log lỗi vào console
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    // Lấy token từ headers
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    // Giải mã token để lấy user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    // Mã hóa mật khẩu mới và cập nhật
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(`Error in updatePassword: ${error.message}`);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

