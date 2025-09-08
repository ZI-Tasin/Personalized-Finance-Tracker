const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addBudget, getBudgets, deleteBudget } = require("../controllers/budgetController");

const router = express.Router();

router.post("/add", protect, addBudget);
router.get("/get", protect, getBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
