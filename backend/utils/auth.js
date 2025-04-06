const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Récupérer le secret depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'dramask-secret-key';

// Fonction pour hacher un mot de passe
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Fonction pour comparer un mot de passe avec un hash
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Fonction pour générer un token JWT
function generateToken(user) {
  return jwt.sign({ 
    id: user.ID_Utilisateur, 
    email: user.Email,
    type: user.Type_Utilisateur
  }, JWT_SECRET, { expiresIn: '24h' });
}

// Middleware pour vérifier le token JWT
async function authenticateToken(req, res, next) {
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
}

// Middleware pour vérifier les droits d'administrateur
async function isAdmin(req, res, next) {
  try {
    // Vérifier si l'utilisateur est un admin en se basant sur le champ type
    if (req.user.type === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
  isAdmin,
  JWT_SECRET
};