const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const coachRoutes = require('./routes/coachRoutes');

const app = express();

// Security Middleware
app.use(helmet());

// CORS — allow the Next.js frontend to send cookies cross-origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true, // Required for httpOnly cookies to be accepted by the browser
}));

// Parse incoming request bodies
app.use(express.json());

// Parse cookies (required for httpOnly JWT auth_token)
app.use(cookieParser());

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/coaches', coachRoutes);

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

