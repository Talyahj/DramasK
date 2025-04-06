import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Désactiver les avertissements de production
Vue.config.productionTip = false;

// Rendre l'instance Vue accessible globalement pour l'API client
window.Vue = Vue;

// Filtre pour limiter la longueur du texte
Vue.filter('truncate', (text, length, suffix) => {
  if (!text) return '';
  if (text.length > length) {
    return text.substring(0, length) + (suffix || '...');
  } else {
    return text;
  }
});

// Filtre pour formater les notes (étoiles)
Vue.filter('stars', value => {
  const stars = '★'.repeat(Math.round(value || 0));
  const emptyStars = '☆'.repeat(5 - Math.round(value || 0));
  return stars + emptyStars;
});

// Directive personnalisée pour le focus automatique
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
});

// Directive personnalisée pour le clic en dehors
Vue.directive('click-outside', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
});

// Gestionnaire d'erreurs global
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);
};

// Intercepter les erreurs non capturées
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Instance principale de Vue
new Vue({
  router,
  store,
  render: h => h(App),
  
  // Hook created pour vérifier s'il y a un utilisateur en session
  created() {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Mettre à jour le store avec les données utilisateur
      this.$store.dispatch('user/setUserData', {
        token,
        user: JSON.parse(user)
      });
    }
  }
}).$mount('#app');