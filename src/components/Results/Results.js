import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReviewSection from '../ReviewSection/ReviewSection';
import './Results.css';
import axios from 'axios';

// Mock data for testing
const mockResults = {
    finalScore: 5,
    totalQuestions: 10,
    questions: [
        {
            questionId: '1',
            questionText: 'What is React?',
            options: ['A library', 'A framework', 'A programming language', 'An operating system'],
            correctAnswer: 'A library',
            userAnswer: 'A framework',
            isCorrect: false
        },
        {
            questionId: '2',
            questionText: 'What is JSX?',
            options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax XML', 'JavaScript Syntax'],
            correctAnswer: 'JavaScript XML',
            userAnswer: 'JavaScript XML',
            isCorrect: true
        },
        {
            questionId: '3',
            questionText: 'What is a component in React?',
            options: ['A function that returns HTML', 'A class that extends React.Component', 'A reusable piece of UI', 'All of the above'],
            correctAnswer: 'All of the above',
            userAnswer: 'A reusable piece of UI',
            isCorrect: false
        }
    ]
};

const Results = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get data from location state or use mock data for testing
    const { quizData, userResponses, score, correctAnswers, totalQuestions } = location.state || mockResults;
    
    const [showDetails, setShowDetails] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [formattedQuestions, setFormattedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultId, setResultId] = useState(null);

    // Calculate percentage and format questions when component mounts
    useEffect(() => {
        if (score) {
            setPercentage(Math.round((score / totalQuestions) * 100));
        }

        if (quizData && userResponses) {
            const formatted = quizData.questions.map((question, index) => {
                const userResponse = userResponses[index];
                return {
                    questionId: question._id,
                    text: question.text,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    userAnswer: userResponse?.selectedAnswer,
                    isCorrect: userResponse?.isCorrect
                };
            });
            setFormattedQuestions(formatted);
        } else {
            // Use mock data if no real data is available
            setFormattedQuestions(mockResults.questions);
            setPercentage(Math.round((mockResults.finalScore / mockResults.totalQuestions) * 100));
        }
    }, [quizData, userResponses, score, totalQuestions]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/results/${resultId}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setResult(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch results');
                setLoading(false);
            }
        };

        fetchResults();
    }, [resultId]);

    // Handle retry quiz
    const handleRetry = () => {
        if (quizData?._id) {
            navigate(`/quiz/${quizData._id}`);
        } else {
            // If using mock data, navigate to a default quiz
            navigate('/quiz/1');
        }
    };

    // Handle review details
    const handleReview = () => {
        setShowDetails(!showDetails);
    };

    // Loading state
    if (!location.state && !mockResults) {
        return (
            <div className="error">
                <h2>No Results Available</h2>
                <p>Please complete a quiz to view results.</p>
                <Link to="/" className="btn home">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="results-container">
            <div className="results-summary">
                <h1>Quiz Complete!</h1>
                <div className="score-summary">
                    <div className="score-display">
                        <span className="score-value">{percentage}%</span>
                        <span className="score-label">Final Score</span>
                    </div>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-value">{correctAnswers || mockResults.finalScore}</span>
                            <span className="stat-label">Correct Answers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{totalQuestions || mockResults.totalQuestions}</span>
                            <span className="stat-label">Total Questions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="results-actions">
                <button 
                    className="action-button review-button"
                    onClick={handleReview}
                >
                    {showDetails ? 'Hide Review' : 'Show Review'}
                </button>
            </div>

            {showDetails && (
                <ReviewSection questions={formattedQuestions} />
            )}

            <div className="retry-button">
                <button 
                    className="btn retry"
                    onClick={handleRetry}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default Results; 