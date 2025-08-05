const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction

// Define the Expense schema
// This schema represents the structure of expense documents in the database
const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    icon: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Expense', ExpenseSchema);
