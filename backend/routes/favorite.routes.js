const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticateToken } = require('../utils/auth');

// Routes protégées (utilisateur connecté)
router.get('/favoris', authenticateToken, favoriteController.getUserFavorites);
router.get('/favoris/check/:idDrama', authenticateToken, favoriteController.checkFavorite);
router.post('/favoris', authenticateToken, favoriteController.addToFavorites);
router.delete('/favoris/:id', authenticateToken, favoriteController.removeFromFavorites);

module.exports = router;