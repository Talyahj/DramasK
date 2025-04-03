const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const dramaRoutes = require('./routes/drama.routes');
const userRoutes = require('./routes/user.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const ratingRoutes = require('./routes/rating.routes');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API DramasK' });
});

// Enregistrement des routes
app.use('/api', dramaRoutes);
app.use('/api', userRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', ratingRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;