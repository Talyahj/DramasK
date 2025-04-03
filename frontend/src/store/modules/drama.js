import dramaService from '@/services/drama.service';

const state = {
  dramas: [],
  currentDrama: null,
  loading: false
};

const getters = {
  allDramas: state => state.dramas,
  currentDrama: state => state.currentDrama,
  isLoading: state => state.loading
};

const actions = {
  // Récupérer tous les dramas
  async fetchDramas({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await dramaService.getAllDramas();
      commit('SET_DRAMAS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Récupérer un drama par son ID
  async fetchDrama({ commit }, id) {
    commit('SET_LOADING', true);
    try {
      const response = await dramaService.getDrama(id);
      commit('SET_CURRENT_DRAMA', response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Ajouter un nouveau drama (admin uniquement)
  async addDrama({ commit }, dramaData) {
    try {
      const response = await dramaService.createDrama(dramaData);
      commit('ADD_DRAMA', { ...dramaData, ID_Drama: response.data.id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Mettre à jour un drama existant (admin uniquement)
  async updateDrama({ commit }, { id, dramaData }) {
    try {
      await dramaService.updateDrama(id, dramaData);
      commit('UPDATE_DRAMA', { id, dramaData });
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer un drama (admin uniquement)
  async deleteDrama({ commit }, id) {
    try {
      await dramaService.deleteDrama(id);
      commit('DELETE_DRAMA', id);
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
  SET_DRAMAS(state, dramas) {
    state.dramas = dramas;
  },
  SET_CURRENT_DRAMA(state, drama) {
    state.currentDrama = drama;
  },
  ADD_DRAMA(state, drama) {
    state.dramas.push(drama);
  },
  UPDATE_DRAMA(state, { id, dramaData }) {
    const index = state.dramas.findIndex(drama => drama.ID_Drama === parseInt(id));
    if (index !== -1) {
      state.dramas.splice(index, 1, { ...state.dramas[index], ...dramaData });
    }
    if (state.currentDrama && state.currentDrama.ID_Drama === parseInt(id)) {
      state.currentDrama = { ...state.currentDrama, ...dramaData };
    }
  },
  DELETE_DRAMA(state, id) {
    state.dramas = state.dramas.filter(drama => drama.ID_Drama !== parseInt(id));
    if (state.currentDrama && state.currentDrama.ID_Drama === parseInt(id)) {
      state.currentDrama = null;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};