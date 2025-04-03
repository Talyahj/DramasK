<template>
    <form @submit.prevent="submitForm" class="register-form">
      <div class="mb-3">
        <label for="nom" class="form-label">Nom</label>
        <input 
          type="text" 
          id="nom" 
          class="form-control" 
          v-model="nom" 
          required
          aria-required="true"
          autocomplete="name"
          v-focus
        >
      </div>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input 
          type="email" 
          id="email" 
          class="form-control" 
          v-model="email" 
          required
          aria-required="true"
          autocomplete="email"
        >
      </div>
      
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input 
          type="password" 
          id="password" 
          class="form-control" 
          v-model="motDePasse" 
          required
          aria-required="true"
          autocomplete="new-password"
          aria-describedby="passwordHelp"
        >
        <div id="passwordHelp" class="form-text">
          Le mot de passe doit contenir au moins 8 caractères.
        </div>
      </div>
      
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
        <input 
          type="password" 
          id="confirmPassword" 
          class="form-control" 
          v-model="confirmPassword" 
          required
          aria-required="true"
          autocomplete="new-password"
        >
      </div>
      
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      
      <div class="d-grid gap-2">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading || !formIsValid"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          S'inscrire
        </button>
      </div>
    </form>
  </template>
  
  <script>
  export default {
    name: 'RegisterForm',
    data() {
      return {
        nom: '',
        email: '',
        motDePasse: '',
        confirmPassword: '',
        loading: false,
        errorMessage: ''
      };
    },
    computed: {
      formIsValid() {
        return this.nom.trim() !== '' && 
          this.email.trim() !== '' && 
          this.motDePasse.length >= 8 && 
          this.motDePasse === this.confirmPassword;
      }
    },
    methods: {
      async submitForm() {
        if (!this.formIsValid) {
          this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
          return;
        }
        
        this.loading = true;
        this.errorMessage = '';
        
        try {
          await this.$store.dispatch('user/register', {
            nom: this.nom,
            email: this.email,
            motDePasse: this.motDePasse
          });
          
          this.$emit('register-success');
        } catch (error) {
          console.error('Erreur lors de l\'inscription:', error);
          if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message;
          } else {
            this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
          }
          this.$emit('register-error', this.errorMessage);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>