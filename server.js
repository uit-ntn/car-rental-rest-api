const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const carRoutes = require('./routes/car');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/cars', carRoutes);

app.get('/', (req, res) => {
  return "Hello Express"
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
