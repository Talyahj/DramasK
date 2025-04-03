const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
const auth = require('../utils/auth');

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Contrôleur pour les utilisateurs
const userController = {
  // Inscription d'un nouvel utilisateur
  register: async (req, res) => {
    const { nom, email, motDePasse } = req.body;
    
    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    try {
      // Vérifier si l'email existe déjà
      const [users] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [email]);
      
      if (users.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      
      // Hasher le mot de passe
      const hashedPassword = await auth.hashPassword(motDePasse);
      
      // Insérer le nouvel utilisateur
      const [result] = await pool.query(
        'INSERT INTO Utilisateur (Nom, Email, MotDePasse, Type_Utilisateur) VALUES (?, ?, ?, ?)',
        [nom, email, hashedPassword, 'user']
      );
      
      const userId = result.insertId;
      
      // Générer un token
      const token = auth.generateToken({ ID_Utilisateur: userId, Email: email, Type_Utilisateur: 'user' });
      
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: { 
          id: userId, 
          nom, 
          email,
          type: 'user'
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Connexion d'un utilisateur
  login: async (req, res) => {
    const { email, motDePasse } = req.body;
    
    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    try {
      // Récupérer l'utilisateur
      const [users] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [email]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      const user = users[0];
      
      // Vérifier le mot de passe
      const isPasswordValid = await auth.comparePassword(motDePasse, user.MotDePasse);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Générer un token
      const token = auth.generateToken(user);
      
      res.json({
        token,
        user: {
          id: user.ID_Utilisateur,
          nom: user.Nom,
          email: user.Email,
          type: user.Type_Utilisateur
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  
  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: async (req, res) => {
    try {
      const [users] = await pool.query('SELECT * FROM Utilisateur WHERE ID_Utilisateur = ?', [req.user.id]);
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      const user = users[0];
      
      res.json({
        id: user.ID_Utilisateur,
        nom: user.Nom,
        email: user.Email,
        type: user.Type_Utilisateur
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = userController;