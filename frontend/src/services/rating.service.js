import api from './api';

export default {
  // Récupérer les avis pour un drama
  getDramaRatings(dramaId) {
    return api.get(`/dramas/${dramaId}/avis`);
  },
  
  // Récupérer la note moyenne d'un drama
  getDramaAverageRating(dramaId) {
    return api.get(`/dramas/${dramaId}/note-moyenne`);
  },
  
  // Ajouter ou mettre à jour un avis
  rateDrama(dramaId, rating) {
    return api.post('/avis', { idDrama: dramaId, note: rating });
  }
};