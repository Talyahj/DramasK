require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dramask-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DramasK'
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

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
  console.log('Vérification des droits admin:', req.user);
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
      console.log('Accès refusé - Non admin:', user.Type_Utilisateur);
      return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Routes d'authentification
app.post('/api/register', async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    
    // Insérer le nouvel utilisateur
    const [result] = await pool.query(
      'INSERT INTO Utilisateur (Nom, Email, MotDePasse) VALUES (?, ?, ?)',
      [nom, email, hashedPassword]
    );
    
    const userId = result.insertId;
    
    // Générer un token
    const token = jwt.sign({ 
      id: userId, 
      email,
      type: 'user' // Nouvel utilisateur est toujours de type 'user'
    }, JWT_SECRET, { expiresIn: '24h' });
    
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
});

app.post('/api/login', async (req, res) => {
  const { email, motDePasse } = req.body;
  
  console.log('Tentative de connexion avec:', email);
  
  if (!email || !motDePasse) {
    console.log('Erreur: Email ou mot de passe manquant');
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  
  try {
    // Récupérer l'utilisateur
    const [users] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [email]);
    
    console.log('Utilisateur trouvé:', users.length > 0 ? 'Oui' : 'Non');
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const user = users[0];
    
    console.log('Mot de passe fourni:', motDePasse);
    console.log('Hash stocké:', user.MotDePasse);
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, user.MotDePasse);
    console.log('Résultat de la comparaison:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Générer un token
    const token = jwt.sign({ 
      id: user.ID_Utilisateur, 
      email: user.Email,
      type: user.Type_Utilisateur
    }, JWT_SECRET, { expiresIn: '24h' });
    
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
});

// Routes des dramas
app.get('/api/dramas', async (req, res) => {
  try {
    const [dramas] = await pool.query('SELECT * FROM Drama');
    res.json(dramas);
  } catch (error) {
    console.error('Erreur lors de la récupération des dramas:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/dramas/:id', async (req, res) => {
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
});

app.post('/api/dramas', authenticateToken, isAdmin, async (req, res) => {
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
});

app.put('/api/dramas/:id', authenticateToken, isAdmin, async (req, res) => {
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
});

app.delete('/api/dramas/:id', authenticateToken, isAdmin, async (req, res) => {
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
});

// Routes des favoris
app.get('/api/favoris', authenticateToken, async (req, res) => {
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
});

app.post('/api/favoris', authenticateToken, async (req, res) => {
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
});

app.delete('/api/favoris/:id', authenticateToken, async (req, res) => {
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
});

// Routes des avis
app.get('/api/dramas/:id/avis', async (req, res) => {
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
});

app.post('/api/avis', authenticateToken, async (req, res) => {
  const { idDrama, note } = req.body;
  
  if (!idDrama || !note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'ID du drama et note (entre 1 et 5) requis' });
  }
  
  try {
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
});

// Route pour obtenir la note moyenne d'un drama
app.get('/api/dramas/:id/note-moyenne', async (req, res) => {
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
});

// Route pour vérifier si un drama est dans les favoris d'un utilisateur
app.get('/api/favoris/check/:idDrama', authenticateToken, async (req, res) => {
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
});

app.post('/api/test-login', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Récupérer l'utilisateur sans vérifier le mot de passe
    const [users] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const user = users[0];
    console.log('Utilisateur trouvé pour test-login:', user);
    
    // Générer un token sans vérifier le mot de passe
    const token = jwt.sign({ 
      id: user.ID_Utilisateur, 
      email: user.Email,
      type: user.Type_Utilisateur
    }, JWT_SECRET, { expiresIn: '24h' });
    
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
    console.error('Erreur lors du test de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Pour les tests unitaires, on exporte l'application
module.exports = app;