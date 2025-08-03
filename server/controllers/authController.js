const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
    });
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validate input fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({ 
            id: User._id,
            user: newUser,
            token: generateToken(User._id) // Generate and return JWT token
         });
    } catch (error) {
        res.status(500)
        .json({ message: 'Server error', error: error.message });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id) // Generate and return JWT token
        });
    } catch (error) {
        res.status(500)
        .json({ message: 'Server error', error: error.message });
    }
}

// Get user information
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500)
        .json({ message: 'Server error', error: error.message });
    }
}
