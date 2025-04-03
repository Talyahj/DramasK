<template>
  <div class="user-favorites">
    <h1 class="mb-4">Mes dramas favoris</h1>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="my-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement de vos favoris...</p>
    </div>
    
    <!-- Favoris vides -->
    <div v-else-if="favorites.length === 0" class="alert alert-info">
      <p>Vous n'avez pas encore de dramas favoris.</p>
      <router-link to="/" class="btn btn-primary">Découvrir des dramas</router-link>
    </div>
    
    <!-- Liste des favoris -->
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="favorite in favorites" :key="favorite.ID_Favoris" class="col">
        <div class="card h-100">
          <!-- Image avec texte alternatif pour accessibilité -->
          <img 
            :src="`/img/${formatImageName(favorite.Titre)}.jpg`" 
            class="card-img-top" 
            :alt="'Image du drama ' + favorite.Titre"
          >
          
          <div class="card-body">
            <h5 class="card-title">{{ favorite.Titre }}</h5>
            <p class="card-text">
              <span class="badge bg-primary me-2">{{ favorite.Genre }}</span>
              <small class="text-muted">{{ favorite.Annee }}</small>
            </p>
            <p class="card-text">{{ favorite.Synopsis | truncate(100) }}</p>
          </div>
          
          <div class="card-footer d-flex justify-content-between align-items-center">
            <router-link 
              :to="{ name: 'DramaDetails', params: { id: favorite.ID_Drama }}" 
              class="btn btn-primary"
              :aria-label="'Voir les détails de ' + favorite.Titre"
            >
              Voir détails
            </router-link>
            
            <button 
              class="btn btn-outline-danger"
              @click="removeFavorite(favorite)"
              :aria-label="'Retirer ' + favorite.Titre + ' des favoris'"
            >
              <i class="bi bi-heart-fill"></i> Retirer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserFavorites',
  computed: {
    ...mapGetters({
      favorites: 'favorite/allFavorites',
      isLoading: 'favorite/isLoading'
    })
  },
  methods: {
    ...mapActions({
      fetchFavorites: 'favorite/fetchFavorites'
    }),
    
    async removeFavorite(favorite) {
      try {
        await this.$store.dispatch('favorite/removeFromFavorites', favorite.ID_Favoris);
        this.$root.$emit('show-message', `${favorite.Titre} a été retiré de vos favoris.`, 'success');
      } catch (error) {
        console.error('Erreur lors de la suppression du favori:', error);
        this.$root.$emit('show-message', 'Erreur lors de la suppression du favori.', 'danger');
      }
    },
    
    // Ajoutez cette fonction pour formater le nom de l'image
    formatImageName(title) {
      return title.toLowerCase()
        .replace(/[^a-z0-9\- ]/g, '')  // Permet de conserver les tirets
        .replace(/ /g, '-')            // Remplacer les espaces par des traits d'union
        .replace(/:/g, '')             // Supprimer les deux-points
        .replace(/-{2,}/g, '-');       // Remplacer les tirets multiples par un seul
    },
    
    // Ajoutez cette fonction pour gérer les erreurs de chargement d'image
    handleImageError(event, title) {
      // Si l'image ne peut pas être chargée, remplacer par une image par défaut
      event.target.src = "https://via.placeholder.com/350x200?text=Drama+Image";
      console.log(`Image pour ${title} non trouvée, utilisation de l'image par défaut`);
    }
  },
  async mounted() {
    try {
      await this.fetchFavorites();
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.$root.$emit('show-message', 'Erreur lors du chargement des favoris.', 'danger');
    }
  },
  filters: {
    truncate(text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + (suffix || '...');
      } else {
        return text;
      }
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