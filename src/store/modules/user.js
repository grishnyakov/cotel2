'use strict'
/*
  This file contains user info
  Methods registration, authorization user
 */
import request from '../../api/request'


let initialState = {
  USER: {
    login: '', //
    name1: '', //Ivanov
    name2: '', //Ivan
    name3: '', //Ivanovich
    hash: '',
    id: 0,
    email: "",
  },
  userAuthorized: false,
  ORG_INFO: {},
  __proto__: {}
};

const state = Object.assign({}, initialState);
state.__proto__ = {initialState: initialState};

const actions = {
  LogIN({commit, rootState}, User) {
    return new Promise((resolve, reject) => {
      if (User.login && User.password)
        request.getDataFromServer('/login', User)
          .then((result) => {
            if (result.success) {
              if (result.login)
                commit('SetUserInfo', {login: User.login});
              resolve(result.status);
            }
            else reject(result);
          })
          .catch((er) => {
            reject(er);
          });
    });
  },
  LogOUT({commit}) {
    return new Promise((resolve, reject) => {
      request.getDataFromServer('/logout', {})
        .then((data) => {
          if (data.success) resolve(data.success);
          else reject(data);
        })
        .catch((er) => {
          reject(er);
        });
    });
  },
  GetSession({commit}, params) { //получить текущую сессию и авторизовать пользователя
    request.getDataFromServer('/user/getSession', params)
      .then((result) => {
        if (result.success && result.login) commit('SetUserInfo', {login: result.login});
      })
      .catch(error => {
        console.error(error);
      })
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
        number_tel: User.number_tel,
        email: User.email,
      };
      request.getDataFromServer('/reguser', params)
        .then((data) => {
          if (data.success) resolve(data.success);
          else reject(data);
        })
        .catch((er) => {
          reject(er);
        });
    })
  },
  ValidateEmail({commit}, User) {
    return new Promise((resolve, reject) => {
      let params = {
        query: User.query,
        login: User.login,
        code: User.code,
      };
      request.getDataFromServer('/user/validateEmail', params)
        .then((data) => {
          if (data.success) resolve(data.success);
          else reject(data);
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
};

const mutations = {
  SetUserInfo(state, userInfo) {
    state.USER = userInfo;
    state.userAuthorized = true;
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
  mutations,
}
