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
                <v-text-field label="Номер устройства" v-model="number" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Пароль устройства" v-model="pin" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" flat @click.native="add_device">Привязать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>

  export default {
    name: "D_BIND_DEVICE",
    data: () => ({
      dialog: false,
      number: 0,
      pin: 0
    }),
    methods: {
      add_device: function () {
        let bindPromice = this.$store.dispatch('BindDeviceToUser', {N: this.number, P: this.pin});
        bindPromice.then(success => {
          if (success)
            this.dialog = false;
          else console.error("Ошибка привязки");
        })

      }
    }
  }
</script>

<style scoped>

</style>
