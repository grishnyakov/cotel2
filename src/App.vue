<template>
    <v-app id="inspire">
      <v-navigation-drawer
        fixed
        clipped
        class="grey lighten-4"
        app
        v-model="drawer"
      >
        <v-list
          dense
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
              <v-list-tile-content >
                <v-list-tile-title class="grey--text"  >
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
        <span class="title ml-3 mr-5">SIT&nbsp;<span class="text">System</span></span>
        <v-text-field
          solo-inverted
          flat
          label="Поиск"
          prepend-icon="search"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">

          <v-btn flat >  <v-icon>person</v-icon>{{username}}</v-btn>
          <v-btn flat @click.native="logOut()">Выход</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container wrap grid-list-md text-xs-center class="container">

          <v-layout justify-center  row >
            <v-flex xs11>
              <router-view></router-view>
            </v-flex>
          </v-layout>

        </v-container>
      </v-content>
    </v-app>
</template>

<script>

  export default {

    name: 'App',
    data: () => ({
      drawer: true,
      clipped: false,

      items: [
        { icon: 'dashboard', text: 'Мониторинг' , action: 'monitor', route: '/monitor', items: []},
        { icon: 'phonelink', text: 'Устройства' , action: 'devices', route: '/devices', items: [] },
        { divider: true },
        { icon: 'public', text: 'Организация' , action: 'org', route: '/org', items: []},
      ],
    }),
    methods: {
        logOut(){
          console.log("i try logout!!");
          // Send a POST request
          let uri = 'http://89.31.33.164:7877/logout';

          this.$parent.Axios.post(uri,{
            withCredentials: true,
          })
            .then(response => {
              console.log(response);
              if(response.data.success)
              {
                this.$session.remove('username');
                location.hash = "";
                location.reload();
              }
            })
            .catch(function (error) {
              console.error(error);

            });

        },

    },
    created: function () {

    },
    computed: {
      username() {
        return this.$store.USER.username;
      }
    }

  }
</script>


<style>
  .container {
    max-height: 90vh; /* 100vh - 100% от высоты viewport(окна браузера) */
    overflow-y: scroll;
    overflow-x:hidden;
  }
  .navigation-drawer__border {
    display: none;
  }
  .text {
    font-weight: 400;
  }

</style>


