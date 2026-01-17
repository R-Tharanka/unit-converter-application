require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('./routes/api');
const connectDB = require('./config/database');

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api', apiRoutes);

// Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

module.exports = app;
