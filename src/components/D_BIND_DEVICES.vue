<template>
  <v-layout row justify-start>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="primary" dark  @click="clear" slot="activator">Привязать новое устройство</v-btn>
      <v-form ref="bindDeviceForm" v-model="valid" lazy-validation>
        <v-card>
        <v-card-title>
          <span class="headline">Привязка нового устройства</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md style="overflow: hidden;">
            <v-layout wrap>
              <v-flex xs7>
                <v-text-field mask="N NNN NNN NNN" label="Номер " :rules="requiredField" :counter="10" v-model.number="number" required></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field label="PIN " v-model="pin" :rules="requiredField" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Описание "  v-model="info" type="text"></v-text-field>
              </v-flex>
            </v-layout>


            <v-layout wrap>
              Место установки
              <T_YMAP_DEV></T_YMAP_DEV>
            </v-layout>
          </v-container>
          <v-divider class="mt-1"></v-divider>
          <v-alert
            :value="errorMessage"
            type="error"
          >
            {{errorMessage}}
          </v-alert>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1"  @click="submit"  type="submit" :disabled="!valid" flat>Привязать</v-btn>

        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
  </v-layout>
</template>


<script>
  import {mapState} from 'vuex'
  import T_YMAP_DEV from './T_YMAP_DEV'

  export default {

    name: "D_BIND_DEVICE",
    data: () => ({
      dialog: false,
      number: null,
      pin: null,
      info: "",
      errorMessage: "Возникла ошибка. Обратитесь в техподдержку: sit45@mail.ru",
      valid: true, // valid inputs on form
      successMessage: false, //flag to show success creation message
      markers: [],
      currentPlace: {},
      requiredField: [
        v => !!v || 'Это поле обязательное',
      ]
    }),
    computed: {
      ...mapState({
        User: state => state.user.USER,
      }),
    },
    methods: {
      submit() {
        if (this.$refs.bindDeviceForm.validate()) {
          this.$store.dispatch('devices/BindDeviceToUser', {
            id_device: this.number,
            pin: this.pin,
            info: this.info,
            lat: (typeof this.currentPlace.geometry !== 'undefined') ? this.currentPlace.geometry.location.lat(): null,
            lng: (typeof this.currentPlace.geometry !== 'undefined') ? this.currentPlace.geometry.location.lng(): null,
            formatted_address: this.currentPlace.formatted_address,
            place_id: this.currentPlace.place_id})
            .then(result => {
              if (result.success) {
                console.log("Успешно привязано", result);
                this.dialog = false;
                let prom = this.$store.dispatch('devices/RequestNewDeviceList',this.User);
              }
              else {
                this.errorMessage = "Ошибка привязки: "+ result.error;
                console.error("Ошибка : ",result.error);
              }
            })
            .catch(error=>{
              this.errorMessage = "Ошибка привязки: "+ error;
              console.error("Ошибка : ",error);
            });
        }
      },
      clear: function () {
        this.$refs.bindDeviceForm.reset();
        this.errorMessage = '';
        console.log("clear");
      }
    },
    components: {T_YMAP_DEV}
  }
</script>

<style scoped>

</style>
