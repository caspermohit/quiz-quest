import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Quiz.css';

const Quiz = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/quizzes/${quizId}/submit`,
        { answers: selectedAnswers },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setScore(response.data.score);
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit quiz');
    }
  }, [quizId, selectedAnswers]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/quizzes/${quizId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        console.log(response.data);
        setQuiz(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  console.log(currentQuestion);

  return (
    <div className="quiz-container">
      <h1>{quiz.title}</h1>
      <div className="quiz-progress">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </div>
      <div className="question-container">
        <h2>{currentQuestion.text}</h2>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswers[currentQuestion._id] === option.text ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion._id, option.text)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button onClick={handleSubmit} disabled={submitted}>
            Submit
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))
            }
          >
            Next
          </button>
        )}
      </div>
      {submitted && (
        <div className="score-container">
          <h2>Your Score: {score}%</h2>
        </div>
      )}
    </div>
  );
};

export default Quiz; 