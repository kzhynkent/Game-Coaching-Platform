const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = app;
