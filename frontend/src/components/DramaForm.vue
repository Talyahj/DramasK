<template>
    <form @submit.prevent="submitForm" class="drama-form">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="titre" class="form-label">Titre</label>
          <input 
            type="text" 
            id="titre" 
            class="form-control" 
            v-model="formData.titre" 
            required
            aria-required="true"
          >
        </div>
        
        <div class="col-md-3 mb-3">
          <label for="genre" class="form-label">Genre</label>
          <input 
            type="text" 
            id="genre" 
            class="form-control" 
            v-model="formData.genre" 
            required
            aria-required="true"
            list="genreList"
          >
          <datalist id="genreList">
            <option v-for="genre in availableGenres" :key="genre" :value="genre"></option>
          </datalist>
        </div>
        
        <div class="col-md-3 mb-3">
          <label for="annee" class="form-label">Année</label>
          <input 
            type="number" 
            id="annee" 
            class="form-control" 
            v-model="formData.annee" 
            required
            min="1900" 
            max="2100"
            aria-required="true"
          >
        </div>
      </div>
      
      <div class="mb-3">
        <label for="acteurs" class="form-label">Acteurs</label>
        <input 
          type="text" 
          id="acteurs" 
          class="form-control" 
          v-model="formData.acteurs" 
          required
          aria-required="true"
          placeholder="Ex: Acteur 1, Acteur 2"
        >
      </div>
      
      <div class="mb-3">
        <label for="synopsis" class="form-label">Synopsis</label>
        <textarea 
          id="synopsis" 
          class="form-control" 
          v-model="formData.synopsis" 
          rows="4" 
          required
          aria-required="true"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ submitButtonText }}
      </button>
      
      <button 
        v-if="showCancelButton" 
        type="button" 
        class="btn btn-secondary ms-2"
        @click="cancel"
      >
        Annuler
      </button>
    </form>
  </template>
  
  <script>
  export default {
    name: 'DramaForm',
    props: {
      initialData: {
        type: Object,
        default: () => ({
          titre: '',
          genre: '',
          annee: new Date().getFullYear(),
          acteurs: '',
          synopsis: ''
        })
      },
      submitButtonText: {
        type: String,
        default: 'Ajouter'
      },
      showCancelButton: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formData: { ...this.initialData }
      };
    },
    computed: {
      availableGenres() {
        const allDramas = this.$store.getters['drama/allDramas'];
        return [...new Set(allDramas.map(drama => drama.Genre))].sort();
      }
    },
    watch: {
      initialData(newVal) {
        this.formData = { ...newVal };
      }
    },
    methods: {
      submitForm() {
        this.$emit('submit', { ...this.formData });
      },
      cancel() {
        this.$emit('cancel');
      }
    }
  };
  </script>