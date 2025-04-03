const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
const auth = require('../utils/auth');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Modèle pour les utilisateurs
const UserModel = {
  // Créer un nouvel utilisateur
  create: async (userData) => {
    const { nom, email, motDePasse, type = 'user' } = userData;
    
    // Hasher le mot de passe
    const hashedPassword = await auth.hashPassword(motDePasse);
    
    const [result] = await pool.query(
      'INSERT INTO Utilisateur (Nom, Email, MotDePasse, Type_Utilisateur) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, type]
    );
    
    return result.insertId;
  },
  
  // Trouver un utilisateur par email
  findByEmail: async (email) => {
    const [users] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [email]);
    return users.length > 0 ? users[0] : null;
  },
  
  // Trouver un utilisateur par ID
  findById: async (id) => {
    const [users] = await pool.query('SELECT * FROM Utilisateur WHERE ID_Utilisateur = ?', [id]);
    return users.length > 0 ? users[0] : null;
  },
  
  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const { nom, email, type } = userData;
    
    const [result] = await pool.query(
      'UPDATE Utilisateur SET Nom = ?, Email = ?, Type_Utilisateur = ? WHERE ID_Utilisateur = ?',
      [nom, email, type, id]
    );
    
    return result.affectedRows > 0;
  },
  
  // Mettre à jour le mot de passe d'un utilisateur
  updatePassword: async (id, motDePasse) => {
    const hashedPassword = await auth.hashPassword(motDePasse);
    
    const [result] = await pool.query(
      'UPDATE Utilisateur SET MotDePasse = ? WHERE ID_Utilisateur = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  },
  
  // Supprimer un utilisateur
  delete: async (id) => {
    // Supprimer d'abord les favoris liés à cet utilisateur
    await pool.query('DELETE FROM Favoris WHERE ID_Utilisateur = ?', [id]);
    
    // Supprimer les avis liés à cet utilisateur
    await pool.query('DELETE FROM Avis WHERE ID_Utilisateur = ?', [id]);
    
    // Supprimer l'utilisateur
    const [result] = await pool.query('DELETE FROM Utilisateur WHERE ID_Utilisateur = ?', [id]);
    
    return result.affectedRows > 0;
  }
};

module.exports = UserModel;