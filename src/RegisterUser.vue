<template>
  <v-app id="inspire">
    <v-layout row justify-center>

      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-form ref="registerForm" v-model="valid" lazy-validation>
            <v-card-title>
              <span class="headline">Регистрация нового пользователя</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>

                  <v-flex xs4>
                    <v-text-field label="Имя" v-model="name1" :rules="[rules.required,rules.counter_min]" type="text"
                                  required></v-text-field>
                  </v-flex>

                  <v-flex xs4>
                    <v-text-field label="Отчество" v-model="name3" :rules="[rules.required,rules.counter_min]"
                                  type="text"
                                  required></v-text-field>
                  </v-flex>

                  <v-flex xs4>
                    <v-text-field label="Фамилия" v-model="name2" :rules="[rules.required,rules.counter_min]"
                                  type="text"
                                  required></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field label="Логин" v-model="login" :rules="[rules.required,rules.counter_min]"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="Пароль" v-model="password" :rules="[rules.required,rules.counter_min]"
                                  type="password"
                                  required></v-text-field>
                  </v-flex>


                  <v-flex xs6>

                  </v-flex>

                  <v-flex xs6>
                    <v-text-field label="Пароль ещё раз"
                                  v-model="password2"
                                  :rules="[rules.required, rules.equalPasswords]"
                                  type="password" required>

                    </v-text-field>
                  </v-flex>

                  <!--<v-flex xs6>-->
                  <!--<v-select-->
                  <!--v-model="selectedRole"-->
                  <!--:items="roles"-->
                  <!--label="Роль"-->
                  <!--required-->
                  <!--&gt;</v-select>-->
                  <!--</v-flex>-->


                  <v-flex xs4>
                    <v-text-field label="Телефон" :rules="[rules.phone,rules.required]" placeholder="922 555 9999"
                                  counter="10" prefix="+7"
                                  v-model.number="number_tel" mask="NNN NNN NNNN"></v-text-field>
                  </v-flex>

                  <v-flex xs8>
                    <v-text-field
                      v-model="email"
                      :rules="[rules.required, rules.email]"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </v-flex>

                </v-layout>
                <v-layout align-center>
                  <v-flex xs12>
                    <v-checkbox
                      v-model="agreementState"
                      color="green"
                    >
                      <div slot="label" @click.stop="">
                        Согласен с
                        <a href="javascript:;" @click.stop="dialogLicence = true">пользовательским соглашением</a>
                      </div>
                    </v-checkbox>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-alert
                :value="true"
                type="success"
                v-model="successAlert"
              >
                Пользователь успешно создан в системе.<br>Через {{countTimer}} секунды вы будете переадресованы на
                страницу авторизации...
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
              <v-btn color="blue darken-1" @click="submit" type="submit" :disabled="!valid || !agreementState" flat>
                Зарегистрировать
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogLicence" persistent max-width="600px">
        <v-card>

          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Privacy Policy
          </v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialogLicence = false"
            >
              Согласен
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>


<script>


  export default {
    name: "RegisterUser",
    data() {
      return {
        successAlert: false, //flag to show success creation message
        errorAlert: false,//flag to show alert message
        dialogLicence: false, //пользовательское соглашение - диалог
        countTimer: 4,

        valid: false, // valid inputs on form
        id_org: "",
        login: "",
        loginRules: [
          v => !!v || 'Логин - обязательное поле',
          v => (v && v.length >= 3) || 'Логин должен содержать не менее 3-х символов'
        ],
        id_role: "",
        password: "",
        password2: "",
        email: "",
        rules: {
          required: value => !!value || 'обязательное поле',
          equalPasswords: value => (value && value === this.password) || 'Пароли не совпадают',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Неверный email'
          },
          counter_min: value => value.length > 3 || 'Минимум 3 символа',
          phone: value => value && value.toString().length === 10 || 'Введите 10 цифр номера телефона',
        },
        name1: "",
        name2: "",
        name3: "",
        number_tel: null,
        dialog: true,
        agreementState: false,
        selectedRole: {text: "Пользователь", id: 4},
        roles: [
          {text: "Пользователь", id: 4},
          {text: "Управляющий компании", id: 4},
          {text: "Диспетчер", id: 7}],
      }
    },
    methods: {
      submit() {
        if (this.$refs.registerForm.validate()) {
          console.log("ENTER");
          let promise = this.$store.dispatch('user/RegUser',
            {
              id_org: this.id_org,
              login: this.login,
              id_role: this.selectedRole.id,
              password: this.password,
              name1: this.name1,
              name2: this.name2,
              name3: this.name3,
              number_tel: this.number_tel,
              email: this.email
            });

          promise.then(onFulfilled, onRejected);
          let self = this;

          function onFulfilled(success) {
            if (success) {
              self.errorAlert = false;
              self.flag_validate_contact = true;
            }
            else {
              self.successAlert = false;
              self.errorAlert = true;

              console.error("fail register");
            }
          }

          function onRejected(err) {
            self.errorAlert = true;
            console.error(err);
          }
        }
      },
    },
  }
</script>



