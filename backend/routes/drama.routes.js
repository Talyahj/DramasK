const express = require('express');
const router = express.Router();
const dramaController = require('../controllers/drama.controller');
const { authenticateToken, isAdmin } = require('../utils/auth');

// Routes publiques
router.get('/dramas', dramaController.getAllDramas);
router.get('/dramas/:id', dramaController.getDramaById);

// Routes protégées (admin seulement)
router.post('/dramas', authenticateToken, isAdmin, dramaController.createDrama);
router.put('/dramas/:id', authenticateToken, isAdmin, dramaController.updateDrama);
router.delete('/dramas/:id', authenticateToken, isAdmin, dramaController.deleteDrama);

module.exports = router;