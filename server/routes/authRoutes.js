const express = require('express'); // Import express for routing
const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware

const {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfilePicture,
} = require('../controllers/authController'); // Import authentication controller functions
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUserInfo);

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully.', url: imageUrl });
});

router.post('/update-profile-pic', protect, upload.single('image'), updateProfilePicture);

module.exports = router; // Export the router
