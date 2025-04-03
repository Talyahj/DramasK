<template>
    <div class="login">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Connexion</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
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
              
              <div class="mt-3 text-center">
                <p>Pas encore de compte ? <router-link to="/register">Inscrivez-vous</router-link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
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
          
          this.$root.$emit('show-message', 'Connexion réussie !', 'success');
          
          // Rediriger vers la page demandée ou la page d'accueil
          const redirectPath = this.$route.query.redirect || '/';
          this.$router.push(redirectPath);
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message;
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
          }
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>