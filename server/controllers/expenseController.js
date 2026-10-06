const XLSX = require('xlsx');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const validId = (id) => mongoose.isValidObjectId(id);
const validAmount = (amount) => Number.isFinite(Number(amount)) && Number(amount) > 0 && Number(amount) <= 1e12;
const validDate = (date) => date && Number.isFinite(new Date(date).getTime());

exports.addExpense = async (req, res) => {
    const { category, amount, date, icon } = req.body;
    if (typeof category !== 'string' || !category.trim() || category.trim().length > 100 || !validAmount(amount) || !validDate(date)) {
        return res.status(400).json({ message: 'Provide a category, a positive amount, and a valid date.' });
    }
    try {
        const expense = await Expense.create({ userId: req.user.id, category: category.trim(), amount: Number(amount), date: new Date(date), icon: typeof icon === 'string' ? icon.slice(0, 32) : '' });
        return res.status(201).json(expense);
    } catch (error) {
        console.error('Expense creation failed:', error.message);
        return res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.name === 'ValidationError' ? 'Invalid expense details.' : 'Unable to save expense.' });
    }
};

exports.updateExpense = async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid expense ID.' });
    const { category, amount, date, icon } = req.body;
    if (typeof category !== 'string' || !category.trim() || category.trim().length > 100 || !validAmount(amount) || !validDate(date)) {
        return res.status(400).json({ message: 'Provide a category, a positive amount, and a valid date.' });
    }
    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { category: category.trim(), amount: Number(amount), date: new Date(date), icon: typeof icon === 'string' ? icon.slice(0, 32) : '' },
        { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    return res.json(expense);
};

exports.getAllExpense = async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json(expenses);
};

exports.deleteExpense = async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid expense ID.' });
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    return res.json({ message: 'Expense deleted successfully.' });
};

exports.downloadExpenseExcel = async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    const rows = expenses.map((item) => ({ Category: item.category, Amount: item.amount, Date: item.date }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Expenses');
    const file = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="expense_details.xlsx"');
    return res.send(file);
};
