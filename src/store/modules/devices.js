/*
  This file contains devices and messages info
 */
import request from '../../api/request'


let initialState = {
  DEVICE_LIST: [],
  MESSAGE_LIST: [], // from devices
  ALERT_LIST: [],  // alerts (for example: crash device, max temperature or humidity)
  __proto__: {}
};

const state = Object.assign({}, initialState);
state.__proto__ = {initialState: initialState};

const getters = {
  getDeviceList(state, getters, rootState) {
    return state.DEVICE_LIST;
  },
  getMessageList(state, getters, rootState) {
    return state.MESSAGE_LIST;
  },
  getAlertList(state, getters, rootState) {
    return state.ALERT_LIST;
  },
  getIdsOfDevices(state, getters, rootState) {
    return getters.getDeviceList.map(device => device.id);
  },
  getDeviceById: (state) => (idDevice) => {
    return state.DEVICE_LIST.filter(device  => device.id === idDevice);
  },
};

const actions = {
  RequestNewDeviceList({commit, state}, User) {
    return new Promise(((resolve, reject) => {
      request.getDataFromServer('/data/devices', {login: User.login})
        .then((result) => {
          if (result.success) {
            console.log("RequestDeviceList: SUCCESS!", result);
            commit('SetDeviceList', result.devices);
          }
          else {
            console.log("RequestDeviceList: FAILED!", result);
          }
          resolve(result.success);
        })
        .catch((er) => {
          reject(er);
        });
    }));
  },
  RequestNewAlertList({commit, state, getters}) {
    request.getDataFromServer('/data/dangerlist', {
      devices: getters.getIdsOfDevices
    })
      .then((result) => {
        if (result.success) {
          console.log("RequestNewAlertList: SUCCESS!", result);
          commit('SetAlertList', result.danger_list);
        }
        else {
          console.log("RequestNewAlertList: FAILED!", result);
        }
      })
      .catch((er) => {

      });
  },
  RequestNewMessageList({commit, state, getters}, ids_devices) {
    return new Promise((resolve, reject) => {
      request.getDataFromServer('/data/messages', {
        params: [ids_devices],
        type_query: "messages"
      })
        .then((result) => {
          if (result.success && result.result) {
            console.log("RequestNewMessageList: SUCCESS!", result);
            let messages = [];
            for (let key in result.result) {
              if (result.result.hasOwnProperty(key)) {
                messages.push(result.result[key]);
              }
            }
            commit('SetMsssageList', messages);
            resolve(true);
          }
          else {
            console.log("RequestNewMessageList: FAILED!", result);
            resolve(false);
          }
        })
        .catch((er) => {
          reject(er);
        });
    });
  },

  BindDeviceToUser({commit, state, getters}, props) {
    return new Promise((resolve, reject) => {
      request.getDataFromServer('/data/devices/bind', props)
        .then((result) => {
          resolve(result);
        })
        .catch((er) => {
          reject(er);
        });

    })
  }
}
;

const mutations = {
  SetDeviceList(state, devices) {
    state.DEVICE_LIST = devices;
    console.log("COMMIT: SetDeviceList", devices);
  },
  SetMsssageList(state, messages) {
    state.MESSAGE_LIST = messages;
    console.log("COMMIT: getMessageList", messages);
  },
  SetAlertList(state, alerts) {
    state.ALERT_LIST = alerts;
    console.log("COMMIT: getAlertList", alerts);
  },
  ResetState(state, payload) {
    for (let f in state) {
      if (typeof initialState[f] === "object") {
        state[f] = Object.assign({}, initialState[f])
      }
      else {
        state[f] = initialState[f];
      }
    }
    console.log(state);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
