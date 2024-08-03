const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['sales', 'warehouse', 'admin'], required: true },
  salary: { type: Number, required: true },
  start_date: { type: Date, required: true },
  contact_info: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
