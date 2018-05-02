// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Login from './Login'
import App from './App'
import VueCookie from 'vue-cookie'
import VueSessionStorage from 'vue-sessionstorage'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from './router.js'


// index.js or main.js
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueSessionStorage);
Vue.use(VueCookie);

import axios from 'axios'
axios.defaults.withCredentials = true;
Vue.config.productionTip = false;




const store = new Vuex.Store({
  state: {
    devices: [],
    orginfo: {}
  },
  actions: {
    setDevices({commit}, devices) {
      commit('SET_DEVICES', devices)
    },
    setOrgInfo({commit}, orginfo) {
      commit('SET_ORGINFO', orginfo)
    }
  },
  mutations: {
    SET_DEVICES(state, devices) {
      state.devices = devices;
    },
    SET_ORGINFO(state, orginfo) {
      state.orginfo = orginfo;
    }
  },
  getters: {
    getDevices(state) {
      return state.devices;
    },
    getIdDevices(state) {
      let result = [];
      console.log(state.devices.length);
      state.devices.forEach(function(device, i, devices) {
          result.push(device.id);
        console.log("push",i,device.id);
      });
      console.log("return",result);
      return result;
    },
    getOrgInfo(state) {
      return state.orginfo;
    }
  },
  modules: {
    // Это приложение слишком маленькое для модулей...
  }
});







/* eslint-disable no-new */
let MainVue = new Vue({
  el: '#app',
  router: routes,
  store,
  data: {
    userIsAuthorized: false,
    Axios: axios,
  },
  created: function () {
    let user = this.$session.get('username'); // Set the username in session Storage
    if(user) this.userIsAuthorized = true;
  },
  components: { Login , App },
  template: `<App :Axios="Axios" v-if="userIsAuthorized"></App>
             <Login :Axios="Axios"  :userIsAuthorized="userIsAuthorized" v-else></Login>`
});
