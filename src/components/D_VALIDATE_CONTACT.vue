<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card v-if="showSendCodeCard">
      <v-form ref="sendCodeForm" v-model="valid2" lazy-validation>
        <v-card-title>
          <span class="headline">Подтверждение email</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs8>
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-btn color="blue darken-1" @click.native="sendCode" :disabled="!valid2" flat>
                  Отправить код
                </v-btn>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
    <v-card v-else="showSendCodeCard">
      <v-form ref="validateForm" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">Подтверждение email - код отправлен</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs6>
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="E-mail"
                  :readonly="true"
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  v-model="code"
                  label="Код из письма"
                  required
                ></v-text-field>
              </v-flex>

            </v-layout>
          </v-container>
          <v-alert
            :value="true"
            type="success"
            v-model="successAlert"
          >
            Email успешно подтверждён.<br>Через {{countTimer}} секунды вы будете перенаправлены на
            страницу авторизации...
          </v-alert>
          <v-alert
            :value="true"
            type="error"
            v-model="errorAlert"
          >
            Возникла ошибка при подтверждении email. Обратитесь в техподдержку: sit45@mail.ru
          </v-alert>
        </v-card-text>
        <v-divider class="mt-1"></v-divider>
        <v-card-actions>
          <v-btn color="orange darken-1" @click="showSendCodeCard=true" flat>Отправить ещё раз</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="submit" type="submit" :disabled="!valid" flat>
            Подтведить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "D_VALIDATE_CONTACT",
    data() {
      return {
        successAlert: false, //flag to show success creation message
        errorAlert: false,//flag to show alert message
        countTimer: 4,
        valid: false, // valid inputs on form check code
        valid2: false, // valid inputs on form send code
        code: null,
        email: "",
        rules: {
          required: value => !!value || 'обязательное поле',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Неверный email'
          },
          counter_min: value => value.length > 3 || 'Минимум 3 символа',
        },
        dialog: true,
        showSendCodeCard: true
      }
    },
    methods: {
      submit() {
        if (this.$refs.validateForm.validate()) {
          console.log("ENTER");
          let promise = this.$store.dispatch('user/ValidateEmail',
            {
              query: 'checkCode',
              email: this.email,
              code: this.code,
            });
          promise.then(onFulfilled, onRejected);
          let self = this;
          function onFulfilled(success) {
            if (success) {
              self.errorAlert = false;
              self.successAlert = true;

              self.decrementCounter();
            }
            else {
              self.successAlert = false;
              self.errorAlert = true;
              console.error("fail checkCode");
            }
          }

          function onRejected(err) {
            self.errorAlert = true;
            console.error(err);
          }

        }
      },
      sendCode() {
        if (this.$refs.sendCodeForm.validate()) {
          this.showSendCodeCard = false;
          let prom = this.$store.dispatch('user/ValidateEmail',
            {
              query: 'sendCode',
              email: this.email,
            });
          prom.then(success => {
            if (success) {
              this.errorAlert = false;
            }
            else {
              this.errorAlert = true;
              console.error("fail send code");
            }
          });
          prom.catch(err => {
            this.errorAlert = true;
            console.error(err);
          })
        }
      },
      decrementCounter: function () {
        if (this.countTimer-- < 1) {
          this.$parent.flag_validate_contact = false;
          this.$parent.flag_register_user = false;
        }
        else setTimeout(this.decrementCounter, 1000);
      },
    },
    mounted() {
      if (this.$attrs.email) {
        this.email = this.$store.state.user.USER.email;
      }
    }
  }
</script>

<style scoped>

</style>
