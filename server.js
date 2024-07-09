const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import module kết nối cơ sở dữ liệu

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());

// Routes
const customerRoutes = require('./routes/customer');
app.use('/api/customers', customerRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
