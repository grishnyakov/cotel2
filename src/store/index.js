import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import devices from './modules/devices'


Vue.use(Vuex);


export default new Vuex.Store({
  state: {},
  actions:{
    ResetStates({commit,state}) {
      Object.keys(state).forEach((key) => {
        commit('ResetState',state[key]);
      });

    }
  },
  getters: {},
  modules: {
    user: user,
    devices: devices
  },
  mutations:{
    ResetState(state, childState) {
      let initialState = childState.__proto__.initialState;
      for (let f in childState) {
        if (typeof childState[f] === "object" && !Array.isArray(childState[f])) {
          childState[f] = Object.assign({}, initialState[f])
        }
        else {
          childState[f] = initialState[f];
        }
      }
    }
  }
})
