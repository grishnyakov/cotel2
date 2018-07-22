<template>
  <div>
    <RegisterUser v-if="flag_register_user"></RegisterUser>
    <v-app id="inspire">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>
                <span class="headline">Авторизация</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        label="Логин"
                        :rules="loginRules"
                        v-model="login"
                        required>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        label="Пароль"
                        :rules="passwordRules"
                        v-model="password"
                        type="password"
                        required>
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>

              </v-card-text>
              <v-card-actions>
                <v-btn color="green darken-1" @click.native="flag_register_user = true" flat>Регистрация нового
                  пользователя
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1"
                       type="submit"
                       :disabled="!valid"
                       @click="submit" flat
                >Войти
                </v-btn>
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
  import {mapGetters, mapState} from 'vuex'


  export default {
    name: "Login",
    data() {
      return {
        valid: true,
        dialog: true,
        login: "",
        loginRules: [
          v => !!v || 'Логин - обязательное поле',
          v => (v && v.length >= 3) || 'Логин должен содержать не менее 3-х символов'
        ],
        password: "",
        passwordRules: [
          v => !!v || 'Пароль - обязательное поле',
          v => (v && v.length >= 3) || 'Пароль должен содержать не менее 3-х символов'
        ],
        flag_register_user: false,
      }
    },
    computed: {
      ...mapState({
        userAuthorized: state => state.user.userAuthorized
      }),
    },
    methods: {
      submit() {
        if (this.$refs.form.validate()) {
          let prom = this.$store.dispatch('user/LogIN', {login: this.login, password: this.password});
          prom.then(result => {
            this.$parent.flag_auth = result;
          });
        }
      }
    },

    components: {RegisterUser}
  }
</script>




