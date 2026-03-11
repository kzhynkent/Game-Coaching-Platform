const pool = require('../db');

/**
 * Applies the paywall masking rules to a single request object.
 *
 * Rules (in priority order):
 *  1. Pro-tier coach          → reveal real contact values
 *  2. Request owner (player)  → reveal real contact values (their own post)
 *  3. All others              → null out discord_tag, social_links, exact_username
 *
 * @param {object} request  - Raw row from coaching_requests table
 * @param {object} context  - { isProCoach: bool, requesterId: string|null }
 */
function maskContactFields(request, { isProCoach = false, requesterId = null } = {}) {
    const isOwner = requesterId && request.player_id === requesterId;

    if (isProCoach || isOwner) {
        return request; // No masking — authorized viewer
    }

    return {
        ...request,
        discord_tag: null,
        social_links: null,
        exact_username: null,
    };
}

/**
 * Get all open coaching requests (paginated).
 * Contact fields are conditionally masked based on requester context.
 *
 * @param {object} options  - { page, limit, isProCoach, requesterId }
 */
async function getAllRequests({ page = 1, limit = 20, isProCoach = false, requesterId = null } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
        `SELECT * FROM coaching_requests
         WHERE status = 'open'
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return rows.map((row) => maskContactFields(row, { isProCoach, requesterId }));
}

/**
 * Get a single coaching request by ID.
 * Contact fields are conditionally masked based on requester context.
 *
 * @param {string} id
 * @param {object} context  - { isProCoach, requesterId }
 */
async function getRequestById(id, { isProCoach = false, requesterId = null } = {}) {
    const { rows } = await pool.query('SELECT * FROM coaching_requests WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return maskContactFields(rows[0], { isProCoach, requesterId });
}

/**
 * Create a new coaching request. Service assumes description is already scrubbed.
 * The creating player is always the owner, so their contact fields are never masked.
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
    // Owner always sees their own contact fields
    return maskContactFields(rows[0], { requesterId: playerId });
}

/**
 * Update a coaching request. Only the owner (playerId) can update.
 * Returns the updated row with contact fields unmasked (owner context).
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

    if (rows.length === 0) return null;
    // Owner always sees their own contact fields
    return maskContactFields(rows[0], { requesterId: playerId });
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

