const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  license_plate: { type: String, required: true },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], required: true },
  location: { type: String, required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  insurance_info: {
    policy_number: { type: String, required: true },
    expiration_date: { type: Date, required: true },
    company: { type: String, required: true }
  },
  documents: [
    {
      doc_type: { type: String, required: true },
      doc_url: { type: String, required: true }
    }
  ]
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
