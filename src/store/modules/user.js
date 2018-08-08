/*
  This file contains user info
  Methods registration, authorization user
 */
import request from '../../api/request'


// initial state
const state = {
  USER: {
    login: '', //
    name1: '', //Ivanov
    name2: '', //Ivan
    name3: '', //Ivanovich
    hash: '',
    id: 0
  },
  userAuthorized: false,
  ORG_INFO: {}
};


const actions = {
  LogIN({commit, rootState}, User) {
    if (User.login && User.password)
      return request.getDataFromServer('/login', User)
        .then((result) => {
          if (result.success) {
            console.log("login: SUCCESS!", result);
            commit('SetUserInfo', {login: result.login});
            this.$emit('login', true);
          }
          else {
            console.log("login: FAILED!", result);
          }
        })
        .catch((er) => {

        });
  },
  LogOUT({commit}) {
    request.getDataFromServer('/logout', {})
      .then((data) => {
        if (data.success) {
          console.log("logout: SUCCESS!", data);
          commit('DropAuthorization');
          this.$emit('login', false);
        }
        else {
          console.log("logout: FAILED!", data);
        }
      })
      .catch((er) => {

      });
  },
  RegUser({commit}, User) {
    return new Promise((resolve, reject) => {
      let params = {
        id_org: User.id_org,
        login: User.login,
        id_role: User.id_role,
        password: User.password,
        name1: User.name1,
        name2: User.name2,
        name3: User.name3,
        number_tel: User.number_tel
      };
      request.getDataFromServer('/reguser', params)
        .then((data) => {
          if (data.success) {
            console.log("reguser: SECCESSFUL!");
          }
          else {
            console.log("reguser: FAILED!");
          }
          resolve(data.success);
        })
        .catch((er) => {
          reject(er);
        });
    })
  },      //new user

  RequestOrgInfo({commit}, User) {
    return new Promise((resolve, reject) => {
      request.getDataFromServer('/user/orginfo', {login: User.login})
        .then((data) => {
          if (data.success) {
            console.log("RequestOrgInfo: SECCESSFUL!", data);
            commit("SetOrgInfo", data.orginfo);
          }
          else {
            console.error("RequestOrgInfo: FAILED!", data);
          }
          resolve(data.success);
        })
        .catch((er) => {
          reject(er);
        });
    })
  }, //not yet finished
};

const getters = {
  UserInfo(state, getters, rootState) {
    return state.USER;
  },
  AuthState(state, getters, rootState) {
    return state.userAuthorized;
  },
};

const mutations = {
  SetUserInfo(state, userInfo) {
    state.USER = userInfo;
    state.userAuthorized = true;
  },
  DropAuthorization(state) {
    state.userAuthorized = false;
  },
  SetOrgInfo(state, orgInfo) {
    state.ORG_INFO = orgInfo;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
