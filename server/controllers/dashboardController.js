const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    const userId = new Types.ObjectId(String(req.user.id));
    const now = new Date();
    const [incomeTotals, expenseTotals, incomeTransactions, expenseTransactions, latestIncome, latestExpenses] = await Promise.all([
        Income.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        Expense.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        Income.find({ userId, date: { $gte: new Date(now.getTime() - 60 * 86400000), $lte: now } }).sort({ date: -1 }),
        Expense.find({ userId, date: { $gte: new Date(now.getTime() - 30 * 86400000), $lte: now } }).sort({ date: -1 }),
        Income.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5),
        Expense.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5),
    ]);
    const totalIncome = incomeTotals[0]?.total || 0;
    const totalExpenses = expenseTotals[0]?.total || 0;
    const recentTransactions = [
        ...latestIncome.map((item) => ({ ...item.toObject(), type: 'income' })),
        ...latestExpenses.map((item) => ({ ...item.toObject(), type: 'expense' })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return res.json({
        totalBalance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        last30DaysExpenses: { total: expenseTransactions.reduce((sum, item) => sum + item.amount, 0), transactions: expenseTransactions },
        last60DaysIncome: { total: incomeTransactions.reduce((sum, item) => sum + item.amount, 0), transactions: incomeTransactions },
        recentTransactions,
    });
};
