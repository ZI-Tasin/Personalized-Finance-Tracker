const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');
const mongoose = require('mongoose');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.addBudget = async (req, res) => {
    try {
        const { category, amount, month } = req.body;
        const userId = req.user.id;

        if (typeof category !== 'string' || !category.trim() || category.trim().length > 100 || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || Number(amount) > 1e12 || !/^\d{4}-\d{2}$/.test(String(month || ''))) {
            return res.status(400).json({ message: 'Category, amount, and month are required.' });
        }

        const budgetMonth = new Date(`${month}-01T00:00:00.000Z`);
        if (!Number.isFinite(budgetMonth.getTime())) return res.status(400).json({ message: 'Enter a valid budget month.' });

        const existingBudget = await Budget.findOne({
            userId,
            month: budgetMonth,
            category: { $regex: new RegExp(`^${escapeRegex(category.trim())}$`, 'i') },
        });
        if (existingBudget) return res.status(409).json({ message: 'A budget for this category and month already exists.' });

        const newBudget = new Budget({
            userId,
            category: category.trim(),
            amount: Number(amount),
            month: budgetMonth,
        });

        await newBudget.save();
        return res.status(201).json(newBudget);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A budget for this category and month already exists.' });
        }
        console.error('Budget creation failed:', error.message);
        return res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: 'Unable to save budget.' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const userId = new Types.ObjectId(String(req.user.id));
        const today = new Date();
        const requestedMonth = req.query.month;
        if (requestedMonth && !/^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth)) {
            return res.status(400).json({ message: 'Month must use YYYY-MM format.' });
        }
        const [year, month] = requestedMonth ? requestedMonth.split('-').map(Number) : [today.getUTCFullYear(), today.getUTCMonth() + 1];
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
        const endOfMonth = new Date(Date.UTC(year, month, 1));

        const budgets = await Budget.find({ userId, month: startOfMonth });

        const budgetsWithSpentAmount = await Promise.all(
            budgets.map(async (budget) => {
                const expenses = await Expense.aggregate([
                    {
                        $match: {
                            userId: userId,
                            category: { $regex: new RegExp(`^${escapeRegex(budget.category)}$`, 'i') },
                            date: { $gte: startOfMonth, $lt: endOfMonth }
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

        return res.status(200).json(budgetsWithSpentAmount);

    } catch (error) {
        console.error('Budget lookup failed:', error.message);
        return res.status(500).json({ message: 'Unable to load budgets.' });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid budget ID.' });
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!budget) return res.status(404).json({ message: 'Budget not found.' });
        return res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (error) {
        console.error('Budget deletion failed:', error.message);
        return res.status(500).json({ message: 'Unable to delete budget.' });
    }
};
