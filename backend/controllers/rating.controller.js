const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Contrôleur pour les avis
const ratingController = {
  // Récupérer les avis pour un drama
  getDramaRatings: async (req, res) => {
    try {
      const [avis] = await pool.query(
        'SELECT A.*, U.Nom FROM Avis A JOIN Utilisateur U ON A.ID_Utilisateur = U.ID_Utilisateur WHERE A.ID_Drama = ?',
        [req.params.id]
      );
      
      res.json(avis);
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Récupérer la note moyenne d'un drama
  getDramaAverageRating: async (req, res) => {
    try {
      const [result] = await pool.query(
        'SELECT AVG(Note) as moyenne FROM Avis WHERE ID_Drama = ?',
        [req.params.id]
      );
      
      res.json({ moyenne: result[0].moyenne || 0 });
    } catch (error) {
      console.error('Erreur lors de la récupération de la note moyenne:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Ajouter ou mettre à jour un avis
  rateDrama: async (req, res) => {
    const { idDrama, note } = req.body;
    
    if (!idDrama || !note || note < 1 || note > 5) {
      return res.status(400).json({ message: 'ID du drama et note (entre 1 et 5) requis' });
    }
    
    try {
      // Vérifier si le drama existe
      const [dramas] = await pool.query('SELECT * FROM Drama WHERE ID_Drama = ?', [idDrama]);
      
      if (dramas.length === 0) {
        return res.status(404).json({ message: 'Drama non trouvé' });
      }
      
      // Vérifier si l'utilisateur a déjà noté ce drama
      const [existingAvis] = await pool.query(
        'SELECT * FROM Avis WHERE ID_Utilisateur = ? AND ID_Drama = ?',
        [req.user.id, idDrama]
      );
      
      if (existingAvis.length > 0) {
        // Mettre à jour l'avis existant
        await pool.query(
          'UPDATE Avis SET Note = ? WHERE ID_Utilisateur = ? AND ID_Drama = ?',
          [note, req.user.id, idDrama]
        );
        
        return res.json({ message: 'Avis mis à jour avec succès' });
      }
      
      // Créer un nouvel avis
      const [result] = await pool.query(
        'INSERT INTO Avis (ID_Utilisateur, ID_Drama, Note) VALUES (?, ?, ?)',
        [req.user.id, idDrama, note]
      );
      
      res.status(201).json({
        message: 'Avis ajouté avec succès',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = ratingController;