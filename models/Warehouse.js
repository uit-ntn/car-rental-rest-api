const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  location: { type: String, required: true },
  cars: [
    {
      car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
      status: { type: String, enum: ['in_stock', 'maintenance', 'out'], required: true }
    }
  ],
  parts: [
    {
      part_id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, enum: ['available', 'used', 'ordered'], required: true }
    }
  ]
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
