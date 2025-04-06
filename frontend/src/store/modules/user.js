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
      console.error('Erreur de connexion:', error);
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
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },
  
  // Logout
  logout({ commit }) {
    userService.logout();
    commit('CLEAR_USER_DATA');
    
    // Ne pas recharger la page pour une meilleure expérience utilisateur
    // Plutôt réinitialiser les modules du store qui contiennent des données utilisateur
    commit('favorite/SET_FAVORITES', [], { root: true });
  },
  
  // Set user data from localStorage
  setUserData({ commit }, userData) {
    commit('SET_USER_DATA', userData);
  },
  
  // Vérifier si l'utilisateur est toujours connecté
  async checkAuthStatus({ commit, state }) {
    // Si pas de token, l'utilisateur n'est pas connecté
    if (!state.token) return false;
    
    try {
      // On pourrait implémenter un appel API pour vérifier la validité du token
      // Pour l'instant, on vérifie juste que les données sont cohérentes
      return !!state.user;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
      // En cas d'erreur, on déconnecte l'utilisateur
      userService.logout();
      commit('CLEAR_USER_DATA');
      return false;
    }
  }
};

const mutations = {
  SET_USER_DATA(state, userData) {
    state.token = userData.token;
    state.user = userData.user;
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