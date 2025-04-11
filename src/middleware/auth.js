const jwt = require('jsonwebtoken');
const { verifyToken, extractToken } = require('../utils/tokenUtils');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        // Try to get token from cookies first
        let token = req.cookies.accessToken;

        // If no token in cookies, try to get from Authorization header
        if (!token) {
            token = extractToken(req);
        }

        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication required',
                error: 'No token provided'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Check if token is an access token
        if (decoded.type !== 'access') {
            return res.status(403).json({ 
                message: 'Invalid token type',
                error: 'Token must be an access token'
            });
        }

        // Find user and check if they exist
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'User associated with token no longer exists'
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Authentication error:', error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired',
                error: 'Please refresh your token'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token',
                error: 'Token verification failed'
            });
        }

        // Handle other errors
        res.status(500).json({ 
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Optional role-based access control middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied',
                error: 'Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
}; 