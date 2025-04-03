const request = require('supertest');
const app = require('../app');
const mysql = require('mysql2/promise');
const auth = require('../utils/auth');

// Mock des fonctions d'authentification
jest.mock('../utils/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 1, email: 'admin@dramask.com', type: 'admin' };
    next();
  }),
  isAdmin: jest.fn((req, res, next) => {
    next();
  }),
  JWT_SECRET: 'test-secret'
}));

// Mock de la connexion à la base de données
jest.mock('mysql2/promise', () => {
  const mockQuery = jest.fn();
  return {
    createPool: jest.fn().mockReturnValue({
      query: mockQuery
    })
  };
});

describe('API Dramas', () => {
  let pool;
  
  beforeEach(() => {
    pool = mysql.createPool();
    jest.clearAllMocks();
  });
  
  describe('GET /api/dramas', () => {
    it('devrait retourner tous les dramas', async () => {
      const mockDramas = [
        { ID_Drama: 1, Titre: 'Drama Test 1', Synopsis: 'Synopsis test 1', Genre: 'Action', Acteurs: 'Acteur test 1', Annee: 2021 },
        { ID_Drama: 2, Titre: 'Drama Test 2', Synopsis: 'Synopsis test 2', Genre: 'Comédie', Acteurs: 'Acteur test 2', Annee: 2022 }
      ];
      
      pool.query.mockResolvedValueOnce([mockDramas]);
      
      const response = await request(app).get('/api/dramas');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDramas);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Drama ORDER BY Titre ASC');
    });
  });
  
  describe('GET /api/dramas/:id', () => {
    it('devrait retourner un drama par son ID', async () => {
      const mockDrama = { 
        ID_Drama: 1, 
        Titre: 'Drama Test',
        Synopsis: 'Synopsis test', 
        Genre: 'Action', 
        Acteurs: 'Acteur test', 
        Annee: 2021 
      };
      
      pool.query.mockResolvedValueOnce([[mockDrama]]);
      
      const response = await request(app).get('/api/dramas/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDrama);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Drama WHERE ID_Drama = ?', ['1']);
    });
    
    it('devrait retourner 404 si le drama n\'existe pas', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      
      const response = await request(app).get('/api/dramas/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Drama non trouvé');
    });
  });
  
  describe('POST /api/dramas', () => {
    it('devrait créer un nouveau drama', async () => {
      const dramaData = {
        titre: 'Nouveau Drama',
        synopsis: 'Synopsis du nouveau drama',
        genre: 'Action',
        acteurs: 'Acteurs du nouveau drama',
        annee: 2023
      };
      
      pool.query.mockResolvedValueOnce([{ insertId: 3 }]);
      
      const response = await request(app)
        .post('/api/dramas')
        .send(dramaData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Drama ajouté avec succès');
      expect(response.body).toHaveProperty('id', 3);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO Drama (Titre, Synopsis, Genre, Acteurs, Annee) VALUES (?, ?, ?, ?, ?)',
        [dramaData.titre, dramaData.synopsis, dramaData.genre, dramaData.acteurs, dramaData.annee]
      );
    });
    
    it('devrait retourner 400 si tous les champs ne sont pas fournis', async () => {
      const incompleteData = {
        titre: 'Nouveau Drama',
        synopsis: 'Synopsis du nouveau drama'
        // genre, acteurs et annee manquants
      };
      
      const response = await request(app)
        .post('/api/dramas')
        .send(incompleteData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Tous les champs sont requis');
    });
  });
  
  // Vous pouvez ajouter plus de tests pour les autres routes (PUT, DELETE, etc.)
});