import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

// Importation des vues
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import DramaDetails from '../views/DramaDetails.vue';
import UserFavorites from '../views/UserFavorites.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import NotFound from '../views/NotFound.vue';

Vue.use(VueRouter);

// Définition des routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      guest: true // Route accessible seulement aux visiteurs non connectés
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      guest: true // Route accessible seulement aux visiteurs non connectés
    }
  },
  {
    path: '/drama/:id',
    name: 'DramaDetails',
    component: DramaDetails,
    props: true
  },
  {
    path: '/favoris',
    name: 'UserFavorites',
    component: UserFavorites,
    meta: { 
      requiresAuth: true // Route accessible seulement aux utilisateurs connectés
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true, // Route accessible seulement aux utilisateurs connectés
      isAdmin: true // Route accessible seulement à l'administrateur
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['user/isLoggedIn'];
  const user = store.getters['user/user'];
  const isAdmin = isLoggedIn && user.id === 1;
  
  // Routes nécessitant une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // Routes nécessitant des droits admin
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (isAdmin) {
          next();
        } else {
          next({ name: 'Home' });
        }
      } else {
        next();
      }
    }
  } 
  // Routes accessibles seulement aux visiteurs non connectés
  else if (to.matched.some(record => record.meta.guest)) {
    if (isLoggedIn) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;