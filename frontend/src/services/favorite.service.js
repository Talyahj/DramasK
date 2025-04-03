import api from './api';

export default {
  // Récupérer les favoris de l'utilisateur connecté
  getUserFavorites() {
    return api.get('/favoris');
  },
  
  // Vérifier si un drama est dans les favoris
  checkFavorite(dramaId) {
    return api.get(`/favoris/check/${dramaId}`);
  },
  
  // Ajouter un drama aux favoris
  addToFavorites(dramaId) {
    return api.post('/favoris', { idDrama: dramaId });
  },
  
  // Supprimer un drama des favoris
  removeFromFavorites(favorisId) {
    return api.delete(`/favoris/${favorisId}`);
  }
};