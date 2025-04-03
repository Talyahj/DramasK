const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Modèle pour les dramas
const DramaModel = {
  // Récupérer tous les dramas
  findAll: async () => {
    const [dramas] = await pool.query('SELECT * FROM Drama ORDER BY Titre ASC');
    return dramas;
  },
  
  // Récupérer un drama par son ID
  findById: async (id) => {
    const [dramas] = await pool.query('SELECT * FROM Drama WHERE ID_Drama = ?', [id]);
    return dramas.length > 0 ? dramas[0] : null;
  },
  
  // Rechercher des dramas par titre
  searchByTitle: async (title) => {
    const [dramas] = await pool.query('SELECT * FROM Drama WHERE Titre LIKE ?', [`%${title}%`]);
    return dramas;
  },
  
  // Filtrer les dramas par genre
  filterByGenre: async (genre) => {
    const [dramas] = await pool.query('SELECT * FROM Drama WHERE Genre = ?', [genre]);
    return dramas;
  },
  
  // Créer un nouveau drama
  create: async (dramaData) => {
    const { titre, synopsis, genre, acteurs, annee } = dramaData;
    
    const [result] = await pool.query(
      'INSERT INTO Drama (Titre, Synopsis, Genre, Acteurs, Annee) VALUES (?, ?, ?, ?, ?)',
      [titre, synopsis, genre, acteurs, annee]
    );
    
    return result.insertId;
  },
  
  // Mettre à jour un drama
  update: async (id, dramaData) => {
    const { titre, synopsis, genre, acteurs, annee } = dramaData;
    
    const [result] = await pool.query(
      'UPDATE Drama SET Titre = ?, Synopsis = ?, Genre = ?, Acteurs = ?, Annee = ? WHERE ID_Drama = ?',
      [titre, synopsis, genre, acteurs, annee, id]
    );
    
    return result.affectedRows > 0;
  },
  
  // Supprimer un drama
  delete: async (id) => {
    // Supprimer d'abord les favoris liés à ce drama
    await pool.query('DELETE FROM Favoris WHERE ID_Drama = ?', [id]);
    
    // Supprimer les avis liés à ce drama
    await pool.query('DELETE FROM Avis WHERE ID_Drama = ?', [id]);
    
    // Supprimer le drama
    const [result] = await pool.query('DELETE FROM Drama WHERE ID_Drama = ?', [id]);
    
    return result.affectedRows > 0;
  },
  
  // Récupérer les genres uniques
  getUniqueGenres: async () => {
    const [genres] = await pool.query('SELECT DISTINCT Genre FROM Drama ORDER BY Genre ASC');
    return genres.map(g => g.Genre);
  }
};

module.exports = DramaModel;