require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.config');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const config = require('./config/app.config');

const app = express();


// Connect to database
connectDB();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});