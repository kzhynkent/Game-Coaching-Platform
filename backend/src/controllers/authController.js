const { registerUser, loginUser } = require('../services/authService');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, error: 'Email, password, and role are required.' });
    }

    if (!['player', 'coach'].includes(role)) {
        return res.status(400).json({ success: false, error: "Role must be either 'player' or 'coach'." });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
    }

    try {
        const { token, user } = await registerUser({ email, password, role });
        return res.status(201).json({ success: true, token, user });
    } catch (err) {
        const status = err.status || 500;
        const message = status < 500 ? err.message : 'An unexpected error occurred.';
        return res.status(status).json({ success: false, error: message });
    }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    try {
        const { token, user } = await loginUser({ email, password });
        return res.status(200).json({ success: true, token, user });
    } catch (err) {
        const status = err.status || 500;
        const message = status < 500 ? err.message : 'An unexpected error occurred.';
        return res.status(status).json({ success: false, error: message });
    }
}

module.exports = { register, login };
