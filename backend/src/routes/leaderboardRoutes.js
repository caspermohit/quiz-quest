const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const { broadcastLeaderboardUpdate } = require('../server');

// @route   GET api/leaderboard
// @desc    Get leaderboard entries with optional filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { quizId, limit = 10 } = req.query;
        
        const results = await Result.find({ quizId })
            .populate('userId', 'username')
            .sort({ score: -1, timeTaken: 1 })
            .limit(parseInt(limit));
            
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST api/leaderboard
// @desc    Add a new score to the leaderboard
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const {
            quizId,
            score,
            correctAnswers,
            totalQuestions,
            timeTaken,
            category,
            difficulty
        } = req.body;

        const newEntry = new Result({
            userId: req.user.id,
            userName: req.user.username,
            quizId,
            score,
            correctAnswers,
            totalQuestions,
            timeTaken,
            category,
            difficulty
        });

        await newEntry.save();

        // Broadcast real-time update
        broadcastLeaderboardUpdate();

        res.json(newEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/leaderboard/categories
// @desc    Get unique categories from leaderboard
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Quiz.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET api/leaderboard/difficulties
// @desc    Get unique difficulties from leaderboard
// @access  Public
router.get('/difficulties', async (req, res) => {
    try {
        const difficulties = await Quiz.distinct('difficulty');
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 