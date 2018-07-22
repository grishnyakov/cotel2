/*
  This file contains devices and messages info
 */
import request from '../../api/request'

// initial state
const state = {
  DEVICE_LIST: [],
  MESSAGE_LIST: [], // from devices
  ALERT_LIST: [],  // alerts (for example: crash device, max temperature or humidity)
};

const getters = {
  GetDeviceList (state, getters, rootState) {
    return state.DEVICE_LIST;
  },
  GetMsssageList (state, getters, rootState) {
    return state.MESSAGE_LIST;
  },
  GetAlertList (state, getters, rootState) {
    return state.ALERT_LIST;
  },
};

const actions = {
  LogIN ({commit,rootState},User) {
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

  //DEVICES
  GET_DEVICE_LIST({commit,rootState}) {  //получить таблицу девайсов
    return new Promise((resolve, reject) => {
      if (state.DEVICE_LIST.length > 0)  //если они уже получены, то выдаём то что есть
        resolve(state.DEVICE_LIST);
      else { //иначе запрашиваем новый список двайсов
        axios.post('http://'+CONF.dev.host+':7877/data/devices', {
          login: state.USER.login
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
  GET_ID_DEVICE_LIST({commit,rootState}){
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
  GET_ALERT_LIST({commit,rootState}){
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


  BindDeviceToUser({state},D){
    return new Promise((resolve, reject) => {
      axios.post('http://'+CONF.dev.host+':7877/data/devices/bind', {
        login: state.USER.login,
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
};

const mutations = {
  SetDeviceList(state, devices) {
    state.DEVICE_LIST = devices;
    console.log("COMMIT: SetDeviceList", devices);
  },
  GetMsssageList(state, messages) {
    state.MESSAGE_LIST = messages;
    console.log("COMMIT: GetMsssageList", messages);
  },
  GetAlertList(state, alerts) {
    state.DANGER_LIST = alerts;
    console.log("COMMIT: GetAlertList", alerts);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
