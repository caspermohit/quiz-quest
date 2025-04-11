const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Generate access token
const generateAccessToken = (user) => {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        type: 'access'
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

// Generate refresh token
const generateRefreshToken = (user) => {
    const payload = {
        _id: user._id,
        type: 'refresh'
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
};

// Generate both access and refresh tokens
const generateTokens = (user) => {
    return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user)
    };
};

// Verify token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Extract token from request header
const extractToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        return null;
    }

    return token;
};

// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
        return decoded.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
        return true;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyToken,
    extractToken,
    isTokenExpired
}; 