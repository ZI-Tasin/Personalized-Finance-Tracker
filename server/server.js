// finds all the .env file, and reads all the variables inside it
require('dotenv').config();
const express = require('express');     // Import express
const cors = require('cors');         // Import cors (Cross-Origin Resource Sharing)
const path = require('path');        // Import path
const connectDB = require('./config/db'); // Import the database connection function
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

// create an express application
// This is the main entry point of the server application
const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*", // Allow requests from the client URL or any origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    })
);

app.use(express.json()); // Middleware to parse JSON request bodies

connectDB(); // Function to connect to the MongoDB database

app.use('/api/v1/auth', authRoutes); // Route for authentication-related endpoints

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
