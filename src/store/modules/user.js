/*
  This file contains user info
  Methods registration, authorization user
 */
import request from '../../api/request'


// initial state
const state = {
  USER: {
    name: '', //Ivanov Ivan Ivanovich
    hash: '',
    id: 0
  },
  userAuthorized: false
};

const getters = {
  UserInfo (state, getters, rootState) {
    return state.USER;
  },
  AuthState (state, getters, rootState) {
    return state.userAuthorized;
  },
};

const actions = {
  LogIN ({commit,rootState},U) {
    request.getDataFromServer('/login', U)
      .then((data) =>{
          if(data.success){
            console.log("login: SUCCESS!",data);
            commit('SetUserInfo', data);
            console.log(rootState);
          }
          else {
            console.log("login: FAILED!",data);
          }
        })
      .catch((er) =>{

      });
  },
  LogOUT({commit}){
    request.getDataFromServer('/logout', {})
      .then((data) =>{
        if(data.success){
          console.log("logout: SUCCESS!",data);
          commit('DropAuthorization');
        }
        else {
          console.log("logout: FAILED!",data);
        }
      })
      .catch((er) =>{

      });
  },
  RegU ({commit},U) {
    let params = {
      id_org: U.id_org,
      login: U.login,
      id_role: U.id_role,
      password: U.password,
      name1: U.name1,
      name2: U.name2,
      name3: U.name3,
      number_tel: U.number_tel
    };

    request.getDataFromServer('/reguser', params)
      .then((data) =>{
        if(data.success){
          if(response.data.success === true)
            console.log("reguser: SECCESSFUL!");
          else console.log("reguser: FAILED!");
        }
        else {
          console.log("logout: ERROR!",data);
        }
      })
      .catch((er) =>{

      });
  },      //new user
};

const mutations = {
  SetUserInfo (state, userInfo) {
    state.USER = userInfo;
    state.userAuthorized = true;
  },
  DropAuthorization (state) {
    state.userAuthorized = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
