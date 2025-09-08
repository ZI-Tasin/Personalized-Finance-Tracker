const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

exports.addBudget = async (req, res) => {
    try {
        const { category, amount, month } = req.body;
        const userId = req.user.id;

        if (!category || !amount || !month) {
            return res.status(400).json({ message: 'Category, amount, and month are required.' });
        }

        const budgetMonth = new Date(month);
        budgetMonth.setDate(1);
        budgetMonth.setHours(0, 0, 0, 0);

        const newBudget = new Budget({
            userId,
            category,
            amount,
            month: budgetMonth,
        });

        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        // This will catch the duplicate budget error from the index.
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A budget for this category and month already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// This function will fetch all budgets for the user for the current month.
// It will also calculate how much has been spent against each budget.
exports.getBudgets = async (req, res) => {
    try {
        const userId = new Types.ObjectId(String(req.user.id));
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const budgets = await Budget.find({ userId, month: startOfMonth });

        const budgetsWithSpentAmount = await Promise.all(
            budgets.map(async (budget) => {
                const expenses = await Expense.aggregate([
                    {
                        $match: {
                            userId: userId,
                            // Using a case-insensitive regular expression
                            category: { $regex: new RegExp(`^${budget.category}$`, 'i') },
                            date: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalSpent: { $sum: '$amount' }
                        }
                    }
                ]);

                const spentAmount = expenses.length > 0 ? expenses[0].totalSpent : 0;
                
                return {
                    ...budget.toObject(),
                    spentAmount,
                    remainingAmount: budget.amount - spentAmount,
                };
            })
        );

        res.status(200).json(budgetsWithSpentAmount);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// This function will delete a budget.
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found.' });
        }

        // Perform an ownership check to make sure the user owns this budget.
        if (budget.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        await Budget.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
