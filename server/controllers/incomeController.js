const XLSX = require('xlsx'); // Import the XLSX library for Excel file handling
const Income = require('../models/Income');


// Add Income source
exports.addIncome = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const { icon, source, amount, date } = req.body; // Destructure income data from request body

        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date) // Set current date as the income date
        });

        await newIncome.save(); // Save the new income document to the database
        res.status(200).json(newIncome); // Respond with the created income document
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Get All Income sources
exports.getAllIncomes = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const income = await Income.find({ userId }).sort({ date: -1 }); // Find all incomes for the user, sorted by date
        res.json(income); // Respond with the list of incomes
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Delete Income source
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id); // Find the income document by ID

        if (!income) {
            return res.status(404).json({ message: 'Income not found' }); // Handle case where income is not found
        }

        // Check if the income belongs to the authenticated user
        if (income.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this income' }); // Handle unauthorized access
        }

        await Income.findByIdAndDelete(req.params.id); // Delete the income document by ID
        res.json({ message: 'Income deleted successfully' }); // Respond with success message
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Download Income data as Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated user

    try {
        const income = await Income.find({ userId }).sort({ date: -1 }); // Find all incomes for the user, sorted by date

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = XLSX.utils.book_new(); // Create a new workbook
        const ws = XLSX.utils.json_to_sheet(data); // Convert income data to a worksheet
        XLSX.utils.book_append_sheet(wb, ws, 'Income'); // Append the worksheet to the workbook
        XLSX.writeFile(wb, 'income_details.xlsx'); // Write the workbook to a file
        res.download('income_details.xlsx'); // Send the file as a download response
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};
