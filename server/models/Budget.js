const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    // Storing the month as the first day of that month for consistent queries.
    month: {
        type: Date,
        required: true
    },
}, { timestamps: true });

// Creating a compound index to ensure a user can only have one budget
// per category for any given month. This prevents duplicate budgets.
BudgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
