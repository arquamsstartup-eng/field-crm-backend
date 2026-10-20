const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

// Security Guard: All dashboard routes require valid JWT token
router.use(verifyToken);

router.get('/stats', getDashboardStats);

module.exports = router;
