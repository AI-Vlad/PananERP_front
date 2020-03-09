import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

// Global mixins
import axiosErrorHandler from './mixins/axios-error-handler';
import numberFormater from './mixins/number-formatter';
Vue.mixin(axiosErrorHandler);
Vue.mixin(numberFormater);

// Global plugins
Vue.use(require('./plugins'));

// Global components
require('./components/globals');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  beforeCreate() { store.commit('initialize') },
  render: h => h(App)
}).$mount('#app');