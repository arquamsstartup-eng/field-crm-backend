const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const opportunityController = require('../controllers/opportunityController');

// Security Guard: All opportunity routes require valid JWT token
router.use(verifyToken);

router.get('/', opportunityController.getAllOpportunities);
router.get('/stats', opportunityController.getOpportunityStats);
router.get('/:id', opportunityController.getOpportunityById);
router.post('/', opportunityController.createOpportunity);
router.post('/:id/loss', opportunityController.recordLoss);
router.put('/:id', opportunityController.updateOpportunity);
router.delete('/:id', opportunityController.deleteOpportunity);

module.exports = router;
