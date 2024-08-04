const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./configs/db');
const morgan = require('morgan');
const { engine } = require("express-handlebars");

const customerRoutes = require('./routes/customer');
const carRoutes = require('./routes/car');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// connect database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Sử dụng để parse x-www-form-urlencoded
app.use(cookieParser());

// http logger
app.use(morgan('dev'));

// Thiết lập thư mục tĩnh
app.use(express.static('public'));

// Template engine
app.engine('handlebars', engine({
  extname: 'handlebars',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/resource/templates/views/layouts/',
  partialsDir: __dirname + '/resource/templates/views/partials/'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/resource/templates/views/');

// Routes
app.get('/', (req, res) => {
  res.render('home', { message: "Hello Express" });
});

app.use('/api/customers', customerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
