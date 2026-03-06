const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user (player or coach).
 * - Hashes the password with bcrypt before storing.
 * - If role is 'coach', creates an associated coach_profile with default 'free' subscription.
 * @returns {{ token: string, user: object }}
 */
async function registerUser({ email, password, role }) {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        const err = new Error('An account with this email already exists.');
        err.status = 409;
        throw err;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
        [email, password_hash, role]
    );
    const user = rows[0];

    // Auto-create a coach_profile for coach registrations
    if (role === 'coach') {
        await pool.query('INSERT INTO coach_profiles (user_id) VALUES ($1)', [user.id]);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    return { token, user };
}

/**
 * Logs in an existing user.
 * @returns {{ token: string, user: object }}
 */
async function loginUser({ email, password }) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
        const err = new Error('Invalid email or password.');
        err.status = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const err = new Error('Invalid email or password.');
        err.status = 401;
        throw err;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = { registerUser, loginUser };
