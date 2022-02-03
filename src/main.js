import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// I M P O R T   B O O T S T R A P - V U E   A N D   B O O T S T R A P
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//IMPORT M

// U S I N G   B O O T S T R A P - V U E
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
