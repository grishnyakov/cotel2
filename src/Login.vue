<template>
  <div>
    <ValidateContact v-if="flag_validate_contact" v-bind:login="login"></ValidateContact>
    <RegisterUser v-if="flag_register_user"></RegisterUser>
    <v-app id="inspire">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="400px">
          <v-card>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-card-title>
                <div class="headline">Авторизация</div>
                <v-spacer></v-spacer>
                <v-btn class="headline" flat color="blue">ЛК СИТ</v-btn>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md style="overflow: hidden;">
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
                <v-alert
                  :value="warning"
                  type="warning"
                >
                  {{warning}}
                  <v-btn v-if="showConfirmButton" @click="flag_validate_contact = true">Подтвердить email</v-btn>
                </v-alert>
                <v-alert
                  :value="alert"
                  type="error"
                >
                  {{alert}}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green darken-1" @click.native="flag_register_user = true" flat>Регистрация физ.
                  лица
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
  import ValidateContact from "./components/D_VALIDATE_CONTACT.vue"
  const {STATUS} = require('./store/const.js');

  import {mapGetters, mapState} from 'vuex'


  export default {
    name: "Login",
    data() {
      return {
        flag_validate_contact: false,
        valid: true,
        showConfirmButton: false,
        dialog: true,
        alert: '', // текст ошибки
        warning: '', // текст предупреждения
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
        if (this.$refs.loginForm.validate()) {
          this.alert = "";
          this.warning = '';
          let promise = this.$store.dispatch('user/LogIN', {login: this.login, password: this.password});
          promise.then(
            status => {

              if (status === STATUS.ACTIVE.id) {
                this.warning = "";
              }
              else {
                let currentStatus = STATUS.getStatusById(status);
                if(currentStatus)
                  this.warning = currentStatus.info;
                else this.warning = "Неизвестный статус пользователя ";
              }


              if (status === STATUS.NOT_CONFIRMED.id)
                this.showConfirmButton = true;
              else this.showConfirmButton = false;
            }
            ,
            error => {
              this.alert = error.text || "Возникла ошибка при авторизации. Обратитесь в техподдержку";
              console.error(error);
            }
          )
        }
      }
    },
    created: function () {
      this.$store.dispatch('user/GetSession', {}); //попытка получить текущую сессию если она есть
    },
    components: {RegisterUser, ValidateContact}
  }
</script>



<style>
  .v-text-field__slot input{
    padding-left: 8px;
  }
</style>

<!--<style lang="scss">-->
  <!--//Вот, что я умею на SCSS!-->

  <!--//@import "style"; //импорт другого css, не требуется в этом проекте-->

  <!--@mixin shadow($size) { //местная функция - это прекрасно-->
    <!--box-shadow: $size $size rgba(0, 0, 0, 0.5); /* Параметры тени */-->
  <!--}-->

  <!--$back_color: #2aa59e; //переменные - огонь-->
  <!--$font-stack: 'M PLUS Rounded 1c', sans-serif;-->

  <!--%input_error {-->
    <!--color: darkred !important;-->
  <!--}-->

  <!--////////////////////////////////////////////////////////////////////////////-->

  <!--.overlay:before {-->
    <!--background-color: $back_color;-->
  <!--}-->

  <!--body {-->
    <!--.application { //вложенность - зачёт-->
      <!--font-family: $font-stack !important;-->
    <!--}-->
    <!--.dialog {-->
      <!--@include shadow(15px);-->
    <!--}-->
    <!--.error&#45;&#45;text input {-->
      <!--@extend %input_error;-->
    <!--}-->
  <!--}-->

<!--</style>-->




