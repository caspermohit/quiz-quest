const mongoose = require('mongoose');
const { Question, Quiz } = require('../models');

const createQuiz = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/quiz-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create questions first
        const questions = await Question.insertMany([
            {
                questionId: 'hist1',
                text: 'Who was the first president of the United States?',
                options: [
                    { text: 'George Washington' },
                    { text: 'Thomas Jefferson' },
                    { text: 'Abraham Lincoln' },
                    { text: 'Franklin D. Roosevelt' }
                ],
                correctAnswer: 0,
                category: 'History',
                difficulty: 'Easy'
            },
            {
                questionId: 'hist2',
                text: 'What year did World War II end?',
                options: [
                    { text: '1943' },
                    { text: '1945' },
                    { text: '1947' },
                    { text: '1949' }
                ],
                correctAnswer: 1,
                category: 'History',
                difficulty: 'Medium'
            }
        ]);

        console.log('Questions created successfully');

        // Create quiz with references to the questions
        const quiz = new Quiz({
            quizId: 'hist-quiz-1',
            title: 'American History Basics',
            description: 'Test your knowledge of American history',
            category: 'History',
            timeLimit: 20,
            passingScore: 60,
            questions: questions.map(q => q._id) // Use the _id references
        });

        await quiz.save();
        console.log('Quiz created successfully');

        // Verify the quiz was created with populated questions
        const createdQuiz = await Quiz.findById(quiz._id)
            .populate('questions')
            .exec();

        console.log('Created quiz with questions:', JSON.stringify(createdQuiz, null, 2));

    } catch (error) {
        console.error('Error creating quiz:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createQuiz(); 