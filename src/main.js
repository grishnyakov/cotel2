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
      return new Promise((resolve, reject)=>{
        axios.post('http://'+CONF.dev.host+':7877/login', {
          username: U.L,
          password: U.P
        })
          .then(response => {
            if(response.data.success === true)
              commit('SET_USER_NAME',response.data.username);
            resolve(response.data.success);
          })
          .catch(function (error) {
            console.error(error);
            resolve(false);
          });
      });
    },
    LogOUT({commit}){
      axios.post('http://'+CONF.dev.host+':7877/logout',{
        withCredentials: true,
      })
        .then(response => {
          if(response.data.success)
            commit('DEL_USER_NAME');
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    RegU ({commit},U) {
      return new Promise((resolve, reject)=>{
        axios.post('http://'+CONF.dev.host+':7877/reguser', {
          id_org: U.id_org,
          login: U.login,
          id_role: U.id_role,
          password: U.password,
          name1: U.name1,
          name2: U.name2,
          name3: U.name3,
          number_tel: U.number_tel
        })
          .then(response => {
            if(response.data.success === true)
              console.log("USER CREATED SECCESSFUL!");
            else console.log("USER CREATED FAILED!");
            resolve(response.data.success);
          })
          .catch(function (error) {
            console.error(error);
            resolve(false);
          });
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
      state.USER.username = username;
      sessionStorage.setItem('username', username); // Set the username in session Storage
    },
    DEL_USER_NAME(state) {
      sessionStorage.removeItem('username');
      state.USER.username = "";
    },
    SET_DEVICE_LIST(state, devices) {
      state.DEVICE_LIST = devices;
    },
    SET_ORG_INFO(state, info) {
      state.ORG_INFO = info;
    },
    SET_DANGER_LIST(state, dang_list) {
      state.DANGER_LIST = dang_list;
      console.log("COMMIT: SET_DANGER_LIST", dang_list);
    },
    SET_MESSAGE_LIST(state, m_list) {
      state.MESSAGE_LIST = m_list;
      console.log("COMMIT: SET_MESSAGE_LIST", m_list);
    }
  },
  getters: {
    //USER
    getUserName(state){
      return state.USER.username;
    },


    //ORGINFO
    GET_ORG_INFO(state, getters) {
        axios.post('http://'+CONF.dev.host+':7877/user/orginfo', {
          username: sessionStorage.getItem("username")
        })
          .then(response => {
            if (response.data.success) {
             // state.ORG_INFO = response.data.data;
              store.commit('SET_ORG_INFO',response.data.data);
            }
          })
          .catch(function (error) {
            console.error(error);
            return [];
          });
    },

    //DEVICES
    GET_DEVICE_LIST(state) {  //получить таблицу девайсов
        return new Promise((resolve, reject) => {
          if (state.DEVICE_LIST.length > 0)  //если они уже получены, то выдаём то что есть
            resolve(state.DEVICE_LIST);
          else { //иначе запрашиваем новый список двайсов
              axios.post('http://'+CONF.dev.host+':7877/data/devices', {
                username: state.USER.username
              })
                .then(response => {
                  console.log("Получены GET_DEVICE_LIST");
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
            console.log("Получены GET_ID_DEVICE_LIST");
            let arr_ids = [];
            result.forEach(function (device, i, result) {
              arr_ids.push(device.id);
            });
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
          arr_id_devices => {
            axios.post('http://'+CONF.dev.host+':7877/data/dangerlist',{
              devices: arr_id_devices
            })
              .then(response => {
                console.log("Получены GET_DANGER_LIST");
                if(response.data.success) {
                  store.commit('SET_DANGER_LIST',response.data.danger_list);
                }
                resolve(response.data.danger_list);
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
    GET_MESSAGE_LIST: state => idDevice => {
      console.log("i try get groups of messages");
      return new Promise((resolve, reject) => {
        axios.post('http://'+CONF.dev.host+':7877/data/messages', {
          params: [idDevice],
          type_query: "messages"
        })
          .then(response => {
            if (response.data.success && response.data.result ) {
              let messages = [];

              for(let key in response.data.result){
                if(response.data.result.hasOwnProperty(key)){
                  messages.push(response.data.result[key]);
                }
              }

              store.commit('SET_MESSAGE_LIST',messages);
              resolve(messages);
            }
            else{
              resolve(false);
            }
          })
          .catch(function (error) {
            console.error(error);
            reject(false);
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
      flag_auth: !!store.state.USER.username
  },
  created: function () {
    console.log("host:",CONF.dev.host);
    console.log("Пользователь авторизован:",this.flag_auth,this.$store.getters.getUserName );
  },
  components: {Login, App},
  template: `<App  v-if="flag_auth"></App>
             <Login v-else></Login>`
});
