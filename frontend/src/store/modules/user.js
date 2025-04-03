import userService from '@/services/user.service';

const state = {
  token: null,
  user: null
};

const getters = {
  isLoggedIn: state => !!state.token,
  user: state => state.user || {},
  isAdmin: state => state.user && state.user.type === 'admin'
};

const actions = {
  // Login
  async login({ commit }, credentials) {
    try {
      const response = await userService.login(credentials);
      commit('SET_USER_DATA', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Register
  async register({ commit }, userData) {
    try {
      const response = await userService.register(userData);
      commit('SET_USER_DATA', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout
  logout({ commit }) {
    userService.logout();
    commit('CLEAR_USER_DATA');
    // Réinitialiser l'état du store (optionnel)
    location.reload();
  },
  
  // Set user data from localStorage
  setUserData({ commit }, userData) {
    commit('SET_USER_DATA', userData);
  }
};

const mutations = {
  SET_USER_DATA(state, userData) {
    state.token = userData.token;
    state.user = {
      ...userData.user,
      isAdmin: userData.user.type === 'admin'
    };
  },
  CLEAR_USER_DATA(state) {
    state.token = null;
    state.user = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};