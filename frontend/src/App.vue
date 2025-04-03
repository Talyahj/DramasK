<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <router-link class="navbar-brand" to="/">
            <span class="text-warning">Dramas</span>K
          </router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Accueil</router-link>
              </li>
              <li class="nav-item" v-if="isLoggedIn && !isAdmin">
                <router-link class="nav-link" to="/favoris">Mes Favoris</router-link>
              </li>
              <li class="nav-item" v-if="isAdmin">
                <router-link class="nav-link" to="/admin">Administration</router-link>
              </li>
            </ul>
            <ul class="navbar-nav">
              <template v-if="!isLoggedIn">
                <li class="nav-item">
                  <router-link class="nav-link" to="/login">Connexion</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/register">Inscription</router-link>
                </li>
              </template>
              <li class="nav-item dropdown" v-else>
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ user.nom }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#" @click.prevent="logout">Déconnexion</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    
    <main class="container my-4">
      <!-- Affichage des messages d'alerte -->
      <div v-if="message" :class="['alert', 'alert-' + messageType, 'alert-dismissible', 'fade', 'show']" role="alert">
        {{ message }}
        <button type="button" class="btn-close" @click="clearMessage"></button>
      </div>
      
      <router-view/>
    </main>
    
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container text-center">
        <p>DramasK &copy; {{ new Date().getFullYear() }} - Tous droits réservés</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '',
      messageType: 'info'
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn'];
    },
    user() {
      return this.$store.getters['user/user'];
    },
    isAdmin() {
  return this.isLoggedIn && this.user && (this.user.type === 'admin' || this.user.isAdmin);
}
  },
  created() {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.$store.dispatch('user/setUserData', {
        token,
        user: JSON.parse(user)
      });
    }
    
    // Écouter les événements de message
    this.$root.$on('show-message', (message, type = 'info') => {
      this.message = message;
      this.messageType = type;
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        this.clearMessage();
      }, 5000);
    });
  },
  methods: {
    clearMessage() {
      this.message = '';
    },
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/');
      this.$root.$emit('show-message', 'Vous avez été déconnecté avec succès.', 'success');
    }
  }
};
</script>

<style>
/* Styles globaux */
html, body {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Amélioration de l'accessibilité - contraste */
.text-warning {
  color: #ffc107 !important;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.card-title {
  font-weight: bold;
}

/* Amélioration de l'accessibilité - focus */
:focus {
  outline: 3px solid #78aeff !important;
  outline-offset: 1px;
}

.nav-link:focus, .btn:focus, a:focus {
  outline: 3px solid #78aeff !important;
  outline-offset: 1px;
}
</style>