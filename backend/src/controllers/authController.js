const { registerUser, loginUser } = require('../services/authService');

/** Shared cookie options for the auth_token httpOnly cookie. */
const COOKIE_OPTIONS = {
    httpOnly: true,       // Not accessible from JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',  // Blocks cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

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
        res.cookie('auth_token', token, COOKIE_OPTIONS);
        return res.status(201).json({ success: true, user });
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
        res.cookie('auth_token', token, COOKIE_OPTIONS);
        return res.status(200).json({ success: true, user });
    } catch (err) {
        const status = err.status || 500;
        const message = status < 500 ? err.message : 'An unexpected error occurred.';
        return res.status(status).json({ success: false, error: message });
    }
}

/**
 * POST /api/auth/logout
 * Clears the httpOnly auth cookie.
 */
function logout(req, res) {
    res.clearCookie('auth_token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}

module.exports = { register, login, logout };

