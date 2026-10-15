const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');

router.get('/', opportunityController.getAllOpportunities);
router.get('/stats', opportunityController.getOpportunityStats);
router.get('/:id', opportunityController.getOpportunityById);
router.post('/', opportunityController.createOpportunity);
router.post('/:id/loss', opportunityController.recordLoss);
router.put('/:id', opportunityController.updateOpportunity);

module.exports = router;
