const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    icon: {
        type: String,
        maxlength: 32,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
        max: 1e12,
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
