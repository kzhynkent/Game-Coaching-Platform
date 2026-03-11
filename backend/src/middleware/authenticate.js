const jwt = require('jsonwebtoken');

/**
 * Reads the JWT from the secure httpOnly 'auth_token' cookie.
 * Returns the token string or null if absent.
 */
function extractToken(req) {
    return req.cookies ? req.cookies.auth_token : null;
}

/**
 * Middleware: Verifies the JWT from the httpOnly 'auth_token' cookie.
 * Attaches req.user = { userId, role } on success.
 * Returns 401 if the token is missing or invalid.
 */
function authenticate(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Session is invalid or has expired. Please log in again.' });
    }
}

/**
 * Middleware: Attempts JWT verification but NEVER blocks the request.
 * Sets req.user = { userId, role } on success, or null if no/invalid token.
 * Used on public routes where subscription status must still be checked.
 */
function optionalAuthenticate(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
    } catch {
        req.user = null;
    }

    next();
}

/**
 * Middleware: Ensures the authenticated user has the 'player' role.
 * Must be used AFTER the authenticate middleware.
 */
function requirePlayer(req, res, next) {
    if (!req.user || req.user.role !== 'player') {
        return res.status(403).json({ success: false, error: 'Access denied. Only players can perform this action.' });
    }
    next();
}

/**
 * Middleware: Ensures the authenticated user has the 'coach' role.
 * Must be used AFTER the authenticate middleware.
 */
function requireCoach(req, res, next) {
    if (!req.user || req.user.role !== 'coach') {
        return res.status(403).json({ success: false, error: 'Access denied. Only coaches can perform this action.' });
    }
    next();
}

module.exports = { authenticate, optionalAuthenticate, requirePlayer, requireCoach };
