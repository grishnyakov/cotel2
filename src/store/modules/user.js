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
  userAuthorized: false
};

const actions = {
  LogIN ({commit,rootState},User) {
    if(User.login && User.password)
    request.getDataFromServer('/login', User)
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
  RegUser ({commit},User) {
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

  RequestOrgInfo({commit},User) {
    request.getDataFromServer('/orginfo', {login: User.login})
      .then((data) =>{
        if(data.success){
          if(response.data.success === true){
            console.log("RequestOrgInfo: SECCESSFUL!",response.data);
            //commit in the store

          }
          else console.log("RequestOrgInfo: FAILED!",response.data);
        }
        else {
          console.log("RequestOrgInfo: ERROR!",data);
        }
      })
      .catch((er) =>{

      });
  }, //not yet finished
};

const getters = {
  UserInfo (state, getters, rootState) {
    return state.USER;
  },
  AuthState (state, getters, rootState) {
    return state.userAuthorized;
  },
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
