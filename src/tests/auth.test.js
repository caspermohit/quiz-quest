import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import QuizPage from '../pages/QuizPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock useHistory
const mockHistory = {
    push: jest.fn()
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockHistory
}));

// Wrapper component for testing with AuthProvider
const AuthWrapper = ({ children }) => (
    <BrowserRouter>
        <AuthProvider>
            {children}
        </AuthProvider>
    </BrowserRouter>
);

describe('Authentication Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue(null);
    });

    describe('Login Functionality', () => {
        it('should successfully log in a user', async () => {
            const mockToken = 'mock-token';
            axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

            render(
                <AuthWrapper>
                    <LoginPage />
                </AuthWrapper>
            );

            // Fill in login form
            fireEvent.change(screen.getByLabelText(/email/i), {
                target: { value: 'test@example.com' }
            });
            fireEvent.change(screen.getByLabelText(/password/i), {
                target: { value: 'password123' }
            });

            // Submit form
            fireEvent.click(screen.getByRole('button', { name: /login/i }));

            // Verify API call
            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    'http://localhost:5000/api/auth/login',
                    {
                        email: 'test@example.com',
                        password: 'password123'
                    }
                );
            });

            // Verify token storage
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);

            // Verify redirection
            expect(mockHistory.push).toHaveBeenCalledWith('/quizzes');
        });

        it('should handle login errors', async () => {
            axios.post.mockRejectedValueOnce(new Error('Login failed'));

            render(
                <AuthWrapper>
                    <LoginPage />
                </AuthWrapper>
            );

            // Fill in login form
            fireEvent.change(screen.getByLabelText(/email/i), {
                target: { value: 'test@example.com' }
            });
            fireEvent.change(screen.getByLabelText(/password/i), {
                target: { value: 'wrongpassword' }
            });

            // Submit form
            fireEvent.click(screen.getByRole('button', { name: /login/i }));

            // Verify error handling
            await waitFor(() => {
                expect(screen.getByText(/login failed/i)).toBeInTheDocument();
            });
        });
    });

    describe('Registration Functionality', () => {
        it('should successfully register a new user', async () => {
            const mockToken = 'mock-token';
            axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

            render(
                <AuthWrapper>
                    <RegisterPage />
                </AuthWrapper>
            );

            // Fill in registration form
            fireEvent.change(screen.getByLabelText(/name/i), {
                target: { value: 'Test User' }
            });
            fireEvent.change(screen.getByLabelText(/email/i), {
                target: { value: 'test@example.com' }
            });
            fireEvent.change(screen.getByLabelText(/password/i), {
                target: { value: 'password123' }
            });

            // Submit form
            fireEvent.click(screen.getByRole('button', { name: /register/i }));

            // Verify API call
            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    'http://localhost:5000/api/auth/register',
                    {
                        name: 'Test User',
                        email: 'test@example.com',
                        password: 'password123'
                    }
                );
            });

            // Verify token storage
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);

            // Verify redirection
            expect(mockHistory.push).toHaveBeenCalledWith('/quizzes');
        });
    });

    describe('Protected Routes', () => {
        it('should redirect to login when accessing protected route without authentication', () => {
            render(
                <AuthWrapper>
                    <QuizPage />
                </AuthWrapper>
            );

            expect(mockHistory.push).toHaveBeenCalledWith('/login');
        });

        it('should allow access to protected route when authenticated', () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');

            render(
                <AuthWrapper>
                    <QuizPage />
                </AuthWrapper>
            );

            expect(mockHistory.push).not.toHaveBeenCalled();
        });
    });

    describe('Token Persistence', () => {
        it('should maintain authentication after page refresh', () => {
            const mockToken = 'valid-token';
            mockLocalStorage.getItem.mockReturnValue(mockToken);

            render(
                <AuthWrapper>
                    <QuizPage />
                </AuthWrapper>
            );

            expect(mockHistory.push).not.toHaveBeenCalled();
            expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
        });

        it('should clear authentication on logout', () => {
            const { getByText } = render(
                <AuthWrapper>
                    <NavigationBar />
                </AuthWrapper>
            );

            fireEvent.click(getByText(/logout/i));

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
            expect(mockHistory.push).toHaveBeenCalledWith('/login');
            expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
        });
    });
}); 