const express = require('express');
const router = express.Router();
const { authenticate, optionalAuthenticate, requirePlayer } = require('../middleware/authenticate');
const checkProSubscription = require('../middleware/checkProSubscription');
const scrubContactInfo = require('../middleware/scrubContactInfo');
const { getAll, getOne, create, update, remove } = require('../controllers/requestController');

// Public GET routes — optionalAuthenticate + checkProSubscription enables dynamic paywall
router.get('/', optionalAuthenticate, checkProSubscription, getAll);
router.get('/:id', optionalAuthenticate, checkProSubscription, getOne);

// Protected routes — require player JWT + regex scrubbing before controller
router.post('/', authenticate, requirePlayer, scrubContactInfo, create);
router.put('/:id', authenticate, requirePlayer, scrubContactInfo, update);
router.delete('/:id', authenticate, requirePlayer, remove);

module.exports = router;

