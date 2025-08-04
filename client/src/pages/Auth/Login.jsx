import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    // Handle login logic here
    // This is a placeholder function, you would typically make an API call here
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before proceeding

        // Validate input fields
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // TODO: Call login API here
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
                    />

                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Enter your password minimum 8 characters"
                        type="password"
                    />

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button
                        type="submit"
                        className='btn-primary'
                    >
                        LOGIN
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
