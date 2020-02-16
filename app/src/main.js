import Vue from 'vue'
import router from './router';
import vuetify from './plugins/vuetify';
import App from './App.vue'

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router: router,
  render: h => h(App)
}).$mount('#app');
