const { Quiz } = require('./models');

async function getAllQuizzes() {
    try {
        const quizzes = await Quiz.find()
            .populate('questions')
            .exec();
        console.log(quizzes);
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
}

getAllQuizzes(); 