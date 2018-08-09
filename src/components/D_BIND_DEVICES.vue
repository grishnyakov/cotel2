<template>
  <v-layout row justify-start>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator">Привязать новое устройство</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Привязка нового устройства</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md style="overflow: hidden;">
            <v-layout wrap>
              <v-flex xs7>
                <v-text-field mask="N NNN NNN NNN" label="Номер "  :counter="maxCountN" :rules="maxCountRule" v-model.number="number" required></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field label="PIN " v-model="pin" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Описание "  v-model="info" type="text"></v-text-field>
              </v-flex>
            </v-layout>


            <v-layout wrap>
              <GmapAutocomplete
                v-on:place_changed="place_changed"

                style="width: 500px; height: 30px; padding: 5px; margin: 5px"
              ></GmapAutocomplete>

              <v-flex xs12>
                <GmapMap
                  :center="{
                    lat:55.4649113,
                    lng:65.30535120000002
                  }"
                  :zoom="11"
                  map-type-id="terrain"
                  style="width: 500px; height: 300px"
                  ref="mapRef"
                >
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    @click="center=m.position"
                  />
                </GmapMap>
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
      number: null,
      pin: null,
      info: "",
      markers: [],
      currentPlace: {},
      maxCountN: 10,
      maxCountRule:[
        (v) => !!v || 'Это поле обязательное',
      ],
    }),
    methods: {
      place_changed: function (place) {
        console.log("place_changed!", place);
        this.currentPlace = place;
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          console.error("No details available for input: '" + place.name + "'");
          return;
        }


        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          console.log("IF ");
          console.log();
          this.$refs.mapRef.$mapPromise.then((map) => {
            map.fitBounds(place.geometry.viewport);
          })
        } else {
          console.log("ELSE ");
          //   map.setCenter(place.geometry.location);
          //   map.setZoom(17);  // Why 17? Because it looks good.
        }
        // marker.setPosition(place.geometry.location);
        // marker.setVisible(true);
        this.markers = [];
        this.markers.push({
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        });

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        // infowindowContent.children['place-icon'].src = place.icon;
        // infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        // infowindow.open(map, marker);

      },
      add_device: function () {
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
            }
            else {
              alert("Ошибка привязки: "+ result.error);
              console.log("Ошибка привязки: ", result.error);
            }
          })
          .catch(error=>{
            alert("Ошибка привязки: "+ error);
            console.error("Ошибка : ",error);
          });

      }
    }
  }
</script>

<style scoped>

</style>
