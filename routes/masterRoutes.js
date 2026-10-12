const express = require('express');
const router = express.Router();

// Yahan deleteMaster ko bhi import kar liya
const { getMasters, addMaster, editMaster, deleteMaster } = require('../controllers/masterController'); 

router.get('/:table', getMasters);
router.post('/:table', addMaster);
router.put('/:table/:id', editMaster);

// NAYA: Delete karne ka raasta (DELETE request)
router.delete('/:table/:id', deleteMaster);

module.exports = router;