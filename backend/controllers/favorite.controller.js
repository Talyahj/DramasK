const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Contrôleur pour les favoris
const favoriteController = {
  // Récupérer les favoris de l'utilisateur connecté
  getUserFavorites: async (req, res) => {
    try {
      const [favoris] = await pool.query(
        'SELECT F.ID_Favoris, D.* FROM Favoris F JOIN Drama D ON F.ID_Drama = D.ID_Drama WHERE F.ID_Utilisateur = ?',
        [req.user.id]
      );
      
      res.json(favoris);
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Vérifier si un drama est dans les favoris de l'utilisateur
  checkFavorite: async (req, res) => {
    try {
      const [favoris] = await pool.query(
        'SELECT * FROM Favoris WHERE ID_Utilisateur = ? AND ID_Drama = ?',
        [req.user.id, req.params.idDrama]
      );
      
      res.json({ isFavorite: favoris.length > 0, favoris: favoris[0] || null });
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Ajouter un drama aux favoris
  addToFavorites: async (req, res) => {
    const { idDrama } = req.body;
    
    if (!idDrama) {
      return res.status(400).json({ message: 'ID du drama requis' });
    }
    
    try {
      // Vérifier si ce favoris existe déjà
      const [existingFavoris] = await pool.query(
        'SELECT * FROM Favoris WHERE ID_Utilisateur = ? AND ID_Drama = ?',
        [req.user.id, idDrama]
      );
      
      if (existingFavoris.length > 0) {
        return res.status(400).json({ message: 'Ce drama est déjà dans vos favoris' });
      }
      
      // Vérifier si le drama existe
      const [dramas] = await pool.query('SELECT * FROM Drama WHERE ID_Drama = ?', [idDrama]);
      
      if (dramas.length === 0) {
        return res.status(404).json({ message: 'Drama non trouvé' });
      }
      
      // Ajouter aux favoris
      const [result] = await pool.query(
        'INSERT INTO Favoris (ID_Utilisateur, ID_Drama) VALUES (?, ?)',
        [req.user.id, idDrama]
      );
      
      res.status(201).json({
        message: 'Drama ajouté aux favoris',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Supprimer un drama des favoris
  removeFromFavorites: async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM Favoris WHERE ID_Favoris = ? AND ID_Utilisateur = ?',
        [req.params.id, req.user.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Favoris non trouvé' });
      }
      
      res.json({ message: 'Drama retiré des favoris' });
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = favoriteController;