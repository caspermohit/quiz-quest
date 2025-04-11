import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizResultDetail.css';

const QuizResultDetail = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                const [resultResponse, attemptsResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/api/results/${resultId}`),
                    axios.get(`http://localhost:3001/api/attempts/${resultId}`)
                ]);
                setResult(resultResponse.data);
                setAttempts(attemptsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching result details:', err);
                setError(err.response?.data?.message || 'Failed to fetch result details');
                setLoading(false);
            }
        };

        fetchResultDetails();
    }, [resultId]);

    const handleReattempt = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/api/attempts`, {
                quizId: result.quiz._id,
                score: 0,
                correctAnswers: 0,
                totalQuestions: result.quiz.questions.length,
                responses: [],
                timeTaken: 0
            });

            if (response.data) {
                navigate(`/quiz/${result.quiz._id}`);
            }
        } catch (err) {
            console.error('Error creating new attempt:', err);
            setError(err.response?.data?.message || 'Failed to create new attempt');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading result details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/history')} className="back-button">
                    Back to History
                </button>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="error-container">
                <h2>Result Not Found</h2>
                <p>The requested quiz result could not be found.</p>
                <button onClick={() => navigate('/history')} className="back-button">
                    Back to History
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="result-detail-container">
            <div className="result-header">
                <h1>{result.quiz.title}</h1>
                <div className="result-meta">
                    <span className="category-tag" style={{ backgroundColor: result.quiz.category?.color || '#6c757d' }}>
                        {result.quiz.category?.name || 'Uncategorized'}
                    </span>
                    <span className="difficulty-tag">{result.quiz.difficulty}</span>
                </div>
            </div>

            <div className="result-summary">
                <div className="score-display">
                    <div className="score-value">{result.score.toFixed(1)}%</div>
                    <div className="score-details">
                        <p>{result.correctAnswers} of {result.totalQuestions} correct</p>
                        <p>Time taken: {formatTime(result.timeTaken)}</p>
                    </div>
                </div>
                <div className="completion-date">
                    Completed on {formatDate(result.completedAt)}
                </div>
            </div>

            {attempts.length > 1 && (
                <div className="attempt-history">
                    <h2>Attempt History</h2>
                    <div className="attempts-list">
                        {attempts.map((attempt, index) => (
                            <div key={attempt._id} className={`attempt-item ${attempt.isLatest ? 'latest' : ''}`}>
                                <div className="attempt-header">
                                    <span className="attempt-number">Attempt {index + 1}</span>
                                    {attempt.isLatest && <span className="latest-badge">Latest</span>}
                                </div>
                                <div className="attempt-details">
                                    <span className="attempt-score">{attempt.score.toFixed(1)}%</span>
                                    <span className="attempt-date">{formatDate(attempt.completedAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="questions-container">
                <h2>Question Review</h2>
                {result.responses.map((response, index) => (
                    <div key={index} className={`question-item ${response.isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="question-header">
                            <span className="question-number">Question {index + 1}</span>
                            {response.isCorrect ? (
                                <span className="result-indicator correct">Correct</span>
                            ) : (
                                <span className="result-indicator incorrect">Incorrect</span>
                            )}
                        </div>
                        <div className="question-text">{response.questionText}</div>
                        <div className="answer-section">
                            <div className="user-answer">
                                <span className="label">Your Answer:</span>
                                <span className={`answer ${response.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {response.selectedAnswer}
                                </span>
                            </div>
                            {!response.isCorrect && (
                                <div className="correct-answer">
                                    <span className="label">Correct Answer:</span>
                                    <span className="answer correct">
                                        {result.quiz.questions[index].correctAnswer}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="result-actions">
                <button onClick={() => navigate('/history')} className="back-button">
                    Back to History
                </button>
                <button 
                    onClick={handleReattempt}
                    className="retry-button"
                >
                    Retry Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizResultDetail; 