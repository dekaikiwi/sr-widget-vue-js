import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './app.vue'


Vue.use(VueResource)

var vm = new Vue({
  el: 'body',
  components: { App }
})
