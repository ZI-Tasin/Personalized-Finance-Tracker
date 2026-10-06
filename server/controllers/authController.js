const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.registerUser = async (req, res) => {
    const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!fullName || fullName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: 'Enter a name, valid email, and password between 8 and 128 characters.' });
    }
    try {
        let profileImageUrl = null;
        if (typeof req.body.profileImageUrl === 'string') {
            try {
                const imageUrl = new URL(req.body.profileImageUrl);
                if (imageUrl.host === req.get('host') && /^\/uploads\/\d+-[a-f0-9]+\.(jpg|png|gif|webp)$/.test(imageUrl.pathname)) {
                    profileImageUrl = imageUrl.href;
                }
            } catch {
                profileImageUrl = null;
            }
        }
        const user = await User.create({ fullName, email, password, profileImageUrl });
        const safeUser = await User.findById(user._id).select('-password');
        return res.status(201).json({ user: safeUser, token: generateToken(user._id) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
        if (error.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted account details.' });
        console.error('Registration failed:', error.message);
        return res.status(500).json({ message: 'Unable to create account right now.' });
    }
};

exports.loginUser = async (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const safeUser = await User.findById(user._id).select('-password');
        return res.json({ id: user._id, user: safeUser, token: generateToken(user._id) });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ message: 'Unable to sign in right now.' });
    }
};

exports.getUserInfo = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(user);
};

exports.updateProfilePicture = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { profileImageUrl: imageUrl }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(user);
};
