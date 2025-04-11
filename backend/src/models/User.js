const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile: {
        avatar: String,
        bio: String
    },
    stats: {
        totalQuizzes: {
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
        },
        highestScore: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to update user statistics
userSchema.methods.updateStats = async function(score) {
    this.stats.totalAttempts += 1;
    this.stats.averageScore = ((this.stats.averageScore * (this.stats.totalAttempts - 1)) + score) / this.stats.totalAttempts;
    if (score > this.stats.highestScore) {
        this.stats.highestScore = score;
    }
    await this.save();
};

module.exports = mongoose.model('User', userSchema); 