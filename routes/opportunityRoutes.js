const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');

router.post('/', opportunityController.createOpportunity);
router.put('/:id', opportunityController.updateOpportunity);
router.get('/', opportunityController.getAllOpportunities);
router.get('/stats', opportunityController.getOpportunityStats);

module.exports = router;
