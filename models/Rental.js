const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Thêm thuộc tính này
  sales_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'canceled'], required: true }
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
