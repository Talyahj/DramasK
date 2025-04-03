import favoriteService from '@/services/favorite.service';

const state = {
  favorites: [],
  loading: false
};

const getters = {
  allFavorites: state => state.favorites,
  isLoading: state => state.loading
};

const actions = {
  // Récupérer les favoris de l'utilisateur connecté
  async fetchFavorites({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await favoriteService.getUserFavorites();
      commit('SET_FAVORITES', response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Vérifier si un drama est dans les favoris
  async checkFavorite({ commit }, idDrama) {
    try {
      const response = await favoriteService.checkFavorite(idDrama);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Ajouter un drama aux favoris
  async addToFavorites({ commit }, idDrama) {
    try {
      const response = await favoriteService.addToFavorites(idDrama);
      // Ne pas mettre à jour le state ici car nous n'avons pas les détails complets du drama
      // Plutôt recharger les favoris complets
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer un drama des favoris
  async removeFromFavorites({ commit }, idFavoris) {
    try {
      await favoriteService.removeFromFavorites(idFavoris);
      commit('REMOVE_FAVORITE', idFavoris);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_FAVORITES(state, favorites) {
    state.favorites = favorites;
  },
  REMOVE_FAVORITE(state, idFavoris) {
    state.favorites = state.favorites.filter(favorite => favorite.ID_Favoris !== parseInt(idFavoris));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};