<template>
  <div class="home">
    <h1 class="mb-4">Découvrez les meilleurs dramas coréens</h1>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="my-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement des dramas...</p>
    </div>
    
    <!-- Dramas grid -->
    <div v-else>
      <div v-if="filteredDramas.length === 0" class="alert alert-info">
        Aucun drama ne correspond à votre recherche.
      </div>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="drama in filteredDramas" :key="drama.ID_Drama" class="col">
          <div class="card h-100">
            <!-- Placeholder image with alt text for accessibility -->
            <img 
:src="`/img/${formatImageName(drama.Titre)}.jpg`" 
class="card-img-top"
              :alt="'Image du drama ' + drama.Titre"
            >
            
            <div class="card-body">
              <h5 class="card-title">{{ drama.Titre }}</h5>
              <p class="card-text">
                <span class="badge bg-primary me-2">{{ drama.Genre }}</span>
                <small class="text-muted">{{ drama.Annee }}</small>
              </p>
              <p class="card-text">{{ drama.Synopsis | truncate(100) }}</p>
              <p class="card-text">
                <small class="text-muted">Acteurs: {{ drama.Acteurs }}</small>
              </p>
            </div>
            
            <div class="card-footer d-flex justify-content-between align-items-center">
              <router-link 
                :to="{ name: 'DramaDetails', params: { id: drama.ID_Drama }}" 
                class="btn btn-primary"
                :aria-label="'Voir les détails de ' + drama.Titre"
              >
                Voir détails
              </router-link>
              <div v-if="getAverageRating(drama.ID_Drama) > 0" class="text-warning">
                  {{ getAverageRating(drama.ID_Drama) > 0 ? getAverageRating(drama.ID_Drama).toFixed(1) : '0.0' }} {{ getAverageRating(drama.ID_Drama) | stars }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
name: 'Home',
data() {
  return {
    searchTerm: '',
    selectedGenre: ''
  };
},
computed: {
  ...mapGetters({
    dramas: 'drama/allDramas',
    isLoading: 'drama/isLoading'
  }),

  // Extraction des genres uniques
  genres() {
    const uniqueGenres = [...new Set(this.dramas.map(drama => drama.Genre))];
    return uniqueGenres.sort(); // Tri alphabétique
  },
    
  // Dramas filtrés selon la recherche et le genre
  filteredDramas() {
  return this.dramas.filter(drama => {
    // Récupérer le terme de recherche depuis l'URL
    const searchTermFromUrl = this.$route.query.search ? 
      this.$route.query.search.toLowerCase() : '';
    
    // Récupérer le genre depuis l'URL
    const genreFromUrl = this.$route.query.genre || '';
    
    // Utiliser le terme de recherche depuis l'URL ou le champ local
    const searchTerm = searchTermFromUrl || this.searchTerm.toLowerCase();
    
    // Filtrer par terme de recherche
    const matchesSearch = searchTerm === '' || 
      drama.Titre.toLowerCase().includes(searchTerm) || 
      drama.Acteurs.toLowerCase().includes(searchTerm) || 
      drama.Synopsis.toLowerCase().includes(searchTerm);
    
    // Filtrer par genre
    const matchesGenre = genreFromUrl === '' || drama.Genre === genreFromUrl;
    
    return matchesSearch && matchesGenre;
  });
}
},

watch: {
  // Surveiller les changements dans l'URL pour mettre à jour le filtrage
  ' $route.query': {
    handler() {
    // Si un terme de recherche est présent dans l'URL, le copier dans le champ local
    if (this.$route.query.search) {
      this.searchTerm = this.$route.query.search;
    }
    // Si un genre est sélectionné dans l'URL
    if (this.$route.query.genre) {
      this.selectedGenre = this.$route.query.genre;
    }
  },
  immediate: true
}
}, 

methods: {
  // Méthode pour formater le nom de l'image
  formatImageName(title) {
return title.toLowerCase()
  .replace(/[^a-z0-9\- ]/g, '')  // Permet de conserver les tirets
  .replace(/ /g, '-')            // Remplacer les espaces par des traits d'union
  .replace(/:/g, '')             // Supprimer les deux-points
  .replace(/-{2,}/g, '-')        // Remplacer les tirets multiples par un seul
},

  ...mapActions({
    fetchDramas: 'drama/fetchDramas'
  }),
  
  // Récupérer la note moyenne d'un drama
  getAverageRating(dramaId) {
    return this.$store.getters['rating/getAverageRating'](dramaId);
  }
},
async created() {
  try {
    // Charger tous les dramas
    await this.fetchDramas();
    
    // Charger les notes moyennes pour chaque drama
    this.dramas.forEach(drama => {
      this.$store.dispatch('rating/fetchAverageRating', drama.ID_Drama);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des dramas:', error);
    this.$root.$emit('show-message', 'Erreur lors du chargement des dramas.', 'danger');
  }
}
};
</script>

<style scoped>
.card-img-top {
width: 100%;
height: auto;  /* Hauteur automatique */
max-height: 350px;  /* Optionnel : limite maximale */
object-fit: scale-down;
}
</style>