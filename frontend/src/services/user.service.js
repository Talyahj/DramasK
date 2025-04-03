import api from './api';

export default {
  // Connexion
  login(credentials) {
    console.log('Service user - tentative de connexion avec:', credentials);
    return api.post('/login', credentials);
  },
  
  // Inscription
  register(userData) {
    return api.post('/register', userData);
  },
  
  // Récupérer les infos de l'utilisateur connecté
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Vérifier si l'utilisateur est connecté
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },
  
  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.type === 'admin';
  },
  
  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};