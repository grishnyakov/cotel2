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

import moment from 'moment'
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).utc(5).format('HH:mm:ss   (DD.MM.YYYY)')
  }
});

axios.defaults.withCredentials = true;
Vue.config.productionTip = false;

let USERNAME;
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
    getDevices(state) {  //получить таблицу девайсов

        return new Promise((resolve, reject) => {
          if (state.devices.length > 0)  //если они уже получены, то выдаём то что есть
            resolve(state.devices);
          else { //иначе запрашиваем новый список двайсов

              let uri = 'http://89.31.33.164:7877/data/devices';
              axios.post(uri, {
                username: USERNAME
              })
                .then(response => {
                  console.log(response);
                  if (response.data.success) {
                    state.devices = response.data.devices;
                    resolve(response.data.devices);
                  }
                })
                .catch(function (error) {
                  console.error(error);
                  reject(error);
                })
            }
          });
    },
    getIdDevices(state){
      return new Promise((resolve, reject) => {
        store.getters.getDevices.then(
          result => {
            let arr_ids = [];
            console.log("state.devices.length",result.length);
            result.forEach(function (device, i, result) {
              arr_ids.push(device.id);
              console.log("push", i, device.id);
            });
            console.log("arr_ids", arr_ids);
            resolve(arr_ids);
          },
          error => {
            console.log("err", error );
            reject(error);
          });
      });

      },
    getOrgInfo(state) {
      if (state.orginfo.length > 0)
        return state.orginfo;
      else {

        let uri = 'http://89.31.33.164:7877/user/orginfo';
        axios.post(uri, {
          username: USERNAME
        })
          .then(response => {
            console.log(response);
            if (response.data.success) {
              state.orginfo = response.data.data;
              return response.data.data;
            }
          })
          .catch(function (error) {
            console.error(error);
            return [];
          });
      }

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
    USERNAME = this.$session.get('username'); // Set the username in session Storage
    if (USERNAME != "" && USERNAME) this.userIsAuthorized = true;
  },
  components: {Login, App},
  template: `<App :Axios="Axios" v-if="userIsAuthorized"></App>
             <Login :Axios="Axios"  :userIsAuthorized="userIsAuthorized" v-else></Login>`
});
