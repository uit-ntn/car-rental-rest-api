const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Import module kết nối cơ sở dữ liệu

const customerRoutes = require('./routes/customer');
const carRoutes = require('./routes/car');
const app = express();
const port = 8000;

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customerRoutes);

app.listen(port, () => {
  console.log("Hello Express")
  console.log(`Server running on port ${port}`);
});
