const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' }); // If no token, return unauthorized
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Find user by ID and exclude password
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' }); // If token verification fails, return unauthorized
    }
};
