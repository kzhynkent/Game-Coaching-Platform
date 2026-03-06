const pool = require('../db');

/**
 * Masks contact fields on a request object.
 * In Phase 2, contact fields are ALWAYS null.
 * In Phase 3, this will be replaced with a live Stripe subscription check.
 */
function maskContactFields(request) {
    return {
        ...request,
        discord_tag: null,
        social_links: null,
        exact_username: null,
    };
}

/**
 * Get all open coaching requests (paginated).
 * Contact fields are always masked to null.
 */
async function getAllRequests({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
        `SELECT * FROM coaching_requests
     WHERE status = 'open'
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return rows.map(maskContactFields);
}

/**
 * Get a single coaching request by ID.
 * Contact fields are always masked to null.
 */
async function getRequestById(id) {
    const { rows } = await pool.query('SELECT * FROM coaching_requests WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return maskContactFields(rows[0]);
}

/**
 * Create a new coaching request. Service assumes description is already scrubbed.
 */
async function createRequest({ playerId, game_title, target_rank, goal, budget, description,
    discord_tag, social_links, exact_username }) {
    const { rows } = await pool.query(
        `INSERT INTO coaching_requests
       (player_id, game_title, target_rank, goal, budget, description, discord_tag, social_links, exact_username)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
        [playerId, game_title, target_rank, goal, budget, description || null,
            discord_tag || null, social_links || null, exact_username || null]
    );
    return maskContactFields(rows[0]);
}

/**
 * Update a coaching request. Only the owner (playerId) can update.
 */
async function updateRequest(id, playerId, fields) {
    const { game_title, target_rank, goal, budget, description, status } = fields;

    const { rows } = await pool.query(
        `UPDATE coaching_requests
     SET game_title   = COALESCE($1, game_title),
         target_rank  = COALESCE($2, target_rank),
         goal         = COALESCE($3, goal),
         budget       = COALESCE($4, budget),
         description  = COALESCE($5, description),
         status       = COALESCE($6, status),
         updated_at   = NOW()
     WHERE id = $7 AND player_id = $8
     RETURNING *`,
        [game_title, target_rank, goal, budget, description, status, id, playerId]
    );

    if (rows.length === 0) return null; // Not found or not the owner
    return maskContactFields(rows[0]);
}

/**
 * Delete a coaching request. Only the owner can delete.
 */
async function deleteRequest(id, playerId) {
    const { rowCount } = await pool.query(
        'DELETE FROM coaching_requests WHERE id = $1 AND player_id = $2',
        [id, playerId]
    );
    return rowCount > 0;
}

module.exports = { getAllRequests, getRequestById, createRequest, updateRequest, deleteRequest };
