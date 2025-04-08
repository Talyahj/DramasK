const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Contrôleur pour les dramas
const dramaController = {
  // Récupérer tous les dramas
  getAllDramas: async (req, res) => {
    try {
      const [dramas] = await pool.query('SELECT * FROM Drama ORDER BY Titre ASC');
      res.json(dramas);
    } catch (error) {
      console.error('Erreur lors de la récupération des dramas:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Récupérer un drama par son ID
  getDramaById: async (req, res) => {
    try {
      const [dramas] = await pool.query('SELECT * FROM Drama WHERE ID_Drama = ?', [req.params.id]);
      
      if (dramas.length === 0) {
        return res.status(404).json({ message: 'Drama non trouvé' });
      }
      
      res.json(dramas[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération du drama:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Récupérer tous les genres disponibles
getAllGenres: async (req, res) => {
  try {
    const [genres] = await pool.query('SELECT DISTINCT Genre FROM Drama ORDER BY Genre ASC');
    const genreList = genres.map(g => g.Genre);
    res.json(genreList);
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
},
  
  // Créer un nouveau drama (admin seulement)
  createDrama: async (req, res) => {
    const { titre, synopsis, genre, acteurs, annee } = req.body;
    
    if (!titre || !synopsis || !genre || !acteurs || !annee) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    try {
      const [result] = await pool.query(
        'INSERT INTO Drama (Titre, Synopsis, Genre, Acteurs, Annee) VALUES (?, ?, ?, ?, ?)',
        [titre, synopsis, genre, acteurs, annee]
      );
      
      res.status(201).json({
        message: 'Drama ajouté avec succès',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du drama:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Mettre à jour un drama existant (admin seulement)
  updateDrama: async (req, res) => {
    const { titre, synopsis, genre, acteurs, annee } = req.body;
    
    if (!titre || !synopsis || !genre || !acteurs || !annee) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    try {
      const [result] = await pool.query(
        'UPDATE Drama SET Titre = ?, Synopsis = ?, Genre = ?, Acteurs = ?, Annee = ? WHERE ID_Drama = ?',
        [titre, synopsis, genre, acteurs, annee, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Drama non trouvé' });
      }
      
      res.json({ message: 'Drama mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du drama:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Supprimer un drama (admin seulement)
  deleteDrama: async (req, res) => {
    try {
      // Supprimer d'abord les favoris liés à ce drama
      await pool.query('DELETE FROM Favoris WHERE ID_Drama = ?', [req.params.id]);
      
      // Supprimer les avis liés à ce drama
      await pool.query('DELETE FROM Avis WHERE ID_Drama = ?', [req.params.id]);
      
      // Supprimer le drama
      const [result] = await pool.query('DELETE FROM Drama WHERE ID_Drama = ?', [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Drama non trouvé' });
      }
      
      res.json({ message: 'Drama supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du drama:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = dramaController;