const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

// Import the mongoose library to interact with MongoDB
// This file is responsible for connecting to the MongoDB database
const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB; // Export the connectDB function
