import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import drama from './modules/drama';
import favorite from './modules/favorite';
import rating from './modules/rating';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    drama,
    favorite,
    rating
  }
});