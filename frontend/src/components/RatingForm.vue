<template>
    <div class="rating-form">
      <h2>{{ title }}</h2>
      
      <div class="rating">
        <span 
          v-for="n in 5" 
          :key="n" 
          :class="['star', { 'active': n <= currentRating }]"
          @click="selectRating(n)"
          tabindex="0"
          :aria-label="`Noter ${n} étoile${n > 1 ? 's' : ''}`"
          @keydown.enter="selectRating(n)"
        >
          ★
        </span>
      </div>
      
      <div v-if="showSubmitButton" class="mt-3">
        <button 
          @click="submitRating" 
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Envoyer
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RatingForm',
    props: {
      dramaId: {
        type: [Number, String],
        required: true
      },
      initialRating: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: 'Votre note'
      },
      showSubmitButton: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentRating: this.initialRating,
        loading: false
      };
    },
    watch: {
      initialRating(newVal) {
        this.currentRating = newVal;
      }
    },
    methods: {
      selectRating(rating) {
        this.currentRating = rating;
        this.$emit('rating-selected', rating);
        
        if (!this.showSubmitButton) {
          this.submitRating();
        }
      },
      
      async submitRating() {
        if (this.currentRating === 0) {
          return;
        }
        
        try {
          this.loading = true;
          await this.$store.dispatch('rating/rateDrama', {
            idDrama: this.dramaId,
            note: this.currentRating
          });
          
          this.$emit('rating-submitted', this.currentRating);
          this.$root.$emit('show-message', 'Votre note a été enregistrée.', 'success');
        } catch (error) {
          console.error('Erreur lors de la notation:', error);
          this.$root.$emit('show-message', 'Erreur lors de l\'enregistrement de votre note.', 'danger');
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .rating {
    display: flex;
    font-size: 2rem;
    cursor: pointer;
  }
  
  .star {
    color: #ccc;
    transition: color 0.2s;
    padding: 0 5px;
  }
  
  .star:hover,
  .star.active {
    color: #ffc107;
  }
  
  .star:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.5);
    border-radius: 4px;
  }
  </style>