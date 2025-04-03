const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Clé secrète pour JWT
const JWT_SECRET = process.env.JWT_SECRET || 'dramask-secret-key';

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier les droits d'administrateur
const isAdmin = async (req, res, next) => {
  try {
    // Récupérer l'utilisateur complet depuis la base de données
    const [users] = await pool.query(
      'SELECT * FROM Utilisateur WHERE ID_Utilisateur = ?', 
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(403).json({ message: 'Accès refusé - Utilisateur non trouvé' });
    }
    
    const user = users[0];
    
    // Vérifier si l'utilisateur est un admin
    if (user.Type_Utilisateur === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ 
    id: user.ID_Utilisateur, 
    email: user.Email,
    type: user.Type_Utilisateur
  }, JWT_SECRET, { expiresIn: '24h' });
};

// Hacher un mot de passe
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Vérifier un mot de passe
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  authenticateToken,
  isAdmin,
  generateToken,
  hashPassword,
  comparePassword,
  JWT_SECRET
};