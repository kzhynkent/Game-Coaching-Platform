const jwt = require('jsonwebtoken');

/**
 * Middleware: Verifies the JWT from the Authorization header.
 * Attaches req.user = { userId, role } on success.
 * Returns 401 if the token is missing or invalid.
 */
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please provide a valid token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Token is invalid or has expired.' });
    }
}

/**
 * Middleware: Ensures the authenticated user has the 'player' role.
 * Must be used AFTER the authenticate middleware.
 */
function requirePlayer(req, res, next) {
    if (req.user.role !== 'player') {
        return res.status(403).json({ success: false, error: 'Access denied. Only players can perform this action.' });
    }
    next();
}

module.exports = { authenticate, requirePlayer };
