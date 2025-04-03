const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { authenticateToken } = require('../utils/auth');

// Routes publiques
router.get('/dramas/:id/avis', ratingController.getDramaRatings);
router.get('/dramas/:id/note-moyenne', ratingController.getDramaAverageRating);

// Routes protégées (utilisateur connecté)
router.post('/avis', authenticateToken, ratingController.rateDrama);

module.exports = router;