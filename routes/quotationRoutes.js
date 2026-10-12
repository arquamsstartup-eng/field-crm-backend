const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

router.get('/', quotationController.getQuotations);
router.post('/', quotationController.createQuotation);

module.exports = router;
