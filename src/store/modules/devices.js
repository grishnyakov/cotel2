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
  GetDeviceList(state, getters, rootState) {
    return state.DEVICE_LIST;
  },
  GetMsssageList(state, getters, rootState) {
    return state.MESSAGE_LIST;
  },
  GetAlertList(state, getters, rootState) {
    return state.ALERT_LIST;
  },
  GetIdsOfDevices(state,getters, rootState) {
    return getters.GetDeviceList.map( device => device.id);
  },
};

const actions = {
  RequestNewDeviceList({commit, state},User) {
    request.getDataFromServer('/data/devices', {login: User.login})
      .then((result) => {
        if (result.success) {
          console.log("RequestDeviceList: SUCCESS!", result);
          commit('SetDeviceList', result.devices);
        }
        else {
          console.log("RequestDeviceList: FAILED!", result);
        }
        return result.success;
      })
      .catch((er) => {

      });

  },
  RequestNewAlertList({commit, state}) {
    return request.getDataFromServer('/data/dangerlist', {
      devices: state.getters.GetIdsOfDevices
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
  RequestNewMessageList({commit, state, getters},ids_devices) {
    return request.getDataFromServer('/data/messages', {
      params: [ids_devices],
      type_query: "messages"})
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
        }
        else {
          console.log("RequestNewMessageList: FAILED!", result);
        }
      })
      .catch((er) => {

      });
  },

  BindDeviceToUser({commit, state, getters}, Device, User) {
    request.getDataFromServer('/data/devices/bind',
      {
        login: User.login,
        number: Device.number,
        pin: Device.pin,
      })
      .then((result) => {
        if (result.success) {
          console.log("BindDeviceToUser: SUCCESS!", result);
        }
        else {
          console.log("RequestNewAlertList: FAILED!", result);
        }
        return result.success;
      })
      .catch((er) => {
        return false;
      });
  }
};

const mutations = {
  SetDeviceList(state, devices) {
    state.DEVICE_LIST = devices;
    console.log("COMMIT: SetDeviceList", devices);
  },
  SetMsssageList(state, messages) {
    state.MESSAGE_LIST = messages;
    console.log("COMMIT: GetMsssageList", messages);
  },
  SetAlertList(state, alerts) {
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
