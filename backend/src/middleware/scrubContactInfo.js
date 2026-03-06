/**
 * Middleware: Scrubs contact-leaking patterns from req.body.description.
 *
 * Strips the following from free-text fields BEFORE the controller is reached:
 *   - Discord tags  (e.g., username#1234)
 *   - URLs          (e.g., http://discord.gg/abc)
 *   - Email addresses
 *   - Phone numbers (various formats)
 *
 * This is the ONLY place scrubbing occurs (Single Responsibility Principle).
 * The service layer assumes all data it receives is already clean.
 */

const PATTERNS = [
    // Discord tags: word#4digits
    /\b\w+#\d{4}\b/gi,
    // URLs: http/https/ftp
    /https?:\/\/[^\s]+/gi,
    // Plain URLs without scheme (e.g., discord.gg/abc or www.example.com)
    /\b(?:www\.|discord\.gg\/|t\.me\/)[^\s]*/gi,
    // Email addresses
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi,
    // Phone numbers: supports +1 (123) 456-7890, 123-456-7890, etc.
    /(\+?\d{1,3}[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/g,
];

function scrubContactInfo(req, res, next) {
    if (req.body && typeof req.body.description === 'string') {
        let scrubbed = req.body.description;
        for (const pattern of PATTERNS) {
            scrubbed = scrubbed.replace(pattern, '[removed]');
        }
        req.body.description = scrubbed;
    }
    next();
}

module.exports = scrubContactInfo;
