const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createContact);
router.get('/all', contactController.getAllContacts);
router.get('/customer/:customer_id', contactController.getContactsByCustomer);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
