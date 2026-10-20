const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// Security Guard: All report routes require valid JWT token
router.use(verifyToken);

router.get('/monthly', reportController.getMonthlyReport);
router.get('/weekly', reportController.getWeeklyReport);

module.exports = router;
