const { Quiz, Question } = require('./models');

// Create a new quiz
const quiz = new Quiz({
    quizId: 'quiz1',
    title: 'History Quiz',
    category: 'History'
});

// Create questions
const question1 = new Question({
    questionId: 'q1',
    text: 'Who was the first president of the United States?',
    options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'Franklin D. Roosevelt'],
    correctAnswer: 'George Washington',
    quiz: quiz._id // Linking question to quiz
});

const question2 = new Question({
    questionId: 'q2',
    text: 'What year did World War II end?',
    options: ['1943', '1945', '1947', '1950'],
    correctAnswer: '1945',
    quiz: quiz._id // Linking question to quiz
});

// Save quiz and questions
async function saveQuizAndQuestions() {
    try {
        // Save the quiz first
        const savedQuiz = await quiz.save();
        console.log('Quiz saved successfully:', savedQuiz);

        // Save questions with the quiz reference
        const savedQuestion1 = await question1.save();
        console.log('Question 1 saved successfully:', savedQuestion1);

        const savedQuestion2 = await question2.save();
        console.log('Question 2 saved successfully:', savedQuestion2);

        // Update quiz with question references
        savedQuiz.questions = [savedQuestion1._id, savedQuestion2._id];
        await savedQuiz.save();
        console.log('Quiz updated with question references');

        // Example of querying with populated questions
        const populatedQuiz = await Quiz.findById(savedQuiz._id)
            .populate('questions')
            .exec();
        console.log('Populated quiz:', populatedQuiz);

    } catch (err) {
        console.error('Error saving quiz and questions:', err);
    }
}

// Call the function
saveQuizAndQuestions(); 