<template>
    <div class="not-found text-center py-5">
      <h1 class="display-1">404</h1>
      <h2 class="mb-4">Page non trouvée</h2>
      <p class="lead mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <router-link to="/" class="btn btn-primary btn-lg">
        Retour à l'accueil
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>