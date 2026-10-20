const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

// Security Guard: All customer routes require valid JWT token
router.use(verifyToken);

router.post('/add', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
