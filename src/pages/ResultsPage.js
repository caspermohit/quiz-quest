import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';

const ResultsPage = () => {
    const { quizId, userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`http://localhost:3001/api/results/${quizId}/${userId}`);
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching results:', error);
                setError(error.response?.data?.message || 'Failed to fetch results');
                setLoading(false);
            }
        };

        if (location.state) {
            setResults(location.state);
            setLoading(false);
        } else {
            fetchResults();
        }
    }, [quizId, userId, location.state]);

    // Handle retry quiz
    const handleRetry = () => {
        navigate(`/quiz/${quizId}`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading results...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
                <button 
                    className="nav-button"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // No results state
    if (!results) {
        return (
            <div className="error">
                <h2>No Results Available</h2>
                <p>Sorry, we couldn't find the results you're looking for.</p>
                <button 
                    className="nav-button"
                    onClick={handleRetry}
                >
                    Try Quiz Again
                </button>
            </div>
        );
    }

    return (
        <div className="results-container">
            <h1>Quiz Results</h1>
            
            <div className="score-summary">
                <h2>Final Score: {results.score}%</h2>
                <p>Correct Answers: {results.correctAnswers} out of {results.totalQuestions}</p>
            </div>

            <div className="results-actions">
                <button 
                    className="nav-button"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
                
                <button 
                    className="nav-button retry-button"
                    onClick={handleRetry}
                >
                    Try Again
                </button>
            </div>

            {showDetails && (
                <div className="results-details">
                    <h3>Question Details</h3>
                    {results.responses.map((response, index) => (
                        <div 
                            key={index} 
                            className={`question-result ${response.isCorrect ? 'correct' : 'incorrect'}`}
                        >
                            <div className="question-text">
                                <strong>Question {index + 1}:</strong> {response.questionText}
                            </div>
                            <div className="answer-details">
                                <p>Your answer: {response.selectedAnswer}</p>
                                <p>Status: {response.isCorrect ? 'Correct' : 'Incorrect'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsPage; 