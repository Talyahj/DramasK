<template>
    <div class="home">
      <h1 class="mb-4">Découvrez les meilleurs dramas coréens</h1>
      
      <!-- Filtre par genre -->
      <div class="mb-4">
        <label for="genre-filter" class="form-label">Filtrer par genre:</label>
        <select id="genre-filter" class="form-select" v-model="selectedGenre">
          <option value="">Tous les genres</option>
          <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
        </select>
      </div>
      
      <!-- Recherche -->
      <div class="mb-4">
        <label for="search-input" class="form-label">Rechercher:</label>
        <input 
          type="text" 
          id="search-input" 
          class="form-control" 
          v-model="searchTerm" 
          placeholder="Rechercher par titre, acteur..."
          aria-label="Rechercher un drama par titre ou acteur"
        >
      </div>
      
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
        // Convertir les chaînes en minuscules pour une recherche non sensible à la casse
        const searchTerm = this.searchTerm.toLowerCase();
        const titre = (drama.Titre || '').toLowerCase();
        const acteurs = (drama.Acteurs || '').toLowerCase();
        const synopsis = (drama.Synopsis || '').toLowerCase();
        const genre = (drama.Genre || '').toLowerCase();
        
        // Vérifier si le terme de recherche correspond à l'un des champs
        const matchesSearch = searchTerm === '' || 
          titre.includes(searchTerm) || 
          acteurs.includes(searchTerm) || 
          synopsis.includes(searchTerm);
        
        // Vérifier si le genre correspond au filtre sélectionné
        const matchesGenre = this.selectedGenre === '' || drama.Genre === this.selectedGenre;
        
        return matchesSearch && matchesGenre;
      });
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