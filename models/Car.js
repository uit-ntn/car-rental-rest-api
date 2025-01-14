const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String, required: true },
  year: { type: Number, required: true },
  license_plate: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'maintenance'], 
    required: true 
  },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  transmission: { 
    type: String, 
    enum: ['Automatic', 'Manual'], 
    required: true 
  },
  insurance_info: {
    policy_number: { type: String, required: true },
    expiration_date: { type: Date, required: true },
    company: { type: String, required: true }
  }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
