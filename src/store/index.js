import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import devices from './modules/devices'


Vue.use(Vuex);


export default new Vuex.Store({
  state: {},
  getters: {},
  modules: {
    user,
    devices
  },
})
