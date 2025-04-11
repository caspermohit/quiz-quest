import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCard/QuizCard';
import './QuizListPage.css';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/quizzes', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load quizzes');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quiz-list-page">
      <h1>Available Quizzes</h1>
      <div className="quiz-grid">
        {quizzes.map(quiz => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizListPage; 