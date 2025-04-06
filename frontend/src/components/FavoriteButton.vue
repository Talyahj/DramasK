<template>
    <button 
      class="btn" 
      :class="isFavorite ? 'btn-danger' : 'btn-outline-warning'"
      @click="toggleFavorite"
      :disabled="loading"
      :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    >
      <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
      <span v-if="loading" class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>
      <span v-else>{{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}</span>
    </button>
  </template>
  
  <script>
  export default {
    name: 'FavoriteButton',
    props: {
      dramaId: {
        type: [Number, String],
        required: true
      },
      initialIsFavorite: {
        type: Boolean,
        default: false
      },
      favoriteData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        isFavorite: this.initialIsFavorite,
        internalFavoriteData: this.favoriteData,
        loading: false
      };
    },
    watch: {
      initialIsFavorite(newVal) {
        this.isFavorite = newVal;
      },
      favoriteData(newVal) {
        this.internalFavoriteData = newVal;
      }
    },
    methods: {
      async toggleFavorite() {
        if (!this.$store.getters['user/isLoggedIn']) {
          this.$router.push('/login');
          return;
        }
        
        try {
          this.loading = true;
          
          if (this.isFavorite) {
            await this.$store.dispatch(
              'favorite/removeFromFavorites', 
              this.internalFavoriteData.ID_Favoris
            );
            this.isFavorite = false;
            this.internalFavoriteData = null;
            this.$emit('favorite-removed');
            this.$root.$emit('show-message', 'Drama retiré des favoris.', 'success');
          } else {
            const response = await this.$store.dispatch(
              'favorite/addToFavorites', 
              this.dramaId
            );
            // Vérifier le nouveau statut
            const checkResponse = await this.$store.dispatch(
              'favorite/checkFavorite', 
              this.dramaId
            );
            this.isFavorite = checkResponse.isFavorite;
            this.internalFavoriteData = checkResponse.favoris;
            this.$emit('favorite-added', checkResponse.favoris);
            this.$root.$emit('show-message', 'Drama ajouté aux favoris.', 'success');
          }
        } catch (error) {
          console.error('Erreur lors de la modification des favoris:', error);
          this.$root.$emit('show-message', 'Erreur lors de la modification des favoris.', 'danger');
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>