import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../QuizCard/QuizCard';
import CategorySelector from '../CategorySelector/CategorySelector';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes(selectedCategory);
    }, [selectedCategory]);

    const fetchQuizzes = async (category) => {
        try {
            setLoading(true);
            setError(null);

            const url = category === 'all' 
                ? 'http://localhost:3001/api/quizzes'
                : `http://localhost:3001/api/quizzes?category=${category}`;

            const response = await axios.get(url);
            setQuizzes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            setError('Failed to load quizzes');
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    if (loading && quizzes.length === 0) {
        return <div className="quiz-list loading">Loading quizzes...</div>;
    }

    if (error && quizzes.length === 0) {
        return <div className="quiz-list error">{error}</div>;
    }

    return (
        <div className="quiz-list-container">
            <h1>Available Quizzes</h1>
            <CategorySelector 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />
            
            {quizzes.length === 0 ? (
                <div className="no-quizzes">
                    <p>No quizzes available in this category.</p>
                </div>
            ) : (
                <div className="quiz-grid">
                    {quizzes.map(quiz => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizList; 