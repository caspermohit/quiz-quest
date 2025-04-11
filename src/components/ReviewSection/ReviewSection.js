import React from 'react';
import './ReviewSection.css';

const ReviewSection = ({ questions }) => {
    return (
        <div className="review-container">
            <h2 className="review-title">Review Your Answers</h2>
            {questions.map((question, index) => (
                <div key={question.questionId} className="question-review">
                    <div className="question-header">
                        <div className="question-number">
                            Question {index + 1} of {questions.length}
                        </div>
                        <div className={`status-indicator ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                            {question.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                    </div>
                    
                    <div className="question-text">
                        {question.text}
                    </div>
                    
                    <div className="question-options">
                        {question.options.map((option, optIndex) => (
                            <div 
                                key={optIndex}
                                className={`option ${
                                    question.userAnswer === option 
                                        ? question.isCorrect 
                                            ? 'correct' 
                                            : 'incorrect' 
                                        : option === question.correctAnswer
                                            ? 'correct-answer'
                                            : 'neutral'
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                    
                    <div className="answer-section">
                        <div className="user-answer">
                            <span className="answer-label">Your Answer: </span>
                            <span className={question.isCorrect ? 'correct' : 'incorrect'}>
                                {question.userAnswer}
                            </span>
                        </div>
                        
                        {!question.isCorrect && (
                            <div className="correct-answer">
                                <span className="answer-label">Correct Answer: </span>
                                <span className="correct">{question.correctAnswer}</span>
                            </div>
                        )}
                    </div>

                    {!question.isCorrect && (
                        <div className="explanation">
                            <p>
                                The correct answer is "{question.correctAnswer}" because it matches the expected response.
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewSection; 