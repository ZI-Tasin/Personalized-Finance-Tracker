const XLSX = require('xlsx'); // Import the XLSX library for Excel file handling
const Expense = require('../models/Expense'); // Import the Expense model


// Add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const { icon, category, amount, date } = req.body; // Destructure expense data from request body

        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date) // Set current date as the expense date
        });

        await newExpense.save(); // Save the new expense document to the database
        res.status(200).json(newExpense); // Respond with the created expense document
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Get All Expense sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 }); // Find all Expenses for the user, sorted by date
        res.json(expense); // Respond with the list of Expenses
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Delete Expense source
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id); // Find the Expense document by ID

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' }); // Handle case where Expense is not found
        }

        // Check if the Expense belongs to the authenticated user
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this Expense' }); // Handle unauthorized access
        }

        await Expense.findByIdAndDelete(req.params.id); // Delete the Expense document by ID
        res.json({ message: 'Expense deleted successfully' }); // Respond with success message
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Download Expense data as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 }); // Find all expenses for the user, sorted by date

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = XLSX.utils.book_new(); // Create a new workbook
        const ws = XLSX.utils.json_to_sheet(data); // Convert expense data to a worksheet
        XLSX.utils.book_append_sheet(wb, ws, 'Expense'); // Append the worksheet to the workbook
        XLSX.writeFile(wb, 'expense_details.xlsx'); // Write the workbook to a file
        res.download('expense_details.xlsx'); // Send the file as a download response
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};
