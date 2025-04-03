<template>
    <form @submit.prevent="submitForm" class="login-form">
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
          v-focus
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
          autocomplete="current-password"
        >
      </div>
      
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      
      <div class="d-grid gap-2">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Connexion
        </button>
      </div>
    </form>
  </template>
  
  <script>
  export default {
    name: 'LoginForm',
    data() {
      return {
        email: '',
        motDePasse: '',
        loading: false,
        errorMessage: ''
      };
    },
    methods: {
      async submitForm() {
        this.loading = true;
        this.errorMessage = '';
        
        try {
          await this.$store.dispatch('user/login', {
            email: this.email,
            motDePasse: this.motDePasse
          });
          
          this.$emit('login-success');
        } catch (error) {
          console.error('Erreur complète:', error);
          if (error.response) {
            this.errorMessage = error.response.data.message || 'Erreur d\'authentification';
          } else {
            this.errorMessage = 'Erreur de connexion au serveur';
          }
          this.$emit('login-error', this.errorMessage);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>