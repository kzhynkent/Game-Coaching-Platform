const {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
} = require('../services/requestService');

const VALID_STATUSES = ['open', 'filled', 'cancelled'];

/** GET /api/requests */
async function getAll(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const requests = await getAllRequests({ page, limit });
        return res.status(200).json({ success: true, data: requests });
    } catch (err) {
        console.error('[requestController.getAll]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to retrieve requests.' });
    }
}

/** GET /api/requests/:id */
async function getOne(req, res) {
    try {
        const request = await getRequestById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, error: 'Coaching request not found.' });
        }
        return res.status(200).json({ success: true, data: request });
    } catch (err) {
        console.error('[requestController.getOne]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to retrieve request.' });
    }
}

/** POST /api/requests */
async function create(req, res) {
    const { game_title, target_rank, goal, budget, description, discord_tag, social_links, exact_username } = req.body;

    if (!game_title || !target_rank || !goal || budget === undefined) {
        return res.status(400).json({ success: false, error: 'game_title, target_rank, goal, and budget are required.' });
    }

    if (typeof budget !== 'number' || budget < 0) {
        return res.status(400).json({ success: false, error: 'Budget must be a non-negative number.' });
    }

    try {
        const newRequest = await createRequest({
            playerId: req.user.userId,
            game_title, target_rank, goal, budget,
            description, discord_tag, social_links, exact_username,
        });
        return res.status(201).json({ success: true, data: newRequest });
    } catch (err) {
        console.error('[requestController.create]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to create request.' });
    }
}

/** PUT /api/requests/:id */
async function update(req, res) {
    const { status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
        });
    }

    try {
        const updated = await updateRequest(req.params.id, req.user.userId, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Request not found or you do not own it.' });
        }
        return res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error('[requestController.update]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to update request.' });
    }
}

/** DELETE /api/requests/:id */
async function remove(req, res) {
    try {
        const deleted = await deleteRequest(req.params.id, req.user.userId);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Request not found or you do not own it.' });
        }
        return res.status(200).json({ success: true, message: 'Request deleted successfully.' });
    } catch (err) {
        console.error('[requestController.remove]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to delete request.' });
    }
}

module.exports = { getAll, getOne, create, update, remove };
