// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Login from './Login'
import App from './App'
import VueCookie from 'vue-cookie'
import VueSessionStorage from 'vue-sessionstorage'

import VueRouter from 'vue-router'
import routes from './router.js'
import store from './store'

const CONF = require('../config/index');


import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueSessionStorage);
Vue.use(VueCookie);


import moment from 'moment'
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).utc(5).format('HH:mm:ss   (DD.MM.YYYY)')
  }
});
Vue.config.productionTip = false;


let MainVue = new Vue({
  el: '#app',
  router: routes,
  store,
  created: function () {
    console.log("urlServer:",CONF.dev.urlServer);
  },
  components: {Login, App},
  template: `<App  v-if="$store.state.user.userAuthorized"></App>
             <Login v-else></Login>`
});
