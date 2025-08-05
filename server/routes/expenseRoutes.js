const express = require('express'); // Import express

const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController'); // Import expense controller functions

const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router(); // Create a new router instance

// Define routes for expense-related endpoints
router.post('/add', protect, addExpense); // Route to add expense
router.get('/get', protect, getAllExpense); // Route to get all expenses
router.delete('/:id', protect, deleteExpense); // Route to delete expense by ID
router.get('/downloadexcel', protect, downloadExpenseExcel); // Route to download expense data as Excel

module.exports = router; // Export the router
