const jwt = require('jsonwebtoken');
require('dotenv').config();

const getJwtSecret = () => process.env.JWT_SECRET || 'IqraFieldCRM_SuperSecureKey_2026#@!';

/**
 * Gatekeeper Middleware: Verifies JWT token from Authorization header.
 * Header format: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Unauthorized: Authentication token missing', 
                code: 'AUTH_TOKEN_MISSING' 
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7).trim() 
            : authHeader.trim();

        if (!token) {
            return res.status(401).json({ 
                error: 'Unauthorized: Malformed token', 
                code: 'AUTH_TOKEN_MALFORMED' 
            });
        }

        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded; // Contains id, role, email, name, branch_id
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Session expired. Please log in again.', 
                code: 'AUTH_TOKEN_EXPIRED' 
            });
        }
        return res.status(401).json({ 
            error: 'Unauthorized: Invalid authentication token', 
            code: 'AUTH_TOKEN_INVALID' 
        });
    }
};

module.exports = { verifyToken };
