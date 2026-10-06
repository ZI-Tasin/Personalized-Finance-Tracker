const express = require('express');
const {
    addExpense,
    updateExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addExpense);
router.put('/:id', protect, updateExpense);
router.get('/get', protect, getAllExpense);
router.delete('/:id', protect, deleteExpense);
router.get('/downloadexcel', protect, downloadExpenseExcel);

module.exports = router;
