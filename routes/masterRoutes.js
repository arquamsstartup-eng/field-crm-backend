const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getMasters, addMaster, editMaster, deleteMaster } = require('../controllers/masterController'); 

// Security Guard: All master dropdown/table routes require valid JWT token
router.use(verifyToken);

router.get('/:table', getMasters);
router.post('/:table', addMaster);
router.put('/:table/:id', editMaster);
router.delete('/:table/:id', deleteMaster);

module.exports = router;
