require('dotenv').config();

const app = require('./app');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 3000;

// Configuration base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DramasK',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Fonction pour vérifier la connexion à la base de données
async function checkDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie avec succès');
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
async function startServer() {
  try {
    // Vérifier la connexion à la base de données avant de démarrer le serveur
    await checkDatabaseConnection();
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`API accessible à http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();