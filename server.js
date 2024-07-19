const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./configs/db');

const customerRoutes = require('./routes/customer');
const carRoutes = require('./routes/car');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 8000;


dotenv.config();

// Body parser middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log("Hello Express")
  console.log(`Server running on port ${port}`);
});
