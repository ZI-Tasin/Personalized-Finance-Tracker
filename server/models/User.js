const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // If password is not modified, skip hashing
    }
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Proceed to save the user
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
});


// Compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema); // Export the User model