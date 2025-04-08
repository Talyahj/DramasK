import api from './api';

export default {
  // Récupérer tous les dramas
  getAllDramas() {
    return api.get('/dramas');
  },
  
  // Récupérer un drama par son ID
  getDrama(id) {
    return api.get(`/dramas/${id}`);
  },
  
  // Ajouter un nouveau drama (admin seulement)
  createDrama(dramaData) {
    return api.post('/dramas', dramaData);
  },
  
  // Mettre à jour un drama existant (admin seulement)
  updateDrama(id, dramaData) {
    return api.put(`/dramas/${id}`, dramaData);
  },
  
  // Supprimer un drama (admin seulement)
  deleteDrama(id) {
    return api.delete(`/dramas/${id}`);
  },

  // Récupérer tous les genres disponibles
getAllGenres() {
  return api.get('/genres');
}
};