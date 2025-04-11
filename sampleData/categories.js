const Category = require('../models/Category');

const sampleCategories = [
    {
        name: 'History',
        description: 'Test your knowledge of historical events, figures, and civilizations from ancient times to modern history.',
        imageUrl: '/images/categories/history.jpg',
        isActive: true
    },
    {
        name: 'Science',
        description: 'Explore quizzes about physics, chemistry, biology, and other scientific disciplines.',
        imageUrl: '/images/categories/science.jpg',
        isActive: true
    },
    {
        name: 'Mathematics',
        description: 'Challenge yourself with mathematical concepts, formulas, and problem-solving.',
        imageUrl: '/images/categories/math.jpg',
        isActive: true
    },
    {
        name: 'Technology',
        description: 'Test your knowledge of computers, programming, and modern technological advancements.',
        imageUrl: '/images/categories/tech.jpg',
        isActive: true
    },
    {
        name: 'Geography',
        description: 'Learn about countries, capitals, landmarks, and geographical features around the world.',
        imageUrl: '/images/categories/geography.jpg',
        isActive: true
    },
    {
        name: 'Literature',
        description: 'Explore famous authors, books, and literary works from different periods and cultures.',
        imageUrl: '/images/categories/literature.jpg',
        isActive: true
    },
    {
        name: 'Sports',
        description: 'Test your knowledge of various sports, athletes, and sporting events.',
        imageUrl: '/images/categories/sports.jpg',
        isActive: true
    },
    {
        name: 'Entertainment',
        description: 'Quizzes about movies, music, television shows, and pop culture.',
        imageUrl: '/images/categories/entertainment.jpg',
        isActive: true
    }
];

const createCategories = async () => {
    try {
        // Check if categories already exist
        const existingCategories = await Category.find();
        if (existingCategories.length > 0) {
            console.log('Categories already exist, skipping creation');
            return;
        }

        // Create categories
        await Category.insertMany(sampleCategories);
        console.log('Sample categories created successfully');
    } catch (error) {
        console.error('Error creating categories:', error);
    }
};

module.exports = createCategories; 