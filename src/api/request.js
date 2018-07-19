/*
  This file requests any data from server (node.js)
 */
import axios from 'axios'
const CONF = require('../config/index');

axios.defaults.withCredentials = true;


export default {
  /*
      getDataFromServer
      string address: url target address. example: '/login'
      fn: will executed when successful received data
      efn: will executed when received error
   */
  getDataFromServer(address,params){
    return new Promise((resolve, reject)=>{
      axios.post(CONF.dev.urlServer+address, params)
        .then(response => {
          resolve(response.data);
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
  }
}

