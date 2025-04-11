const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            console.log('Missing required fields:', { username, email, password });
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                details: {
                    username: !username ? 'Username is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username }
            ]
        });

        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ 
                message: 'User already exists',
                field: existingUser.email === email.toLowerCase() ? 'email' : 'username'
            });
        }

        // Create new user (password will be hashed by the model's pre-save hook)
        const user = new User({
            username,
            email: email.toLowerCase(),
            password
        });

        console.log('Attempting to save new user:', { username, email: email.toLowerCase() });

        // Save user
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log('User registered successfully:', { userId: user._id });

        // Send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error creating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 