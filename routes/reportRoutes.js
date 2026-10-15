const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/monthly', reportController.getMonthlyReport);
router.get('/weekly', reportController.getWeeklyReport);

module.exports = router;
