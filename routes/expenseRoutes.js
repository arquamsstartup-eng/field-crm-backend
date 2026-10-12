const express = require('express');
const router = express.Router();
// Yahan updateExpenseStatus ko add kar diya
const { createExpense, getExpenses, updateExpenseStatus } = require('../controllers/expenseController');

router.post('/add', createExpense);
router.get('/all', getExpenses);

// NAYA ROUTE: :id ka matlab hai yahan url mein expense ka number aayega
router.put('/update-status/:id', updateExpenseStatus);

module.exports = router;