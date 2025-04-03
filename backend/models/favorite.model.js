const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Modèle pour les favoris
const FavoriteModel = {
  // Récupérer les favoris d'un utilisateur
  findByUser: async (userId) => {
    const [favoris] = await pool.query(
      'SELECT F.ID_Favoris, D.* FROM Favoris F JOIN Drama D ON F.ID_Drama = D.ID_Drama WHERE F.ID_Utilisateur = ?',
      [userId]
    );
    return favoris;
  },
  
  // Vérifier si un drama est dans les favoris d'un utilisateur
  checkFavorite: async (userId, dramaId) => {
    const [favoris] = await pool.query(
      'SELECT * FROM Favoris WHERE ID_Utilisateur = ? AND ID_Drama = ?',
      [userId, dramaId]
    );
    return favoris.length > 0 ? favoris[0] : null;
  },
  
  // Ajouter un drama aux favoris
  add: async (userId, dramaId) => {
    const [result] = await pool.query(
      'INSERT INTO Favoris (ID_Utilisateur, ID_Drama) VALUES (?, ?)',
      [userId, dramaId]
    );
    return result.insertId;
  },
  
  // Supprimer un drama des favoris
  remove: async (favorisId, userId) => {
    const [result] = await pool.query(
      'DELETE FROM Favoris WHERE ID_Favoris = ? AND ID_Utilisateur = ?',
      [favorisId, userId]
    );
    return result.affectedRows > 0;
  },
  
  // Récupérer un favori par son ID
  findById: async (favorisId) => {
    const [favoris] = await pool.query('SELECT * FROM Favoris WHERE ID_Favoris = ?', [favorisId]);
    return favoris.length > 0 ? favoris[0] : null;
  }
};

module.exports = FavoriteModel;