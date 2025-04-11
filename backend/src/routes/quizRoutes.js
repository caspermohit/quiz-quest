const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('createdBy', 'username')
            .populate('category', 'name color')
            .sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('category', 'name color');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const { answers } = req.body;
        let correctAnswers = 0;
        const responses = [];

        // Calculate score and create responses
        quiz.questions.forEach((question) => {
            const userAnswer = answers[question._id];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            
            responses.push({
                questionId: question._id,
                selectedAnswer: userAnswer,
                isCorrect
            });
        });

        const score = (correctAnswers / quiz.questions.length) * 100;

        // Create result
        const result = new Result({
            userId: req.user.id,
            quizId: quiz._id,
            score,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            responses,
            timeTaken: 0
        });

        await result.save();

        // Update quiz statistics
        await quiz.updateStatistics(score);

        res.json({
            score,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            resultId: result._id
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new quiz
router.post('/', auth, async (req, res) => {
    try {
        const quiz = new Quiz({
            ...req.body,
            createdBy: req.user.id
        });
        const savedQuiz = await quiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a quiz
router.put('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quiz.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this quiz' });
        }
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a quiz
router.delete('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quiz.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }
        await quiz.remove();
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 