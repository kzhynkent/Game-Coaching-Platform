const { getAllCoaches, getCoachById, updateMyProfile } = require('../services/coachService');

/** GET /api/coaches */
async function getAll(req, res) {
    try {
        const coaches = await getAllCoaches();
        return res.status(200).json({ success: true, data: coaches });
    } catch (err) {
        console.error('[coachController.getAll]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to retrieve coach profiles.' });
    }
}

/** GET /api/coaches/:id */
async function getOne(req, res) {
    try {
        const coach = await getCoachById(req.params.id);
        if (!coach) {
            return res.status(404).json({ success: false, error: 'Coach profile not found.' });
        }
        return res.status(200).json({ success: true, data: coach });
    } catch (err) {
        console.error('[coachController.getOne]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to retrieve coach profile.' });
    }
}

/** PUT /api/coaches/me — Update authenticated coach's own profile */
async function updateMe(req, res) {
    const { bio, game_expertise, rank } = req.body;

    // Validate game_expertise is an array if provided
    if (game_expertise !== undefined && !Array.isArray(game_expertise)) {
        return res.status(400).json({
            success: false,
            error: 'game_expertise must be an array of strings.',
        });
    }

    try {
        const updated = await updateMyProfile(req.user.userId, { bio, game_expertise, rank });
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Coach profile not found.' });
        }
        return res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error('[coachController.updateMe]', err.message);
        return res.status(500).json({ success: false, error: 'Failed to update coach profile.' });
    }
}

module.exports = { getAll, getOne, updateMe };
