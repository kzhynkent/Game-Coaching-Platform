const express = require('express');
const router = express.Router();
const { authenticate, requirePlayer } = require('../middleware/authenticate');
const scrubContactInfo = require('../middleware/scrubContactInfo');
const { getAll, getOne, create, update, remove } = require('../controllers/requestController');

// Public routes — no auth required, contact fields always masked by the service
router.get('/', getAll);
router.get('/:id', getOne);

// Protected routes — require player JWT + regex scrubbing before controller
router.post('/', authenticate, requirePlayer, scrubContactInfo, create);
router.put('/:id', authenticate, requirePlayer, scrubContactInfo, update);
router.delete('/:id', authenticate, requirePlayer, remove);

module.exports = router;
