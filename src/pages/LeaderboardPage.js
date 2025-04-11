import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, categoriesRes, difficultiesRes] = await Promise.all([
          axios.get('http://localhost:3001/api/leaderboard'),
          axios.get('http://localhost:3001/api/leaderboard/categories'),
          axios.get('http://localhost:3001/api/leaderboard/difficulties')
        ]);

        setLeaderboard(leaderboardRes.data);
        setCategories(categoriesRes.data);
        setDifficulties(difficultiesRes.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLeaderboard = leaderboard.filter(entry => {
    if (selectedCategory !== 'all' && entry.quiz.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && entry.quiz.difficulty !== selectedDifficulty) return false;
    return true;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      <div className="filter-controls">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>
      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry, index) => (
              <tr key={entry._id}>
                <td>{index + 1}</td>
                <td>{entry.user.username}</td>
                <td>{entry.quiz.title}</td>
                <td>{entry.score}%</td>
                <td>{entry.timeTaken}s</td>
                <td>{new Date(entry.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage; 