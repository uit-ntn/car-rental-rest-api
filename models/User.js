const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  contact_info: {
    phone: { type: String }
  },
  rental_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RentalContract' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  rental_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
});

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
