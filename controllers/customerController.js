const db = require('../configs/db');

// Create Customer
exports.createCustomer = (req, res) => {
  const { name, email, phone, address, driver_license_number } = req.body;
  const query = 'INSERT INTO Customers (name, email, phone, address, driver_license_number) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, phone, address, driver_license_number], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Customer created', customerId: result.insertId });
  });
};

// Get Customer Details
exports.getCustomerDetails = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Customers WHERE customer_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: 'Customer not found' });
    res.status(200).send(result[0]);
  });
};

// Update Customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, driver_license_number } = req.body;
  const query = 'UPDATE Customers SET name = ?, email = ?, phone = ?, address = ?, driver_license_number = ? WHERE customer_id = ?';
  db.query(query, [name, email, phone, address, driver_license_number, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Customer updated' });
  });
};

// Delete Customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Customers WHERE customer_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Customer deleted' });
  });
};

// Get All User
exports.getAllUsers = (req, res) => {
  const query = "SELECT * FROM USERS";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Data are getted' });
  })
}
