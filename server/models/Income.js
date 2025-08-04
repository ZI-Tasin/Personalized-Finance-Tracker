const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction

// Define the Income schema
// This schema represents the structure of income documents in the database
const IncomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    icon: {
        type: String
    },
    source: {
        type: String,
        required: true
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

module.exports = mongoose.model('Income', IncomeSchema);
