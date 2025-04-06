<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
          <!-- Partie gauche : recherche avec les fonctionnalités du champ original -->
          <div class="search-container d-none d-md-flex">
            <input 
              type="text" 
              class="form-control search-input" 
              v-model="searchTerm" 
              placeholder="Rechercher par titre, acteur..." 
              aria-label="Rechercher un drama par titre ou acteur"
              @keyup.enter="handleSearchInput"
            >
          </div>
          
          <!-- Logo au centre, vraiment centré, qui renvoie à la page d'accueil sans filtres -->
          <div class="navbar-brand-container mx-auto">
            <a class="navbar-brand" href="/" @click.prevent="resetAndGoHome">
              <img src="@/assets/logo.png" alt="DramasK Logo" class="logo-img">
            </a>
          </div>
          
          <!-- Toggle button pour mobile -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <!-- Partie droite : navigation (sans le lien Accueil) -->
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item" v-if="isLoggedIn && !isAdmin">
                <router-link class="nav-link" to="/favoris">Mes Favoris</router-link>
              </li>
              <li class="nav-item" v-if="isAdmin">
                <router-link class="nav-link" to="/admin">Administration</router-link>
              </li>
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
      
      <!-- Barre de recherche mobile -->
      <div class="container d-md-none mt-2 mb-3">
        <div class="search-container-mobile w-100">
          <input 
            type="text" 
            class="form-control search-input" 
            v-model="searchTerm" 
            placeholder="Rechercher par titre, acteur..." 
            aria-label="Rechercher un drama par titre ou acteur"
            @keyup.enter="handleSearchInput"
          >
        </div>
      </div>
      
      <!-- Barre de genres stylisée qui s'adapte dynamiquement avec flèches de défilement -->
      <div class="category-bar-container">
        <button 
          class="scroll-arrow scroll-left" 
          @click="scrollCategories('left')" 
          aria-label="Faire défiler les genres vers la gauche"
          v-show="showLeftArrow"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <div class="category-bar" ref="categoryBar" @scroll="checkScrollPosition">
          <div class="container text-center">
            <!-- Liens générés dynamiquement à partir des genres disponibles -->
            <a href="#" @click.prevent="setGenre('')" class="category-item" :class="{ active: selectedGenre === '' }">
              Tous les genres
            </a>
            <a 
              v-for="genre in genres" 
              :key="genre" 
              href="#" 
              @click.prevent="setGenre(genre)" 
              class="category-item" 
              :class="{ active: selectedGenre === genre }"
            >
              {{ genre }}
            </a>
          </div>
        </div>
        
        <button 
          class="scroll-arrow scroll-right" 
          @click="scrollCategories('right')" 
          aria-label="Faire défiler les genres vers la droite"
          v-show="showRightArrow"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </header>
    
    <main class="container my-4">
      <!-- Affichage des messages d'alerte -->
      <div v-if="message" :class="['alert', 'alert-' + messageType, 'alert-dismissible', 'fade', 'show']" role="alert">
        {{ message }}
        <button type="button" class="btn-close" @click="clearMessage"></button>
      </div>
      
      <!-- Ajout de l'attribut :key pour forcer la reconstruction du composant quand l'URL change -->
      <router-view :key="$route.fullPath"/>
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
      messageType: 'info',
      searchTerm: '',
      selectedGenre: '',
      genres: [],
      showLeftArrow: false,
      showRightArrow: false,
      isNavigating: false // Indicateur pour éviter les navigations multiples
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
    },
    currentPath() {
      return this.$route.path;
    },
    currentQuery() {
      return {
        ...this.$route.query
      };
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
    
    // Récupérer les filtres depuis l'URL
    this.syncFiltersFromRoute();
    
    // Écouter les événements de message
    this.$root.$on('show-message', (message, type = 'info') => {
      this.message = message;
      this.messageType = type;
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        this.clearMessage();
      }, 5000);
    });
    
    // Charger les genres depuis le store ou l'API
    this.loadGenres();
  },
  mounted() {
    // Vérifier si les flèches de défilement sont nécessaires
    this.$nextTick(() => {
      this.checkScrollPosition();
      window.addEventListener('resize', this.checkScrollPosition);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScrollPosition);
  },
  methods: {
    // Synchroniser les filtres depuis l'URL
    syncFiltersFromRoute() {
      this.searchTerm = this.$route.query.search || '';
      this.selectedGenre = this.$route.query.genre || '';
    },
    
    clearMessage() {
      this.message = '';
    },
    
    logout() {
      this.$store.dispatch('user/logout');
      
      // Si déjà sur la page d'accueil, juste vider les filtres et réinitialiser l'URL
      this.searchTerm = '';
      this.selectedGenre = '';
      
      if (this.currentPath !== '/' || Object.keys(this.$route.query).length > 0) {
        try {
          this.$router.push('/').catch((error) => {
            if (error.name !== 'NavigationDuplicated') {
              throw error;
            }
          });
        } catch (e) {
          console.log('Navigation error handled');
        }
      }
      
      this.$root.$emit('show-message', 'Vous avez été déconnecté avec succès.', 'success');
    },
    
    // Gestion de la recherche
    handleSearchInput() {
      if (this.isNavigating) return;
      
      const newQuery = { ...this.currentQuery };
      
      if (this.searchTerm.trim()) {
        newQuery.search = this.searchTerm.trim();
      } else {
        delete newQuery.search;
      }
      
      this.safeNavigate(newQuery);
    },
    
    // Retour à l'accueil avec réinitialisation des filtres
    resetAndGoHome() {
      if (this.isNavigating) return;
      
      this.searchTerm = '';
      this.selectedGenre = '';
      
      if (this.currentPath !== '/' || Object.keys(this.$route.query).length > 0) {
        this.safeNavigate({});
      }
    },
    
    // Gestion de la sélection de genre
    setGenre(genre) {
      if (this.isNavigating) return;
      
      this.selectedGenre = genre;
      
      const newQuery = { ...this.currentQuery };
      
      if (genre) {
        newQuery.genre = genre;
      } else {
        delete newQuery.genre;
      }
      
      this.safeNavigate(newQuery);
    },
    
    // Navigation sécurisée pour éviter les erreurs
    safeNavigate(query) {
      if (this.isNavigating) return;
      
      this.isNavigating = true;
      
      // Vérifier si les query params ont changé
      const currentQueryString = JSON.stringify(this.currentQuery);
      const newQueryString = JSON.stringify(query);
      
      if (currentQueryString === newQueryString && this.currentPath === '/') {
        // Si aucun changement, ne rien faire
        this.isNavigating = false;
        return;
      }
      
      try {
        const navigationPromise = this.currentPath === '/' 
          ? this.$router.replace({ query }).catch(err => {
              if (err.name !== 'NavigationDuplicated') throw err;
            })
          : this.$router.push({ path: '/', query }).catch(err => {
              if (err.name !== 'NavigationDuplicated') throw err;
            });
        
        navigationPromise.finally(() => {
          setTimeout(() => {
            this.isNavigating = false;
          }, 100);
        });
      } catch (e) {
        console.log('Navigation error handled');
        this.isNavigating = false;
      }
    },
    
    // Charger les genres disponibles
    async loadGenres() {
      try {
        // Méthode 1: Récupérer les genres depuis le store
        if (this.$store.getters['drama/allDramas'].length > 0) {
          this.extractGenresFromDramas(this.$store.getters['drama/allDramas']);
        } else {
          // Méthode 2: Charger les dramas puis extraire les genres
          await this.$store.dispatch('drama/fetchDramas');
          this.extractGenresFromDramas(this.$store.getters['drama/allDramas']);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
        // Genres par défaut en cas d'erreur
        this.genres = ['Romance', 'Action', 'Comedy', 'Medical', 'Legal', 'Sports', 'Historical', 'Thriller', 'Drame'];
      }
    },
    
    // Extraire les genres uniques des dramas
    extractGenresFromDramas(dramas) {
      if (dramas && dramas.length > 0) {
        // Extraire les genres uniques et les trier
        const uniqueGenres = [...new Set(dramas.map(drama => drama.Genre))];
        this.genres = uniqueGenres.sort();
        
        // Vérifier si les flèches de défilement sont nécessaires
        this.$nextTick(() => {
          this.checkScrollPosition();
        });
      }
    },
    
    // Gestion du défilement horizontal des genres
    scrollCategories(direction) {
      if (!this.$refs.categoryBar) return;
      
      const container = this.$refs.categoryBar;
      const scrollAmount = 200; // Ajustez selon vos besoins
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    },
    
    // Vérifier si les flèches de défilement sont nécessaires
    checkScrollPosition() {
      if (!this.$refs.categoryBar) return;
      
      const container = this.$refs.categoryBar;
      
      // Montrer la flèche gauche si on peut défiler vers la gauche
      this.showLeftArrow = container.scrollLeft > 0;
      
      // Montrer la flèche droite si on peut défiler vers la droite
      this.showRightArrow = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    }
  },
  // Observer les changements d'URL
  watch: {
    $route: {
      handler() {
        this.syncFiltersFromRoute();
      },
      deep: true
    }
  }
};
</script>

<style>
:root {
  --primary-color: #4E231B; /* Marron foncé */
  --secondary-color: #8A3E38; /* Rouge-brun */
  --accent-color: #7B3027; /* Rouge foncé/bordeaux */
  --light-color: #F5EDE5; /* Beige clair */
  --dark-color: #2E140F; /* Marron très foncé */
  --text-color: #2A2A2A; /* Presque noir */
  --form-color: #5B1715; /* Couleur pour les boutons "Form" */
  --category-bg: #D0A89B; /* Couleur de fond pour les catégories */
}

html, body {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: var(--light-color);
  color: var(--text-color);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 100% de la hauteur de la fenêtre */
}

main {
  flex: 1; /* Pour que le contenu principal occupe tout l'espace disponible */
}

/* Header et navigation */
.navbar {
  padding: 15px 0;
  background-color: var(--primary-color) !important;
}

/* Style pour vraiment centrer le logo */
.navbar-brand-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-img {
  height: 100px; /* Logo agrandi */
  max-width: 100%;
  display: block;
}

.nav-link {
  color: white !important;
  font-weight: 500;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--light-color) !important;
  opacity: 0.9;
}

/* Barre de recherche */
.search-container {
  max-width: 250px;
}

.search-input {
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  padding-left: 15px;
}

/* Barre de catégories avec flèches de défilement */
.category-bar-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.category-bar {
  background-color: var(--category-bg);
  padding: 10px 0;
  overflow-x: auto;
  white-space: nowrap;
  flex-grow: 1;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth;
}

.category-bar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.scroll-arrow {
  position: absolute;
  z-index: 10;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
  transition: opacity 0.3s;
}

.scroll-arrow:hover {
  opacity: 1;
}

.scroll-left {
  left: 0;
}

.scroll-right {
  right: 0;
}

.category-item {
  color: var(--primary-color);
  padding: 5px 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 20px;
  margin: 0 5px;
  display: inline-block;
  font-weight: 500;
}

.category-item:hover, .category-item.active {
  background-color: var(--form-color);
  color: white;
  text-decoration: none;
}

/* Buttons - IMPORTANT: Tous les boutons maintenant en couleur marron/bordeaux */
.btn-primary {
  background-color: var(--form-color) !important;
  border-color: var(--form-color) !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
}

.btn-outline-primary {
  color: var(--form-color) !important;
  border-color: var(--form-color) !important;
  background-color: transparent !important;
}

.btn-outline-primary:hover {
  background-color: var(--form-color) !important;
  color: white !important;
}

.btn-danger {
  background-color: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
}

.btn-outline-danger {
  color: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
}

.btn-outline-danger:hover {
  background-color: var(--accent-color) !important;
  color: white !important;
}

.btn-success, .btn-info, .btn-warning {
  background-color: var(--form-color) !important;
  border-color: var(--form-color) !important;
  color: white !important;
}

/* Cards */
.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background-color: white;
}

.card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: var(--primary-color);
  font-weight: bold;
}

/* Footer */
footer {
  background-color: var(--primary-color) !important;
  margin-top: auto; /* Pousse le footer vers le bas */
}

/* Amélioration de l'accessibilité - focus */
:focus {
  outline: 3px solid var(--secondary-color) !important;
  outline-offset: 1px;
}

/* Dropdown styles */
.dropdown-menu {
  background-color: var(--light-color);
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  color: var(--text-color);
}

.dropdown-item:hover {
  background-color: var(--secondary-color);
  color: white;
}

/* Badges */
.badge {
  background-color: var(--accent-color) !important;
}

.badge.bg-primary {
  background-color: var(--form-color) !important;
}

/* Pagination */
.page-item.active .page-link {
  background-color: var(--form-color) !important;
  border-color: var(--form-color) !important;
}

.page-link {
  color: var(--form-color) !important;
}

.page-link:hover {
  background-color: var(--accent-color) !important;
  color: white !important;
}

/* Text colors */
.text-primary {
  color: var(--form-color) !important;
}

.text-success, .text-info, .text-warning {
  color: var(--secondary-color) !important;
}

/* Progress bars */
.progress-bar {
  background-color: var(--form-color) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-brand-container {
    position: relative;
    left: 0;
    transform: none;
  }
  
  .search-container-mobile {
    margin-bottom: 10px;
  }
  
  .logo-img {
    height: 40px; /* Logo un peu plus petit sur mobile */
  }
  
  .category-bar {
    padding: 8px 0;
  }
  
  .category-item {
    padding: 4px 12px;
    margin: 0 3px;
    font-size: 0.9rem;
  }
  
  .scroll-arrow {
    width: 28px;
    height: 28px;
  }
}
</style>