const db = require('../config/db');

// Add Car
exports.addCar = (req, res) => {
  const { make, model, year, license_plate, status, daily_rent } = req.body;
  const query = 'INSERT INTO Cars (make, model, year, license_plate, status, daily_rent) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [make, model, year, license_plate, status, daily_rent], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Car added', carId: result.insertId });
  });
};

// Get Car Details
exports.getCarDetails = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Cars WHERE car_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: 'Car not found' });
    res.status(200).send(result[0]);
  });
};

// List Available Cars
exports.listAvailableCars = (req, res) => {
  const query = "SELECT * FROM Cars WHERE status = 'available'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
};
