const express = require('express');
const router = express.Router();

// Yahan loginUser ko import me add kiya
const { createUser, getManagers, getUsers, getUserById, loginUser, updateUser, deleteUser } = require('../controllers/userController'); 

router.post('/add', createUser);
router.get('/', getUsers);
router.get('/managers', getManagers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// NAYA: Login route
router.post('/login', loginUser);

module.exports = router;