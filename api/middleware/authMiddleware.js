// verifies the jwt and attaches { userId } to req.user

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function authMiddleware(req, res, next) {
    // expected header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: 'no token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // decoded is what you signed: { userId: ... }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'invalid or expired token' });
    }
};
