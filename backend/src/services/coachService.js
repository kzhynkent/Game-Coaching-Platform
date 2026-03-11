const pool = require('../db');

/**
 * Get all coach profiles with basic user info.
 * Public — no auth required.
 */
async function getAllCoaches() {
    const { rows } = await pool.query(
        `SELECT
           cp.user_id,
           cp.bio,
           cp.game_expertise,
           cp.rank,
           cp.subscription_status,
           cp.created_at,
           u.email
         FROM coach_profiles cp
         JOIN users u ON u.id = cp.user_id
         ORDER BY cp.created_at DESC`
    );
    return rows;
}

/**
 * Get a single coach profile by their user UUID.
 * Public — no auth required.
 *
 * @param {string} userId
 */
async function getCoachById(userId) {
    const { rows } = await pool.query(
        `SELECT
           cp.user_id,
           cp.bio,
           cp.game_expertise,
           cp.rank,
           cp.subscription_status,
           cp.created_at,
           u.email
         FROM coach_profiles cp
         JOIN users u ON u.id = cp.user_id
         WHERE cp.user_id = $1`,
        [userId]
    );
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Update the authenticated coach's own profile.
 * Only 'bio', 'game_expertise', and 'rank' are user-editable.
 * Stripe fields are managed by Phase 4 webhook logic only.
 *
 * @param {string} userId
 * @param {{ bio?: string, game_expertise?: string[], rank?: string }} fields
 */
async function updateMyProfile(userId, { bio, game_expertise, rank }) {
    const { rows } = await pool.query(
        `UPDATE coach_profiles
         SET bio            = COALESCE($1, bio),
             game_expertise = COALESCE($2, game_expertise),
             rank           = COALESCE($3, rank),
             updated_at     = NOW()
         WHERE user_id = $4
         RETURNING user_id, bio, game_expertise, rank, subscription_status, updated_at`,
        [bio || null, game_expertise || null, rank || null, userId]
    );
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { getAllCoaches, getCoachById, updateMyProfile };
