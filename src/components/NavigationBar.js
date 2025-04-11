import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="main-nav">
            <Link to="/">Home</Link>
            {user && (
                <>
                    <Link to="/quizzes">Quizzes</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
            {!user && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default NavigationBar; 