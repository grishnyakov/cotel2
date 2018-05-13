import VueRouter from 'vue-router';
let routes=[
  {
    path: '/devices',
    component: require('./components/T_DEVICES.vue').default
  },
  {
    path: '/monitor',
    component: require('./components/T_MONITOR.vue').default
  },
  {
    path: '/org',
    component: require('./components/T_ORG.vue').default
  }
];

export default new VueRouter({routes});
