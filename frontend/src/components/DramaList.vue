<template>
    <div class="drama-list">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="my-5 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des dramas...</p>
      </div>
      
      <div v-else>
        <div v-if="dramas.length === 0" class="alert alert-info">
          {{ emptyMessage }}
        </div>
        
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="drama in filteredDramas" :key="drama.ID_Drama" class="col">
            <drama-card :drama="drama" :show-actors="showActors" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DramaCard from './DramaCard.vue';
  
  export default {
    name: 'DramaList',
    components: {
      DramaCard
    },
    props: {
      dramas: {
        type: Array,
        default: () => []
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      searchTerm: {
        type: String,
        default: ''
      },
      selectedGenre: {
        type: String,
        default: ''
      },
      emptyMessage: {
        type: String,
        default: 'Aucun drama disponible.'
      },
      showActors: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      filteredDramas() {
        if (!this.searchTerm && !this.selectedGenre) {
          return this.dramas;
        }
        
        return this.dramas.filter(drama => {
          // Filtrer par terme de recherche
          const matchesSearch = !this.searchTerm || 
            drama.Titre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
            drama.Acteurs.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
            drama.Synopsis.toLowerCase().includes(this.searchTerm.toLowerCase());
          
          // Filtrer par genre
          const matchesGenre = !this.selectedGenre || drama.Genre === this.selectedGenre;
          
          return matchesSearch && matchesGenre;
        });
      }
    }
  };
  </script>