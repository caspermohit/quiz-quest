// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/login"
                            element={
                                <GuestRoute>
                                    <LoginPage />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <GuestRoute>
                                    <RegisterPage />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/quizzes"
                            element={
                                <ProtectedRoute>
                                    <QuizListPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quiz/:id"
                            element={
                                <ProtectedRoute>
                                    <QuizPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quizzes/:id"
                            element={
                                <ProtectedRoute>
                                    <QuizPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/results/:id"
                            element={
                                <ProtectedRoute>
                                    <ResultsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute>
                                    <QuizHistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <LeaderboardPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
