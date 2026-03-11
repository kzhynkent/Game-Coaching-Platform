const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout — clears the httpOnly auth_token cookie
router.post('/logout', logout);

module.exports = router;

