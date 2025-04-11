import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Quiz from '../components/Quiz/Quiz';
import './QuizPage.css';

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/quizzes/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setQuiz(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="quiz-page">
      <Quiz quizId={id} />
    </div>
  );
};

export default QuizPage; 