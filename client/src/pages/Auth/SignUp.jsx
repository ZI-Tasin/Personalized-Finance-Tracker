import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import ProfilePicSelector from '../../components/Inputs/ProfilePicSelector';
import UploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Handle Sign Up Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before proceeding

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

        let profileImageUrl = null; // Initialize profile image URL

        // If validation passes, proceed with sign up
        try {

            if (profilePic) {
                const imgUploadRes = await UploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || null;
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl,
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user); // Update user context with the new user data
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // Set error message from API response
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
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
