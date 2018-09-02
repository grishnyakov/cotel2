<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card>
      <v-form ref="validateForm" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">Подтверждение email</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs12>
                <h3>На ваш e-mail мы отправили код, который необходимо вставить в это поле: </h3>
              </v-flex>

            </v-layout>
            <v-layout wrap>

              <v-flex xs12>
                <v-text-field
                  v-model="code"
                  label="Код из письма"
                  required
                ></v-text-field>
              </v-flex>

            </v-layout>
          </v-container>
          <v-alert
            :value="info"
            type="info"
          >
            {{info}}
          </v-alert>
          <v-alert
            :value="true"
            type="success"
            v-model="successMessage"
          >
            Email успешно подтверждён.<br>Через {{countTimer}} секунды вы будете перенаправлены на
            страницу авторизации...
          </v-alert>
          <v-alert
            :value="errorMessage"
            type="error"
          >
            {{errorMessage}}
          </v-alert>
        </v-card-text>
        <v-divider class="mt-1"></v-divider>
        <v-card-actions>
          <v-btn color="orange darken-1" @click="sendCode" flat>Отправить ещё раз</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="submit" type="submit" :rules="[rules.required]" :disabled="!valid" flat>
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
        successMessage: false, //flag to show success creation message
        errorMessage: false,//flag to show alert message
        countTimer: 4,
        valid: false, // valid inputs on form check code
        code: null,
        info: "",
        rules: {
          required: value => !!value || 'обязательное поле',
          counter_min: value => value.length >= 3 || 'Минимум 3 символа',
        },
        dialog: true,
      }
    },
    methods: {
      submit() {
        if (this.$refs.validateForm.validate()) {
          console.log("ENTER");
          let promise = this.$store.dispatch('user/ValidateEmail',
            {
              query: 'checkCode',
              code: this.code,
              login: this.$attrs.login,
            });
          let self = this;

          promise.then(
            success => {
              if (success) {
                this.hideError();
                this.hideInfo();
                this.successMessage = true;
                self.decrementCounter();
              }
              else {
                this.showError();
                console.error("fail checkCode");
              }
            },
            error => {
              this.showError(error.text);
              console.error(error);
            }
          );

        }
      },
      sendCode() {
        console.log("sendCode");
        if(!this.$attrs.login) {
          console.error('нет логина в this.$attrs.login',this.$attrs);
          return;
        }
        let promise = this.$store.dispatch('user/ValidateEmail',
          {
            query: 'sendCode',
            login: this.$attrs.login,
          });


        promise.then(
          status => {
            if (status)
              this.showInfo("Код отправлен на почтовый адрес указанный при регистрации");
            else
              this.showError();
          },
          error => {
            this.showError();
          }
        )


      },
      decrementCounter: function () {
        if (this.countTimer-- < 1) {
          this.$parent.flag_validate_contact = false;
          this.$parent.flag_register_user = false;
        }
        else setTimeout(this.decrementCounter, 1000);
      },
      showInfo(text = "Код отправлен на почтовый адрес указанный при регистрации") {
        if (text) {
          this.errorMessage = '';
          this.info = text;
        }
      },
      hideInfo() {
        this.info = '';
      },
      showError(text = "Возникла ошибка при подтверждении email. Обратитесь в техподдержку: sit45@mail.ru") {
        if (text) {
          this.info = '';
          this.successMessage = false;
          this.errorMessage = text;
        }
        else {

        }
      },
      hideError() {
        this.errorMessage = '';
      }
    },
    mounted() {
      this.sendCode();
    }
  }
</script>

<style scoped>

</style>
