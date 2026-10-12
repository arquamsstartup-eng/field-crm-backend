const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.post('/add', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;