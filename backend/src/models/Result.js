const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    responses: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number,
        isCorrect: Boolean
    }],
    timeTaken: {
        type: Number, // in seconds
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
resultSchema.index({ userId: 1, completedAt: -1 });
resultSchema.index({ quizId: 1, score: -1 });

// Virtual property for percentage score
resultSchema.virtual('percentageScore').get(function() {
    return (this.score / this.totalQuestions) * 100;
});

// Method to check if score is passing (assuming 60% is passing)
resultSchema.methods.isPassingScore = function() {
    return this.percentageScore >= 60;
};

// Pre-save middleware to ensure correctAnswers doesn't exceed totalQuestions
resultSchema.pre('save', function(next) {
    if (this.correctAnswers > this.totalQuestions) {
        this.correctAnswers = this.totalQuestions;
    }
    next();
});

module.exports = mongoose.model('Result', resultSchema); 