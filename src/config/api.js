const API_BASE_URL = 'http://localhost:5001';

export const API_ENDPOINTS = {
    auth: {
        register: `${API_BASE_URL}/api/auth/register`,
        login: `${API_BASE_URL}/api/auth/login`,
        refreshToken: `${API_BASE_URL}/api/auth/refresh-token`,
    },
    quiz: {
        list: `${API_BASE_URL}/api/quizzes`,
        detail: (id) => `${API_BASE_URL}/api/quizzes/${id}`,
        create: `${API_BASE_URL}/api/quizzes`,
        update: (id) => `${API_BASE_URL}/api/quizzes/${id}`,
        delete: (id) => `${API_BASE_URL}/api/quizzes/${id}`,
    },
    results: {
        user: `${API_BASE_URL}/api/results/user`,
        create: `${API_BASE_URL}/api/results`,
    },
    leaderboard: {
        get: `${API_BASE_URL}/api/leaderboard`,
    },
};

export default API_ENDPOINTS; 