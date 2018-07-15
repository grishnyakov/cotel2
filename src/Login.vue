
<template>
  <div>
    <RegisterUser v-if="flag_register_user" ></RegisterUser>
    <v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-form @submit="tryAuth()">
            <v-card-title>
              <span class="headline">Авторизация</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Логин" v-model="username" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Пароль"  v-model="password" type="password" required></v-text-field>
                  </v-flex>

                </v-layout>
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-btn color="green darken-1" @click.native="flag_register_user = true" flat>Регистрация нового пользователя</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" type="submit" flat>Войти</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
  </div>
</template>


<script>
  import RegisterUser from "./RegisterUser.vue"
  export default {
    name: "Login",
    data () {
      return {
        dialog: true,
        username: "",
        password: "",
        flag_register_user: false
      }
    },
    methods: {
      tryAuth(){
        console.log("ENTER");
        let prom = this.$store.dispatch('LogIN',{L: this.username,P: this.password});
        prom.then(success => {
          this.$parent.flag_auth = success;
        })
      },
    },
    components: {RegisterUser}
  }
</script>



