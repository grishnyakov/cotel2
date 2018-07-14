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

const CONF = require('../config/index');

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

const store = new Vuex.Store({
  state: {
    USER: {
      username: sessionStorage.getItem('username')
    },
    ORG_INFO: {},

    
    DEVICE_LIST: [],
    MESSAGE_LIST: [],
    DANGER_LIST: [],
  },
  actions: {
    LogIN ({commit},U) {
      axios.post('http://'+CONF.dev.host+':7877/login', {
        username: U.L,
        password: U.P
      })
        .then(response => {
          console.log(response);
          if(response.data.success === true)
            commit('SET_USER_NAME',response.data.username);
        })
        .catch(function (error) {
          console.error(error);

        });
    },
    LogOUT({commit}){
      axios.post('http://'+CONF.dev.host+':7877/logout',{
        withCredentials: true,
      })
        .then(response => {
          console.log(response);
          if(response.data.success)
            commit('DEL_USER_NAME');
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    BindDeviceToUser({state},D){
      return new Promise((resolve, reject) => {
          axios.post('http://'+CONF.dev.host+':7877/data/devices/bind', {
            username: state.USER.username,
            number: D.N,
            pin:D.P,
      })
            .then(response => {
              resolve(response.data.success);
            })
            .catch(function (error) {
              console.error(error);
              reject(error);
            })
      });
    }
  },
  mutations: {
    SET_USER_NAME(state, username) {
      sessionStorage.setItem('username', username); // Set the username in session Storage
    },
    DEL_USER_NAME(state) {
      sessionStorage.removeItem('username');
      state.USER.username = "";
    },
    SET_DEVICE_LIST(state, devices) {
      state.DEVICE_LIST = devices;
    },
    SET_ORG_INFO(state, orginfo) {
      state.ORG_INFO = orginfo;
    },
    SET_DANGER_LIST(state, dang_list) {
      state.DANGER_LIST = dang_list;
    },
    SET_MESSAGE_LIST(state, m_list) {
      state.DANGER_LIST = m_list;
    }
  },
  getters: {
    //USER
    getUserName(state){
      return state.USER.username;
    },


    //ORGINFO
    GET_ORG_INFO(state, getters) {
      if (state.ORG_INFO.length > 0)
        return state.ORG_INFO;
      else {

        let uri = 'http://'+CONF.dev.host+':7877/user/orginfo';
        axios.post(uri, {
          username: getters.getUserName
        })
          .then(response => {
            console.log(response);
            if (response.data.success) {
             // state.ORG_INFO = response.data.data;
              store.commit('SET_ORG_INFO',response.data.data);
            }
          })
          .catch(function (error) {
            console.error(error);
            return [];
          });
      }
    },

    //DEVICES
    GET_DEVICE_LIST(state) {  //получить таблицу девайсов
        return new Promise((resolve, reject) => {
          if (state.DEVICE_LIST.length > 0)  //если они уже получены, то выдаём то что есть
            resolve(state.DEVICE_LIST);
          else { //иначе запрашиваем новый список двайсов

              let uri = 'http://'+CONF.dev.host+':7877/data/devices';
              axios.post(uri, {
                username: state.USER.username
              })
                .then(response => {
                  console.log(response);
                  if (response.data.success) {
                    state.DEVICE_LIST = response.data.devices;
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
    GET_ID_DEVICE_LIST(state){
      return new Promise((resolve, reject) => {
        store.getters.GET_DEVICE_LIST.then(
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
    GET_DANGER_LIST(state, getters){
      return new Promise((resolve, reject) => {
        getters.GET_ID_DEVICE_LIST.then(
          result => {
            axios.post('http://'+CONF.dev.host+':7877/data/dangerlist',{
              devices: result
            })
              .then(response => {
                console.log(response);
                if(response.data.success) {
                  store.commit('SET_DANGER_LIST',response.data.danger_list);
                }
                resolve(response.data.success);
              })
              .catch(function (error) {
                console.error(error);
                reject(error);
              });
          },
          error => {
            console.log("err", error);
          });
      });
    },
    GET_MESSAGE_LIST(state,idDevice){
      console.log("i try get groups of messages");
      return new Promise((resolve, reject) => {
        axios.post('http://'+CONF.dev.host+':7877/data/messages', {
          params: [idDevice],
          type_query: "messages"
        })
          .then(response => {
            console.log("response",response);
            if (response.data.success) {
              console.log(response.data.result);
              store.commit('SET_MESSAGE_LIST',response.data.result);
            }
            resolve(response.data.success);
          })
          .catch(function (error) {
            console.error(error);
            reject(error);
          });
      });
    },

  },
  modules: {
    // Это приложение слишком маленькое для модулей...

  }
});


let MainVue = new Vue({
  el: '#app',
  router: routes,
  store,
  data: {

  },
  created: function () {
    console.log("host:",CONF.dev.host);
    console.log("Пользователь авторизован:",this.$store.getters.getUserName );
  },
  components: {Login, App},
  template: `<App  v-if="this.$store.getters.getUserName"></App>
             <Login v-else></Login>`
});
