const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// Get all results for a user
router.get('/user', auth, async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user.id })
            .populate('quizId', 'title category')
            .sort({ completedAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single result
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('quizId', 'title category');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        if (result.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit a quiz result
router.post('/', auth, async (req, res) => {
    try {
        const result = new Result({
            ...req.body,
            userId: req.user.id
        });
        const savedResult = await result.save();
        res.status(201).json(savedResult);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 