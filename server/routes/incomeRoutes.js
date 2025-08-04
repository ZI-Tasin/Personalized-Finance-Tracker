const express = require('express'); // Import express

const {
    addIncome,
    getAllIncomes,
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController'); // Import income controller functions

const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router(); // Create a new router instance

// Define routes for income-related endpoints
router.post('/add', protect, addIncome); // Route to add income
router.get('/get', protect, getAllIncomes); // Route to get all incomes
router.delete('/:id', protect, deleteIncome); // Route to delete income by ID
router.get('/downloadexcel', protect, downloadIncomeExcel); // Route to download income data as Excel

module.exports = router; // Export the router
