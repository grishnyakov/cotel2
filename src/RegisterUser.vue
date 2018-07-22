<template>
  <v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-form @submit="regNewUser()">
            <v-card-title>
              <span class="headline">Регистрация нового пользователя</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>

                  <v-flex xs4>
                    <v-text-field label="Имя"  v-model="name1" type="text" required></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field label="Фамилия"  v-model="name2" type="text" required></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field label="Отчество"  v-model="name3" type="text" required></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field label="Логин" v-model="login" required></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="Пароль"  v-model="password" type="password" required></v-text-field>
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
                    <v-text-field label="Телефон" :rules="[
              () => !!number_tel || 'Это поле обязательное',
              () => !!number_tel && number_tel.length <= 10 || 'Введите 10 цифр номера телефона'
            ]"  placeholder="922 555 9999" counter="10" prefix="+7" v-model="number_tel" mask="NNN NNN NNNN"  required></v-text-field>
                  </v-flex>


                </v-layout>
              </v-container>

            </v-card-text>
            <v-divider class="mt-1"></v-divider>
            <v-card-actions>
              <v-btn color="orange darken-1" @click.native="$parent.flag_register_user = false" flat>Отмена</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" type="submit" flat>Зарегистрировать</v-btn>
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
        id_org: "",
        login: "",
        id_role: "",
        password: "",
        name1: "",
        name2: "",
        name3: "",
        number_tel: "",
        dialog: true,
        selectedRole: {text: "Пользователь", id:4},
        roles: [
          {text: "Пользователь", id:4},
          {text: "Управляющий компании", id:4},
          {text: "Диспетчер", id:7}]
      }
    },
    methods: {
      regNewUser(){
        console.log("ENTER");
        let prom = this.$store.dispatch('RegUser',
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
            this.$parent.flag_register_user = false;
        })
      }
    }
  }
</script>



