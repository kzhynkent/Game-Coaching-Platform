const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// --- Global Error Handler ---
// Catches any error passed via next(err). Never leaks stack traces to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[GlobalErrorHandler]', err.message);
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'An unexpected server error occurred.';
  res.status(status).json({ success: false, error: message });
});

module.exports = app;
