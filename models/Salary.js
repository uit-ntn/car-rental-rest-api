const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, required: true }
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
