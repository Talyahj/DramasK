const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Modèle pour les avis
const RatingModel = {
  // Récupérer les avis pour un drama
  findByDrama: async (dramaId) => {
    const [avis] = await pool.query(
      'SELECT A.*, U.Nom FROM Avis A JOIN Utilisateur U ON A.ID_Utilisateur = U.ID_Utilisateur WHERE A.ID_Drama = ?',
      [dramaId]
    );
    return avis;
  },
  
  // Récupérer la note moyenne d'un drama
  getAverageRating: async (dramaId) => {
    const [result] = await pool.query(
      'SELECT AVG(Note) as moyenne FROM Avis WHERE ID_Drama = ?',
      [dramaId]
    );
    return result[0].moyenne || 0;
  },
  
  // Récupérer l'avis d'un utilisateur pour un drama
  getUserRating: async (userId, dramaId) => {
    const [avis] = await pool.query(
      'SELECT * FROM Avis WHERE ID_Utilisateur = ? AND ID_Drama = ?',
      [userId, dramaId]
    );
    return avis.length > 0 ? avis[0] : null;
  },
  
  // Ajouter un avis
  add: async (userId, dramaId, note) => {
    const [result] = await pool.query(
      'INSERT INTO Avis (ID_Utilisateur, ID_Drama, Note) VALUES (?, ?, ?)',
      [userId, dramaId, note]
    );
    return result.insertId;
  },
  
  // Mettre à jour un avis
  update: async (userId, dramaId, note) => {
    const [result] = await pool.query(
      'UPDATE Avis SET Note = ? WHERE ID_Utilisateur = ? AND ID_Drama = ?',
      [note, userId, dramaId]
    );
    return result.affectedRows > 0;
  },
  
  // Supprimer un avis
  remove: async (avisId) => {
    const [result] = await pool.query('DELETE FROM Avis WHERE ID_Avis = ?', [avisId]);
    return result.affectedRows > 0;
  }
};

module.exports = RatingModel;