const XLSX = require('xlsx');
const Income = require('../models/Income');
const mongoose = require('mongoose');

const validId = (id) => mongoose.isValidObjectId(id);
const validAmount = (amount) => Number.isFinite(Number(amount)) && Number(amount) > 0 && Number(amount) <= 1e12;
const validDate = (date) => date && Number.isFinite(new Date(date).getTime());

exports.addIncome = async (req, res) => {
    const { source, amount, date, icon } = req.body;
    if (typeof source !== 'string' || !source.trim() || source.trim().length > 100 || !validAmount(amount) || !validDate(date)) {
        return res.status(400).json({ message: 'Provide a source, a positive amount, and a valid date.' });
    }
    try {
        const income = await Income.create({ userId: req.user.id, source: source.trim(), amount: Number(amount), date: new Date(date), icon: typeof icon === 'string' ? icon.slice(0, 32) : '' });
        return res.status(201).json(income);
    } catch (error) {
        console.error('Income creation failed:', error.message);
        return res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.name === 'ValidationError' ? 'Invalid income details.' : 'Unable to save income.' });
    }
};

exports.updateIncome = async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid income ID.' });
    const { source, amount, date, icon } = req.body;
    if (typeof source !== 'string' || !source.trim() || source.trim().length > 100 || !validAmount(amount) || !validDate(date)) {
        return res.status(400).json({ message: 'Provide a source, a positive amount, and a valid date.' });
    }
    const income = await Income.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { source: source.trim(), amount: Number(amount), date: new Date(date), icon: typeof icon === 'string' ? icon.slice(0, 32) : '' },
        { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ message: 'Income not found.' });
    return res.json(income);
};

exports.getAllIncomes = async (req, res) => {
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json(income);
};

exports.deleteIncome = async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid income ID.' });
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!income) return res.status(404).json({ message: 'Income not found.' });
    return res.json({ message: 'Income deleted successfully.' });
};

exports.downloadIncomeExcel = async (req, res) => {
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    const rows = income.map((item) => ({ Source: item.source, Amount: item.amount, Date: item.date }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Income');
    const file = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="income_details.xlsx"');
    return res.send(file);
};
