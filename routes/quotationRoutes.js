const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const quotationController = require('../controllers/quotationController');

// Security Guard: All quotation routes require valid JWT token
router.use(verifyToken);

router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotationById);
router.post('/', quotationController.createQuotation);
router.put('/:id', quotationController.updateQuotation);
router.post('/:id/revision', quotationController.createRevision);

module.exports = router;
