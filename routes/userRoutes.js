const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const { 
    createUser, 
    getManagers, 
    getUsers, 
    getUserById, 
    loginUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController'); 

// 1. PUBLIC ROUTE: Login entrypoint
router.post('/login', loginUser);

// 2. PROTECTED ROUTES: Require valid JWT token
router.post('/add', verifyToken, createUser);
router.get('/', verifyToken, getUsers);
router.get('/managers', verifyToken, getManagers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
