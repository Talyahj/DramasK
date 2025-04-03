<template>
    <div class="drama-details">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="my-5 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des détails...</p>
      </div>
      
      <div v-else-if="drama">
        <div class="row">
          <div class="col-md-4 mb-4">
            <!-- Image avec texte alternatif pour accessibilité -->
            <img 
  :src="`/img/${formatImageName(drama.Titre)}.jpg`" 
  class="img-fluid" 
              :alt="'Affiche du drama ' + drama.Titre"
            >
          </div>
          
          <div class="col-md-8">
            <h1 class="mb-3">{{ drama.Titre }}</h1>
            
            <div class="d-flex align-items-center mb-3">
              <span class="badge bg-primary me-2">{{ drama.Genre }}</span>
              <span class="me-3">{{ drama.Annee }}</span>
              <div v-if="averageRating > 0" class="text-warning">
                {{ typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0' }} {{ averageRating | stars }}
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="mb-4">
              <button 
                v-if="isLoggedIn && !isAdmin" 
                class="btn me-2" 
                :class="isFavorite ? 'btn-danger' : 'btn-outline-warning'"
                @click="toggleFavorite"
                :disabled="favoriteLoading"
                :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              >
                <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
                {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
              </button>
              
              <button 
                v-if="isAdmin" 
                class="btn btn-danger me-2" 
                @click="confirmDelete"
                aria-label="Supprimer ce drama"
              >
                <i class="bi bi-trash"></i> Supprimer
              </button>
              
              <button 
                v-if="isAdmin" 
                class="btn btn-primary" 
                @click="editDrama"
                aria-label="Modifier ce drama"
              >
                <i class="bi bi-pencil"></i> Modifier
              </button>
            </div>
            
            <h2>Synopsis</h2>
            <p>{{ drama.Synopsis }}</p>
            
            <h2>Acteurs</h2>
            <p>{{ drama.Acteurs }}</p>
            
            <!-- Rating section for logged in users -->
            <div v-if="isLoggedIn && !isAdmin" class="mt-4">
              <h2>Votre note</h2>
              <div class="mb-3">
                <div class="rating">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    :class="['star', { 'active': n <= userRating }]"
                    @click="rateDrama(n)"
                    tabindex="0"
                    :aria-label="`Noter ${n} étoile${n > 1 ? 's' : ''}`"
                    @keydown.enter="rateDrama(n)"
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
            
            <!-- All ratings section -->
            <div class="mt-4">
              <h2>Avis des utilisateurs</h2>
              <div v-if="ratings.length === 0" class="alert alert-info">
                Aucun avis pour le moment. Soyez le premier à noter ce drama !
              </div>
              <div v-else class="list-group">
                <div v-for="rating in ratings" :key="rating.ID_Avis" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ rating.Nom }}</strong>
                      <div class="text-warning">{{ rating.Note | stars }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="alert alert-warning">
        Drama non trouvé.
        <router-link to="/" class="alert-link">Retour à l'accueil</router-link>
      </div>
      
      <!-- Edit Drama Modal (Admin Only) -->
      <div v-if="isAdmin && drama" class="modal fade" id="editDramaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modifier le drama</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateDrama">
                <div class="mb-3">
                  <label for="titre" class="form-label">Titre</label>
                  <input type="text" class="form-control" id="titre" v-model="editForm.titre" required>
                </div>
                <div class="mb-3">
                  <label for="genre" class="form-label">Genre</label>
                  <input type="text" class="form-control" id="genre" v-model="editForm.genre" required>
                </div>
                <div class="mb-3">
                  <label for="annee" class="form-label">Année</label>
                  <input type="number" class="form-control" id="annee" v-model="editForm.annee" required min="1900" max="2100">
                </div>
                <div class="mb-3">
                  <label for="acteurs" class="form-label">Acteurs</label>
                  <input type="text" class="form-control" id="acteurs" v-model="editForm.acteurs" required>
                </div>
                <div class="mb-3">
                  <label for="synopsis" class="form-label">Synopsis</label>
                  <textarea class="form-control" id="synopsis" v-model="editForm.synopsis" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmation de suppression</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer ce drama ? Cette action est irréversible.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="button" class="btn btn-danger" @click="deleteDrama">Confirmer la suppression</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { mapGetters, mapActions } from 'vuex';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  name: 'DramaDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isFavorite: false,
      favoriteData: null,
      favoriteLoading: false,
      userRating: 0,
      editForm: {
        titre: '',
        genre: '',
        annee: '',
        acteurs: '',
        synopsis: ''
      },
      editModal: null,
      deleteModal: null
    };
  },
  computed: {
    ...mapGetters({
      drama: 'drama/currentDrama',
      isLoading: 'drama/isLoading',
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    }),
    
    isAdmin() {
      return this.isLoggedIn && this.user.id === 1;
    },
    
    ratings() {
      return this.$store.getters['rating/getRatingsForDrama'](this.id);
    },
    
    averageRating() {
      return this.$store.getters['rating/getAverageRating'](this.id);
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
      fetchDrama: 'drama/fetchDrama',
      updateDramaAction: 'drama/updateDrama',
      deleteDramaAction: 'drama/deleteDrama'
    }),
    
    async checkFavoriteStatus() {
      if (!this.isLoggedIn || this.isAdmin) return;
      
      try {
        this.favoriteLoading = true;
        const response = await this.$store.dispatch('favorite/checkFavorite', this.id);
        this.isFavorite = response.isFavorite;
        this.favoriteData = response.favoris;
      } catch (error) {
        console.error('Erreur lors de la vérification des favoris:', error);
      } finally {
        this.favoriteLoading = false;
      }
    },
    
    async toggleFavorite() {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      
      try {
        this.favoriteLoading = true;
        
        if (this.isFavorite) {
          await this.$store.dispatch('favorite/removeFromFavorites', this.favoriteData.ID_Favoris);
          this.isFavorite = false;
          this.favoriteData = null;
          this.$root.$emit('show-message', 'Drama retiré des favoris.', 'success');
        } else {
          const response = await this.$store.dispatch('favorite/addToFavorites', this.id);
          await this.checkFavoriteStatus();
          this.$root.$emit('show-message', 'Drama ajouté aux favoris.', 'success');
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        this.$root.$emit('show-message', 'Erreur lors de la modification des favoris.', 'danger');
      } finally {
        this.favoriteLoading = false;
      }
    },
    
    async rateDrama(rating) {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      
      try {
        await this.$store.dispatch('rating/rateDrama', { idDrama: this.id, note: rating });
        this.userRating = rating;
        this.$root.$emit('show-message', 'Votre note a été enregistrée.', 'success');
      } catch (error) {
        console.error('Erreur lors de la notation:', error);
        this.$root.$emit('show-message', 'Erreur lors de l\'enregistrement de votre note.', 'danger');
      }
    },
    
    editDrama() {
      if (!this.isAdmin) return;
      
      // Remplir le formulaire avec les données actuelles
      this.editForm = {
        titre: this.drama.Titre,
        genre: this.drama.Genre,
        annee: this.drama.Annee,
        acteurs: this.drama.Acteurs,
        synopsis: this.drama.Synopsis
      };
      
      // Afficher la modal
      this.editModal.show();
    },
    
    async updateDrama() {
      try {
        await this.updateDramaAction({
          id: this.id,
          dramaData: {
            titre: this.editForm.titre,
            synopsis: this.editForm.synopsis,
            genre: this.editForm.genre,
            acteurs: this.editForm.acteurs,
            annee: this.editForm.annee
          }
        });
        
        // Fermer la modal
        this.editModal.hide();
        this.$root.$emit('show-message', 'Drama mis à jour avec succès.', 'success');
        
        // Recharger les données
        this.fetchDrama(this.id);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du drama:', error);
        this.$root.$emit('show-message', 'Erreur lors de la mise à jour du drama.', 'danger');
      }
    },
    
    confirmDelete() {
      if (!this.isAdmin) return;
      this.deleteModal.show();
    },
    
    async deleteDrama() {
      try {
        await this.deleteDramaAction(this.id);
        this.deleteModal.hide();
        this.$root.$emit('show-message', 'Drama supprimé avec succès.', 'success');
        this.$router.push('/');
      } catch (error) {
        console.error('Erreur lors de la suppression du drama:', error);
        this.$root.$emit('show-message', 'Erreur lors de la suppression du drama.', 'danger');
      }
    },
    
    async loadRatings() {
      try {
        await this.$store.dispatch('rating/fetchRatings', this.id);
        await this.$store.dispatch('rating/fetchAverageRating', this.id);
        
        // Vérifier si l'utilisateur a déjà noté ce drama
        if (this.isLoggedIn) {
          const userRating = this.ratings.find(rating => rating.ID_Utilisateur === this.user.id);
          if (userRating) {
            this.userRating = userRating.Note;
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
      }
    }
  },
  async mounted() {
    try {
      // Charger le drama
      await this.fetchDrama(this.id);
      
      if (!this.drama) return;
      
      // Vérifier le statut favori
      await this.checkFavoriteStatus();
      
      // Charger les avis
      await this.loadRatings();
      
      // Initialiser les modals Bootstrap
      this.$nextTick(() => {
        if (document.getElementById('editDramaModal')) {
          this.editModal = new bootstrap.Modal(document.getElementById('editDramaModal'));
        }
        if (document.getElementById('deleteModal')) {
          this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement du drama:', error);
      this.$root.$emit('show-message', 'Erreur lors du chargement du drama.', 'danger');
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
  <style scoped>
  .img-fluid {
  width: 100%;
  height: auto;  /* Hauteur automatique */
  max-height: 600px;  /* Optionnel : limite maximale */
  object-fit: scale-down;  /* Centrer l'image */
  }
  </style>