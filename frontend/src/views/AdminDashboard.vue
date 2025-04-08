<template>
  <div class="admin-dashboard">
    <h1 class="mb-4">Administration des dramas</h1>
    
    <!-- Ajouter un nouveau drama -->
    <div class="card mb-4">
      <div class="card-header theme-bg text-white">
        <h2 class="h5 mb-0">Ajouter un nouveau drama</h2>
      </div>
      <div class="card-body">
        <!-- Utiliser le composant DramaForm -->
        <drama-form 
          :loading="addLoading"
          submit-button-text="Ajouter"
          @submit="addDrama"
        />
      </div>
    </div>
    
    <!-- Liste des dramas -->
    <div class="card">
      <div class="card-header theme-dark text-white">
        <h2 class="h5 mb-0">Liste des dramas</h2>
      </div>
      <div class="card-body p-0">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="my-5 text-center">
          <div class="spinner-border theme-color" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p>Chargement des dramas...</p>
        </div>
        
        <div v-else>
          <div v-if="dramas.length === 0" class="alert alert-info m-3">
            Aucun drama disponible.
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Titre</th>
                  <th scope="col">Genre</th>
                  <th scope="col">Année</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drama in dramas" :key="drama.ID_Drama">
                  <td>{{ drama.ID_Drama }}</td>
                  <td>{{ drama.Titre }}</td>
                  <td>{{ drama.Genre }}</td>
                  <td>{{ drama.Annee }}</td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <router-link 
                        :to="{ name: 'DramaDetails', params: { id: drama.ID_Drama }}" 
                        class="btn theme-info-btn"
                        :aria-label="'Voir ' + drama.Titre"
                      >
                        <i class="bi bi-eye"></i> Voir
                      </router-link>
                      <button 
                        class="btn btn-danger"
                        @click="confirmDelete(drama)"
                        :aria-label="'Supprimer ' + drama.Titre"
                      >
                        <i class="bi bi-trash"></i> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
          <div class="modal-body" v-if="dramaToDelete">
            <p>Êtes-vous sûr de vouloir supprimer le drama <strong>{{ dramaToDelete.Titre }}</strong> ?</p>
            <p class="text-danger">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteDrama"
              :disabled="deleteLoading"
            >
              <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Confirmer la suppression
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DramaForm from '@/components/DramaForm.vue';

export default {
  name: 'AdminDashboard',
  components: {
    DramaForm
  },
  data() {
    return {
      dramaToDelete: null,
      deleteModal: null,
      addLoading: false,
      deleteLoading: false
    };
  },
  computed: {
    ...mapGetters({
      dramas: 'drama/allDramas',
      isLoading: 'drama/isLoading'
    })
  },
  methods: {
    ...mapActions({
      fetchDramas: 'drama/fetchDramas',
      addDramaAction: 'drama/addDrama',
      deleteDramaAction: 'drama/deleteDrama'
    }),
    
    async addDrama(dramaData) {
  try {
    this.addLoading = true;
    await this.addDramaAction(dramaData);
    
    // Émettre un événement pour signaler qu'un drama a été ajouté
    this.$root.$emit('drama-added', dramaData);
    
    this.$root.$emit('show-message', 'Drama ajouté avec succès.', 'success');
  } catch (error) {
    console.error('Erreur lors de l\'ajout du drama:', error);
    this.$root.$emit('show-message', 'Erreur lors de l\'ajout du drama.', 'danger');
  } finally {
    this.addLoading = false;
  }
},
    
    confirmDelete(drama) {
      this.dramaToDelete = drama;
      this.deleteModal.show();
    },
    
    async deleteDrama() {
      if (!this.dramaToDelete) return;
      
      try {
        this.deleteLoading = true;
        await this.deleteDramaAction(this.dramaToDelete.ID_Drama);
        this.deleteModal.hide();
        this.$root.$emit('show-message', `${this.dramaToDelete.Titre} a été supprimé avec succès.`, 'success');
        this.dramaToDelete = null;
      } catch (error) {
        console.error('Erreur lors de la suppression du drama:', error);
        this.$root.$emit('show-message', 'Erreur lors de la suppression du drama.', 'danger');
      } finally {
        this.deleteLoading = false;
      }
    }
  },
  async mounted() {
    try {
      await this.fetchDramas();
      
      // Initialiser la modal Bootstrap
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    } catch (error) {
      console.error('Erreur lors du chargement des dramas:', error);
      this.$root.$emit('show-message', 'Erreur lors du chargement des dramas.', 'danger');
    }
  }
};
</script>

<style scoped>
.theme-bg {
  background-color: var(--primary-color) !important;
}

.theme-dark {
  background-color: var(--dark-color) !important;
}

.theme-color {
  color: var(--primary-color) !important;
}

.theme-info-btn {
  background-color: var(--secondary-color) !important;
  border-color: var(--secondary-color) !important;
  color: white !important;
}

.theme-info-btn:hover {
  background-color: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
}
</style>