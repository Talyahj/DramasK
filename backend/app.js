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

// Middleware de logging
app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API DramasK',
    version: '1.0.0',
    endpoints: {
      dramas: '/api/dramas',
      users: '/api/users',
      auth: '/api/login, /api/register',
      favorites: '/api/favoris',
      ratings: '/api/avis'
    }
  });
});

// Enregistrement des routes
app.use('/api', dramaRoutes);
app.use('/api', userRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', ratingRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    path: req.path
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message);
  console.error(err.stack);
  
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;