<template>
    <div class="card h-100">
      <!-- Image avec texte alternatif pour accessibilité -->
      <img 
        :src="`/img/${formatImageName(drama.Titre)}.jpg`" 
        class="card-img-top" 
        :alt="'Image du drama ' + drama.Titre"
        @error="handleImageError($event, drama.Titre)"
      >
      
      <div class="card-body">
        <h5 class="card-title">{{ drama.Titre }}</h5>
        <p class="card-text">
          <span class="badge bg-primary me-2">{{ drama.Genre }}</span>
          <small class="text-muted">{{ drama.Annee }}</small>
        </p>
        <p class="card-text">{{ drama.Synopsis | truncate(100) }}</p>
        <p class="card-text" v-if="showActors">
          <small class="text-muted">Acteurs: {{ drama.Acteurs | truncate(50) }}</small>
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
        
        <div v-if="averageRating > 0" class="text-warning">
          {{ averageRating.toFixed(1) }} {{ averageRating | stars }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { formatImageName, handleImageError } from '@/utils/image';
  
  export default {
    name: 'DramaCard',
    props: {
      drama: {
        type: Object,
        required: true
      },
      showActors: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      averageRating() {
        return this.$store.getters['rating/getAverageRating'](this.drama.ID_Drama) || 0;
      }
    },
    methods: {
      formatImageName,
      handleImageError
    }
  };
  </script>
  
  <style scoped>
  .card-img-top {
    width: 100%;
    height: auto;
    max-height: 350px;
    object-fit: scale-down;
  }
  </style>