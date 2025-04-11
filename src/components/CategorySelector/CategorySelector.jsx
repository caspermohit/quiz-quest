import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategorySelector.css';

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3001/api/categories/with-count');
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="category-selector loading">Loading categories...</div>;
    }

    if (error) {
        return <div className="category-selector error">{error}</div>;
    }

    return (
        <div className="category-selector">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
                id="category-select"
                value={selectedCategory}
                onChange={onCategoryChange}
                className="form-control"
            >
                <option value="all">All Categories</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name} ({category.quizCount})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelector; 