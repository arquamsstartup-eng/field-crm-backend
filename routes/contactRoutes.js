const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const contactController = require('../controllers/contactController');

// Security Guard: All contact routes require valid JWT token
router.use(verifyToken);

router.post('/', contactController.createContact);
router.get('/all', contactController.getAllContacts);
router.get('/customer/:customer_id', contactController.getContactsByCustomer);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
