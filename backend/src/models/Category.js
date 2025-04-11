const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'default-icon'
    },
    color: {
        type: String,
        default: '#000000'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalQuizzes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
categorySchema.index({ name: 1 });

// Method to update quiz count
categorySchema.methods.updateQuizCount = async function() {
    const Quiz = mongoose.model('Quiz');
    this.totalQuizzes = await Quiz.countDocuments({ category: this._id });
    await this.save();
};

// Pre-save middleware to ensure unique name
categorySchema.pre('save', async function(next) {
    const Category = mongoose.model('Category');
    const existingCategory = await Category.findOne({ 
        name: this.name,
        _id: { $ne: this._id }
    });
    
    if (existingCategory) {
        throw new Error('Category name must be unique');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema); 