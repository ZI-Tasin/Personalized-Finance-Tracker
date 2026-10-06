const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Authentication required.' });
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: 'Session is invalid or expired. Please sign in again.' });
    }
    if (!mongoose.isValidObjectId(decoded.id)) return res.status(401).json({ message: 'Session is invalid. Please sign in again.' });
    const user = await User.findById(decoded.id).select('_id fullName email profileImageUrl');
    if (!user) return res.status(401).json({ message: 'Session is no longer valid. Please sign in again.' });
    req.user = user;
    return next();
};
