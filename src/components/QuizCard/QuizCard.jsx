import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizCard.css';

const QuizCard = ({ quiz, isHistory = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizId, setQuizId] = useState(quiz._id);
    const [quizDetails, setQuiz] = useState(null);

    const handleTakeQuiz = () => {
        navigate(`/quiz/${quiz._id}`);
    };

    // Get difficulty badge class based on quiz difficulty
    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'difficulty-badge easy';
            case 'medium':
                return 'difficulty-badge medium';
            case 'hard':
                return 'difficulty-badge hard';
            default:
                return 'difficulty-badge';
        }
    };

    // Get category color based on category name
    const getCategoryColor = (categoryName) => {
        if (!categoryName) return '#4CAF50'; // Default color
        
        // Simple hash function to generate consistent colors
        const hash = categoryName.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        const colors = [
            '#4CAF50', // Green
            '#2196F3', // Blue
            '#9C27B0', // Purple
            '#FF9800', // Orange
            '#E91E63', // Pink
            '#00BCD4', // Cyan
            '#8BC34A', // Light Green
            '#FF5722', // Deep Orange
            '#673AB7', // Deep Purple
            '#009688'  // Teal
        ];
        
        return colors[Math.abs(hash) % colors.length];
    };

    // Format date for history view
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/quizzes/${quizId}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                console.log('Quiz Data:', response.data); // Log the quiz data
                setQuiz(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load quiz');
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    return (
        <div className={`quiz-card ${isHistory ? 'history-view' : ''}`}>
            <div className="quiz-card-header">
                <h3 className="quiz-title">{quiz.title}</h3>
                <div className="quiz-meta">
                    <span className={getDifficultyClass(quiz.difficulty)}>
                        {quiz.difficulty || 'Not Specified'}
                    </span>
                    <span className="questions-count">
                        {quiz.questions?.length || 0} questions
                    </span>
                </div>
            </div>

            <div className="quiz-card-body">
                <p className="quiz-description">{quiz.description}</p>
                
                <div 
                    className="category-tag"
                    style={{ 
                        backgroundColor: getCategoryColor(quiz.category?.name),
                        borderColor: getCategoryColor(quiz.category?.name)
                    }}
                >
                    <span className="category-icon">
                        {quiz.category?.icon || '📚'}
                    </span>
                    <span className="category-name">
                        {quiz.category?.name || 'Uncategorized'}
                    </span>
                </div>

                {isHistory && (
                    <div className="quiz-history-info">
                        <div className="score-display">
                            <span className="score-label">Score:</span>
                            <span className={`score-value ${quiz.score >= 70 ? 'passed' : 'failed'}`}>
                                {quiz.score}%
                            </span>
                        </div>
                        <div className="completion-date">
                            Completed: {formatDate(quiz.completedAt)}
                        </div>
                    </div>
                )}

                {!isHistory && (
                    <div className="quiz-stats">
                        <div className="stat-item">
                            <span className="stat-label">Attempts</span>
                            <span className="stat-value">{quiz.totalAttempts || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Rating</span>
                            <span className="stat-value">
                                {quiz.averageRating ? quiz.averageRating.toFixed(1) : 'N/A'}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Avg Score</span>
                            <span className="stat-value">
                                {quiz.averageScore ? `${quiz.averageScore}%` : 'N/A'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!isHistory && (
                <div className="quiz-card-footer">
                    <button 
                        className="take-quiz-btn"
                        onClick={handleTakeQuiz}
                    >
                        Take Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizCard; 