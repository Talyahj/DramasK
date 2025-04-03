const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../utils/auth');

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées
router.get('/user', authenticateToken, userController.getCurrentUser);

module.exports = router;