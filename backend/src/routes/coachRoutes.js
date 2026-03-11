const express = require('express');
const router = express.Router();
const { authenticate, requireCoach } = require('../middleware/authenticate');
const { getAll, getOne, updateMe } = require('../controllers/coachController');

// Public routes — anyone can browse coach profiles
router.get('/', getAll);
router.get('/:id', getOne);

// Protected — only the authenticated coach can update their own profile
router.put('/me', authenticate, requireCoach, updateMe);

module.exports = router;
