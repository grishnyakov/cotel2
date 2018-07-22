<template>
  <v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog  v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-form ref="registerForm" v-model="valid" lazy-validation>
            <v-card-title>
              <span class="headline">Регистрация нового пользователя</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>

                  <v-flex xs4>
                    <v-text-field label="Имя"  v-model="name1" :rules="nameRules" type="text" required></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field label="Фамилия"  v-model="name2" :rules="nameRules" type="text" required></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field label="Отчество"  v-model="name3" :rules="nameRules" type="text" required></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field label="Логин" v-model="login" :rules="loginRules" required></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="Пароль"  v-model="password" :rules="passwordRules" type="password" required></v-text-field>
                  </v-flex>


                  <v-flex xs6>
                    <v-select
                      v-model="selectedRole"
                      :items="roles"
                      label="Роль"
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="Телефон" :rules="telRules"  placeholder="922 555 9999" counter="10" prefix="+7" v-model.number="number_tel" mask="NNN NNN NNNN" ></v-text-field>
                  </v-flex>


                </v-layout>
              </v-container>
              <v-alert
                :value="true"
                type="success"
                v-model="successAlert"
              >
                Пользователь успешно создан в системе.<br>Через {{countTimer}} секунды вы будете переадресованы на страницу авторизации...
              </v-alert>
              <v-alert
                :value="true"
                type="error"
                v-model="errorAlert"
              >
                Возникла ошибка при создании пользователя. Обратитесь в техподдержку: sit45@mail.ru
              </v-alert>
            </v-card-text>
            <v-divider class="mt-1"></v-divider>
            <v-card-actions>
              <v-btn color="orange darken-1" @click.native="$parent.flag_register_user = false" flat>Отмена</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1"  @click="submit"  type="submit" :disabled="!valid" flat>Зарегистрировать</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>


<script>
  export default {
    name: "RegisterUser",
    data () {
      return {
        successAlert: false, //flag to show success creation message
        errorAlert: false,//flag to show alert message

        countTimer: 4,

        valid: true, // valid inputs on form
        id_org: "",
        login: "",
        loginRules: [
          v => !!v || 'Логин - обязательное поле',
          v => (v && v.length >= 3) || 'Логин должен содержать не менее 3-х символов'
        ],
        id_role: "",
        password: "",
        passwordRules: [
          v => !!v || 'Пароль - обязательное поле',
          v => (v && v.length >= 3) || 'Пароль должен содержать не менее 3-х символов'
        ],
        name1: "",
        name2: "",
        name3: "",
        nameRules: [
          v => !!v || 'Это поле обязательное',
          v => (v && v.length >= 3) || 'не менее 3-х букв'
        ],
        number_tel: null,
        telRules:[
          (v) => !!v || 'Это поле обязательное',
          (v) => !!v && v.length <= 10 || 'Введите 10 цифр номера телефона',
        ],
        dialog: true,

        selectedRole: {text: "Пользователь", id:4},
        roles: [
          {text: "Пользователь", id:4},
          {text: "Управляющий компании", id:4},
          {text: "Диспетчер", id:7}]
      }
    },
    methods: {
      submit() {
        if (this.$refs.registerForm.validate()) {
          console.log("ENTER");
          let prom = this.$store.dispatch('user/RegUser',
            {
              id_org: this.id_org,
              login: this.login,
              id_role: this.selectedRole.id,
              password: this.password,
              name1: this.name1,
              name2: this.name2,
              name3: this.name3,
              number_tel: this.number_tel
            });
          prom.then(success => {
            if (success){
              this.successAlert = true;
              this.decrementCounter();
            }
            else {
              this.errorAlert = true;
              console.error("fail register");
            }
          });
          prom.catch(err => {
            this.errorAlert = true;
            console.error(err);
          })
        }
      },
      decrementCounter: function () {
        if(this.countTimer-- <= 0){
          this.$parent.flag_register_user = false;
        }
        else setTimeout(this.decrementCounter, 1000);
      }
    }
  }
</script>



