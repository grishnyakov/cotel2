<template>
  <v-app id="inspire">

    <v-navigation-drawer
      fixed
      clipped
      class="grey lighten-4"
      app
      permanent
      width="200"
      v-model="drawer"
    >
      <v-list
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >

            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>

          </v-layout>
          <v-divider
            dark
            v-else-if="item.divider"
            class="my-3"
            :key="i"
          ></v-divider>
          <v-list-tile
            :key="i"
            :to='{path: item.route}'
            v-else
            @click=""
            active-class="cyan lighten-5 cyan--text"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <!-- строка -->

      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="amber" app absolute clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-2 mr-5">SIT&nbsp;<span class="text">System</span></span>
      <!--<v-text-field-->
        <!--solo-inverted-->
        <!--flat-->
        <!--label="Поиск"-->
        <!--prepend-icon="search"-->
      <!--&gt;</v-text-field>-->
      <v-spacer></v-spacer>
      <v-toolbar-items class="">

        <v-btn flat>
          <v-icon>person</v-icon>
          {{User.login}}
        </v-btn>
        <v-btn flat @click.native="logOut()">Выход</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>

        <v-layout justify-center row>
          <v-flex xs12>
            <router-view></router-view>
          </v-flex>
        </v-layout>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {mapGetters, mapState, mapMutations } from 'vuex'

  export default {

    name: 'App',
    data: () => ({
      drawer: false,
      clipped: false,

      items: [
        {icon: 'phonelink', text: 'Устройства', action: 'devices', route: '/devices', items: []},
        {icon: 'dashboard', text: 'Мониторинг', action: 'monitor', route: '/monitor', items: []},

        {divider: true},
        // {icon: 'public', text: 'Организация', action: 'org', route: '/org', items: []},
      ],
    }),
    methods: {
      logOut() {
        this.$store.dispatch('user/LogOUT').then(result => {
          if(result) {
            this.$store.dispatch('ResetStates');
          }
          else console.error("failed logout");
        });
      },
    },
    created: function () {

    },
    computed: {
      ...mapState({
        User: state => state.user.USER,
      }),
    },
    mounted() {
      this.$store.dispatch('devices/RequestNewDeviceList', this.User)
        .then(result => {
          this.$store.dispatch('devices/RequestNewAlertList');
        }).catch(er => {
        }
      );
    }
  }
</script>


<style>
  .container {
    max-height: 90vh; /* 100vh - 100% от высоты viewport(окна браузера) */
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .navigation-drawer__border {
    display: none;
  }

  .text {
    font-weight: 400;
  }

</style>


