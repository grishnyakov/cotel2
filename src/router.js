import VueRouter from 'vue-router';
let routes=[
  {
    path: '/devices',
    component: require('./components/T_DEVICES.vue').default
  },
  {
    path: '/messages',
    component: require('./components/T_MESSAGES.vue').default
  },
  {
    path: '/org',
    component: require('./components/T_ORG.vue').default
  }
];

export default new VueRouter({routes});
