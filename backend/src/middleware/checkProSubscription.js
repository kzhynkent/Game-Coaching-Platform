const pool = require('../db');

/**
 * Middleware: Non-blocking. Checks if the authenticated user (if any) is a
 * pro-tier coach. Sets req.isProCoach = true | false.
 *
 * Must be used AFTER optionalAuthenticate so req.user is already populated.
 *
 * Logic:
 *  - No user session              → req.isProCoach = false
 *  - User is a player             → req.isProCoach = false
 *  - User is a free-tier coach    → req.isProCoach = false
 *  - User is a pro-tier coach     → req.isProCoach = true
 */
async function checkProSubscription(req, res, next) {
    req.isProCoach = false; // safe default

    if (!req.user || req.user.role !== 'coach') {
        return next();
    }

    try {
        const { rows } = await pool.query(
            'SELECT subscription_status FROM coach_profiles WHERE user_id = $1',
            [req.user.userId]
        );

        if (rows.length > 0 && rows[0].subscription_status === 'pro') {
            req.isProCoach = true;
        }
    } catch (err) {
        // Non-fatal: log and continue with isProCoach = false (fail secure)
        console.error('[checkProSubscription] DB error:', err.message);
    }

    next();
}

module.exports = checkProSubscription;
