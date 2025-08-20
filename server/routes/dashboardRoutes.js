const express = require("express"); // Import express
const { protect } = require("../middleware/authMiddleware"); // Import authentication middleware
const { getDashboardData } = require("../controllers/dashboardController"); // Import dashboard controller

const router = express.Router(); // Create a new router

// Protected route to get dashboard data
router.get("/", protect, getDashboardData);

module.exports = router; // Export the router
