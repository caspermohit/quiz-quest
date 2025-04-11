import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const { quizId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const wsClient = new WebSocket('ws://localhost:5000');
        setWs(wsClient);

        const fetchData = async () => {
            try {
                const [leaderboardResponse, categoriesResponse, difficultiesResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/api/leaderboard?quizId=${quizId}`),
                    axios.get('http://localhost:3001/api/leaderboard/categories'),
                    axios.get('http://localhost:3001/api/leaderboard/difficulties')
                ]);

                setLeaderboard(leaderboardResponse.data);
                setCategories(categoriesResponse.data);
                setDifficulties(difficultiesResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching leaderboard data:', err);
                setError(err.response?.data?.message || 'Failed to fetch leaderboard data');
                setLoading(false);
            }
        };

        fetchData();

        // WebSocket message handler
        wsClient.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'leaderboardUpdate') {
                fetchData();
            }
        };

        // Clean up WebSocket connection
        return () => {
            wsClient.close();
        };
    }, [quizId]);

    const handleFilterChange = async (type, value) => {
        try {
            let url = 'http://localhost:3001/api/leaderboard?';
            if (quizId) url += `quizId=${quizId}&`;
            if (type === 'category') {
                setSelectedCategory(value);
                if (value) url += `category=${value}&`;
                if (selectedDifficulty) url += `difficulty=${selectedDifficulty}`;
            } else {
                setSelectedDifficulty(value);
                if (selectedCategory) url += `category=${selectedCategory}&`;
                if (value) url += `difficulty=${value}`;
            }

            const response = await axios.get(url);
            setLeaderboard(response.data);
        } catch (err) {
            console.error('Error filtering leaderboard:', err);
            setError(err.response?.data?.message || 'Failed to filter leaderboard');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            
            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="difficulty">Difficulty:</label>
                    <select
                        id="difficulty"
                        value={selectedDifficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        {difficulties.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                                {difficulty}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="leaderboard">
                <div className="leaderboard-header">
                    <div className="rank">Rank</div>
                    <div className="name">Player</div>
                    <div className="score">Score</div>
                    <div className="time">Time</div>
                    <div className="date">Date</div>
                </div>

                {leaderboard.map((entry, index) => (
                    <div key={entry._id} className={`leaderboard-entry ${index < 3 ? `top-${index + 1}` : ''}`}>
                        <div className="rank">{index + 1}</div>
                        <div className="name">{entry.userName}</div>
                        <div className="score">{entry.score.toFixed(1)}%</div>
                        <div className="time">{formatTime(entry.timeTaken)}</div>
                        <div className="date">{formatDate(entry.completedAt)}</div>
                    </div>
                ))}

                {leaderboard.length === 0 && (
                    <div className="no-entries">
                        No entries found for the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard; 