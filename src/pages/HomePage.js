import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Quiz App</h1>
        <p>Test your knowledge with our interactive quizzes</p>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        ) : (
          <Link to="/quizzes" className="btn btn-primary">Browse Quizzes</Link>
        )}
      </div>
    </div>
  );
};

export default HomePage; 