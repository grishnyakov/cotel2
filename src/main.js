// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Login from './Login'
import App from './App'
import VueCookie from 'vue-cookie'
import VueSessionStorage from 'vue-sessionstorage'
import * as VueGoogleMaps from 'vue2-google-maps'

import VueRouter from 'vue-router'
import routes from './router.js'
import store from './store'

const CONF = require('../config/index');


import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader



Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAlu17PuCOggAb8q65PiJ2RhOkIwEzUxto', //
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
});

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueSessionStorage);
Vue.use(VueCookie);


import moment from 'moment'
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).utc(5).format('HH:mm:ss   (DD.MM.YYYY)')
  }
});
Vue.config.productionTip = false;


let MainVue = new Vue({
  el: '#app',
  router: routes,
  store,
  created: function () {
    console.log("urlServer:",CONF.dev.urlServer);
  },
  components: {Login, App},
  template: `<App  v-if="$store.state.user.userAuthorized"></App>
             <Login v-else></Login>`
});
