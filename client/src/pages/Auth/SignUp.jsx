import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';
import ProfilePicSelector from '../../components/Inputs/ProfilePicSelector';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handle Sign Up Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!fullName || !email || !password) {
            setError('All fields are required.');
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

        // If validation passes, proceed with sign up
        try {
            // TODO: Implement API call for user registration.
            // TODO: Implement file upload logic for `profilePic`.

            // Placeholder navigation
            navigate('/dashboard');
        } catch (error) {
            setError('Sign up failed. Please try again.');
        }
    }

    return (
        <AuthLayout>
            <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Create Your Account</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Please fill in the details below to create your account.
                </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePicSelector
                        image={profilePic}
                        setImage={setProfilePic}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="Enter your full name"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="Enter your email"
                            type="email"
                        />
                        
                        <div className='col-span-2'>
                            <Input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                label="Password"
                                placeholder="Enter your password minimum 8 characters"
                                type="password"
                            />
                        </div>
                    </div>
                    
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                    
                    <button
                        type="submit"
                        className='btn-primary mt-4'
                    >
                        Create Account
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{' '}
                        <Link className='font-medium text-primary underline' to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

        </AuthLayout>
    );
};


export default SignUp;
