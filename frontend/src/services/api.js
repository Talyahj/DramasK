import axios from 'axios';
import store from '@/store';
import router from '@/router';

// Utiliser l'URL de l'API depuis les variables d'environnement
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

// Créer une instance d'Axios avec des configurations par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Timeout après 10 secondes
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  config => {
    // Ajouter le token d'authentification à chaque requête si disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Erreur lors de la requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Gestion des erreurs retournées par le serveur
      const { status, data } = error.response;
      
      if (status === 401) {
        // Non authentifié, redirection vers la page de connexion
        store.dispatch('user/logout');
        
        // Éviter une redirection vers login si on est déjà sur login
        if (router.currentRoute.path !== '/login') {
          router.push({ 
            path: '/login', 
            query: { redirect: router.currentRoute.fullPath } 
          });
        }
        
        // Message d'erreur pour l'utilisateur
        if (window.Vue) {
          window.Vue.prototype.$root.$emit(
            'show-message', 
            'Votre session a expiré. Veuillez vous reconnecter.', 
            'warning'
          );
        }
      } else if (status === 403) {
        // Accès refusé
        if (window.Vue) {
          window.Vue.prototype.$root.$emit(
            'show-message', 
            'Vous n\'avez pas les droits pour effectuer cette action.', 
            'danger'
          );
        }
      } else if (status === 500) {
        // Erreur serveur
        if (window.Vue) {
          window.Vue.prototype.$root.$emit(
            'show-message', 
            'Une erreur serveur est survenue. Veuillez réessayer plus tard.', 
            'danger'
          );
        }
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur:', error.request);
      if (window.Vue) {
        window.Vue.prototype.$root.$emit(
          'show-message', 
          'Le serveur ne répond pas. Veuillez vérifier votre connexion.', 
          'danger'
        );
      }
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur lors de la configuration de la requête:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;