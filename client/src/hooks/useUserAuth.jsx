import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

// Custom hook to protect routes that require authentication.
export const useUserAuth = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        // Check for the token in localStorage as the primary guard.
        // This prevents a flicker of the protected page on refresh.
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If there's no token, immediately redirect to the login page.
            navigate('/login');
        }
        
        // The dependency array ensures this effect runs whenever the navigate function
        // or the user object from context changes.
    }, [user, navigate]);
};
