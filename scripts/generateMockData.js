const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Sample questions data
const sampleQuestions = [
    {
        questionId: 'tech1',
        text: 'What is the primary purpose of a database index?',
        options: [
            { text: 'To store data permanently' },
            { text: 'To improve query performance' },
            { text: 'To encrypt sensitive data' },
            { text: 'To backup data automatically' }
        ],
        correctAnswer: 1,
        category: 'Technology',
        difficulty: 'Medium'
    },
    {
        questionId: 'tech2',
        text: 'Which programming language is known for its use in web development?',
        options: [
            { text: 'Java' },
            { text: 'Python' },
            { text: 'JavaScript' },
            { text: 'C++' }
        ],
        correctAnswer: 2,
        category: 'Technology',
        difficulty: 'Easy'
    },
    {
        questionId: 'hist1',
        text: 'Who was the first President of the United States?',
        options: [
            { text: 'Thomas Jefferson' },
            { text: 'George Washington' },
            { text: 'Abraham Lincoln' },
            { text: 'John Adams' }
        ],
        correctAnswer: 1,
        category: 'History',
        difficulty: 'Easy'
    }
];

// Sample quizzes data
const sampleQuizzes = [
    {
        quizId: 'tech-quiz-1',
        title: 'Technology Fundamentals',
        description: 'Test your knowledge of basic technology concepts',
        category: 'Technology',
        timeLimit: 30,
        passingScore: 70
    },
    {
        quizId: 'hist-quiz-1',
        title: 'American History Basics',
        description: 'Test your knowledge of American history',
        category: 'History',
        timeLimit: 20,
        passingScore: 60
    }
];

// Sample user data
const sampleUsers = [
    {
        userId: 'user1',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        preferences: {
            categories: ['Technology', 'History'],
            difficulty: 'Medium'
        }
    }
];

async function generateMockData() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/quiz-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing data
        await Question.deleteMany({});
        await Quiz.deleteMany({});
        await User.deleteMany({});

        // Insert questions
        const questions = await Question.insertMany(sampleQuestions);
        console.log('Questions inserted successfully');

        // Insert users
        const users = await User.insertMany(sampleUsers);
        console.log('Users inserted successfully');

        // Group questions by category
        const questionsByCategory = questions.reduce((acc, question) => {
            if (!acc[question.category]) {
                acc[question.category] = [];
            }
            acc[question.category].push(question._id);
            return acc;
        }, {});

        // Create and insert quizzes one by one
        const insertedQuizzes = [];
        for (const quizData of sampleQuizzes) {
            const quiz = new Quiz({
                ...quizData,
                questions: questionsByCategory[quizData.category] || []
            });
            const savedQuiz = await quiz.save();
            insertedQuizzes.push(savedQuiz);
        }
        console.log('Quizzes inserted successfully');

        // Update user with quiz results
        const user = users[0];
        const quizResults = insertedQuizzes.map(quiz => ({
            quizId: quiz._id,
            score: Math.floor(Math.random() * 100),
            passed: true,
            date: new Date()
        }));

        await User.findByIdAndUpdate(user._id, {
            $set: { quizResults }
        });
        console.log('User quiz results updated successfully');

        console.log('Mock data generation completed successfully');
    } catch (error) {
        console.error('Error generating mock data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

generateMockData(); 