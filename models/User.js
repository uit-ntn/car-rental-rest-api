const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  full_name: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'sales', 'warehouse', 'admin'],
    default: 'customer',
  },
  phone: { type: String },
  address: { type: String },
});

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.username) {
    this.username = this.email.split('@')[0];
  }

  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
