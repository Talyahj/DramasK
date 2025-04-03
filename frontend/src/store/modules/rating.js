import ratingService from '@/services/rating.service';

const state = {
  ratings: {},
  averageRatings: {},
  loading: false
};

const getters = {
  getRatingsForDrama: state => (idDrama) => state.ratings[idDrama] || [],
  getAverageRating: state => (idDrama) => {
    const avg = state.averageRatings[idDrama];
    // Convertir en nombre et retourner 0 si NaN
    return Number(avg) || 0;
  },
  isLoading: state => state.loading
};

const actions = {
  // Récupérer les avis pour un drama
  async fetchRatings({ commit }, idDrama) {
    commit('SET_LOADING', true);
    try {
      const response = await ratingService.getDramaRatings(idDrama);
      commit('SET_RATINGS', { idDrama, ratings: response.data });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      // En cas d'erreur, on définit un tableau vide pour éviter des erreurs dans l'UI
      commit('SET_RATINGS', { idDrama, ratings: [] });
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Récupérer la note moyenne d'un drama
  async fetchAverageRating({ commit }, idDrama) {
    try {
      const response = await ratingService.getDramaAverageRating(idDrama);
      const moyenne = response.data.moyenne !== null ? Number(response.data.moyenne) : 0;
      commit('SET_AVERAGE_RATING', { idDrama, average: moyenne });
      return moyenne;
    } catch (error) {
      console.error('Erreur lors du chargement de la note moyenne:', error);
      // En cas d'erreur, on définit 0 comme valeur par défaut
      commit('SET_AVERAGE_RATING', { idDrama, average: 0 });
      throw error;
    }
  },
  
  // Ajouter ou mettre à jour un avis
  async rateDrama({ commit, dispatch }, { idDrama, note }) {
    try {
      await ratingService.rateDrama(idDrama, note);
      // Recharger les avis et la note moyenne
      await dispatch('fetchRatings', idDrama);
      await dispatch('fetchAverageRating', idDrama);
      return true;
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      throw error;
    }
  }
};

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_RATINGS(state, { idDrama, ratings }) {
    state.ratings = {
      ...state.ratings,
      [idDrama]: ratings
    };
  },
  SET_AVERAGE_RATING(state, { idDrama, average }) {
    state.averageRatings = {
      ...state.averageRatings,
      [idDrama]: average
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};