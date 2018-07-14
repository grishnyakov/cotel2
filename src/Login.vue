<template>
  <v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
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
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="tryAuth()">Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>


<script>


  export default {
    name: "Login",
    data () {
      return {
        dialog: true,
        username: "",
        password: ""
      }
    },
    methods: {
      tryAuth(){

        // Send a POST request
        //let uri = 'http://localhost:7877/login';
        let uri = 'http://89.31.33.164:7877/login';
        

        this.$parent.Axios.post(uri, {
          username: this.username,
          password: this.password
        })
          .then(response => {
            console.log(response);
            if(response.data.success === true)
            {
              console.log("success!!!!!!!!!!!!!!");
              let username = response.data.username;
             // this.$session.set('username', username); // Set the username in session Storage
              this.$session.set('username', username); // Set the username in session Storage
              this.$parent.userIsAuthorized = true;
              window.location.reload();
            }
          })
          .catch(function (error) {
            console.error(error);

          });
      }
    }
  }
</script>



