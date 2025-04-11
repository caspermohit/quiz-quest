const { mongoose } = require('./database');
const { Quiz, Question, UserResult } = require('./models');

// Sample Quiz data
const sampleQuizzes = [
    {
        quizId: "quiz1",
        title: "History Quiz",
        category: "History",
        questions: [], // Will be populated with question ObjectIds
        createdAt: new Date()
    },
    {
        quizId: "quiz2",
        title: "Science Quiz",
        category: "Science",
        questions: [], // Will be populated with question ObjectIds
        createdAt: new Date()
    }
];

// Sample Question data
const sampleQuestions = [
    {
        questionId: "q1",
        text: "Who was the first president of the United States?",
        options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Franklin D. Roosevelt"],
        correctAnswer: "George Washington",
        quiz: null, // Will be populated with quiz ObjectId
        createdAt: new Date()
    },
    {
        questionId: "q2",
        text: "What year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: "1945",
        quiz: null, // Will be populated with quiz ObjectId
        createdAt: new Date()
    },
    {
        questionId: "q3",
        text: "What is the largest planet in our solar system?",
        options: ["Earth", "Saturn", "Jupiter", "Uranus"],
        correctAnswer: "Jupiter",
        quiz: null, // Will be populated with quiz ObjectId
        createdAt: new Date()
    }
];

// Sample UserResult data
const sampleUserResults = [
    {
        user: new mongoose.Types.ObjectId(), // Mock user ID
        quiz: null, // Will be populated with quiz ObjectId
        score: 75,
        questions: [
            {
                question: null, // Will be populated with question ObjectId
                userAnswer: "George Washington"
            },
            {
                question: null, // Will be populated with question ObjectId
                userAnswer: "1945"
            }
        ],
        createdAt: new Date()
    }
];

// Function to seed the database with mock data
async function seedDatabase() {
    try {
        // Clear existing data
        await Quiz.deleteMany({});
        await Question.deleteMany({});
        await UserResult.deleteMany({});

        // Create and save quizzes
        const savedQuizzes = await Quiz.create(sampleQuizzes);
        console.log('Quizzes created:', savedQuizzes);

        // Create and save questions with quiz references
        const savedQuestions = [];
        for (let i = 0; i < sampleQuestions.length; i++) {
            const question = sampleQuestions[i];
            question.quiz = savedQuizzes[Math.floor(i / 2)]._id; // Distribute questions between quizzes
            const savedQuestion = await Question.create(question);
            savedQuestions.push(savedQuestion);
        }
        console.log('Questions created:', savedQuestions);

        // Update quizzes with question references
        for (let i = 0; i < savedQuizzes.length; i++) {
            const quizQuestions = savedQuestions.filter(q => q.quiz.equals(savedQuizzes[i]._id));
            savedQuizzes[i].questions = quizQuestions.map(q => q._id);
            await savedQuizzes[i].save();
        }

        // Create and save user results
        const savedUserResults = [];
        for (const result of sampleUserResults) {
            result.quiz = savedQuizzes[0]._id; // Associate with first quiz
            result.questions = result.questions.map((q, i) => ({
                question: savedQuestions[i]._id,
                userAnswer: q.userAnswer
            }));
            const savedResult = await UserResult.create(result);
            savedUserResults.push(savedResult);
        }
        console.log('User results created:', savedUserResults);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Export the mock data and seeding function
module.exports = {
    sampleQuizzes,
    sampleQuestions,
    sampleUserResults,
    seedDatabase
}; 