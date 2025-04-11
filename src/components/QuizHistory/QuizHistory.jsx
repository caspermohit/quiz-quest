import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import QuizCard from '../QuizCard/QuizCard';
import './QuizHistory.css';

const QuizHistory = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'passed', 'failed'
    const [sortBy, setSortBy] = useState('date'); // 'date', 'score', 'title'

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5001/api/results/user', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch quiz history');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredResults = results.filter(result => {
        if (filter === 'passed') return result.score >= 70;
        if (filter === 'failed') return result.score < 70;
        return true;
    });

    const sortedResults = [...filteredResults].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'score':
                return b.score - a.score;
            case 'title':
                return a.quiz.title.localeCompare(b.quiz.title);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="quiz-history-loading">
                <div className="loader"></div>
                <p>Loading your quiz history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-history-error">
                <p className="error-message">{error}</p>
                <button 
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-history-container">
            <div className="quiz-history-header">
                <h1>Quiz History</h1>
                <div className="quiz-history-controls">
                    <div className="filter-control">
                        <label htmlFor="filter">Filter:</label>
                        <select 
                            id="filter" 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Quizzes</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="sort-control">
                        <label htmlFor="sort">Sort by:</label>
                        <select 
                            id="sort" 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Date</option>
                            <option value="score">Score</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedResults.length === 0 ? (
                <div className="no-results">
                    <p>No quiz results found.</p>
                    <Link to="/quizzes" className="take-quiz-link">
                        Take a Quiz
                    </Link>
                </div>
            ) : (
                <div className="quiz-history-grid">
                    {sortedResults.map((result) => (
                        <Link
                            key={result._id}
                            to={`/results/${result._id}`}
                            className="quiz-history-link"
                        >
                            <QuizCard
                                quiz={{
                                    ...result.quiz,
                                    score: result.score,
                                    completedAt: result.createdAt
                                }}
                                isHistory={true}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizHistory; 