const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createExpense, getExpenses, updateExpenseStatus } = require('../controllers/expenseController');

// Security Guard: All expense routes require valid JWT token
router.use(verifyToken);

router.post('/add', createExpense);
router.get('/all', getExpenses);
router.put('/update-status/:id', updateExpenseStatus);

module.exports = router;
