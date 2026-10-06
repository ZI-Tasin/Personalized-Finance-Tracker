import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/input';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before proceeding

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user); // Update user context with the logged-in user data
                navigate('/dashboard'); // Redirect to dashboard on successful login
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // Set error message from API response
            } else {
                setError('An error occurred while logging in. Please try again later.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout>
            <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Please enter your credentials to login to your account.
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        autoComplete="email"
                        required
                    />

                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button
                        type="submit"
                        className='btn-primary'
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Don't have an account?{' '}
                        <Link className='font-medium text-primary underline' to="/signup">
                            SignUp
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
