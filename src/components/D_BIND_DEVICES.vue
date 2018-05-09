<template>
  <v-layout row justify-start>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator">Привязать новое устройство</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Привязка нового устройства</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Номер устройства" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Пароль устройства" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" flat @click.native="add_device()">Привязать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
  import axios from 'axios'
  export default {
    name: "D_BIND_DEVICE",
    data: () => ({
      dialog: false
    }),
    add_device: function () {
      let uri = 'http://localhost:7877/data/devices/bind';

      axios.post(uri)
        .then(response => {
          console.log(response);
          if (response.data.success) {
            this.devices = response.data.devices;
          }
          this.dialog = false;
        })
        .catch(function (error) {
          console.error(error);

        });

    }
  }
</script>

<style scoped>

</style>
