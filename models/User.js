const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'sales', 'warehouse', 'admin'], default: 'customer' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  rental_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rental' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  rental_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  owned_cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
