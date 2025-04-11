const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    explanation: String
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    questions: [questionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attemptsAllowed: {
        type: Number,
        default: 1
    },
    tags: [String],
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
quizSchema.index({ title: 'text', description: 'text' });
quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1, createdAt: -1 });

// Virtual property for total questions
quizSchema.virtual('totalQuestions').get(function() {
    return this.questions.length;
});

// Method to update quiz statistics
quizSchema.methods.updateStatistics = async function(score) {
    this.totalAttempts += 1;
    this.averageScore = ((this.averageScore * (this.totalAttempts - 1)) + score) / this.totalAttempts;
    await this.save();
};

// Method to update rating
quizSchema.methods.updateRating = async function(newRating) {
    this.totalRatings += 1;
    this.averageRating = ((this.averageRating * (this.totalRatings - 1)) + newRating) / this.totalRatings;
    await this.save();
};

// Pre-save middleware to ensure unique questions
quizSchema.pre('save', function(next) {
    const seen = new Set();
    this.questions = this.questions.filter(question => {
        const key = question.text;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
    next();
});

module.exports = mongoose.model('Quiz', quizSchema); 