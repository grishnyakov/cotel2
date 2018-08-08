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
                <v-text-field label="Номер " v-model="number" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field label="PIN " v-model="pin" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <GmapAutocomplete
                v-on:place_changed="place_changed"
                style="width: 500px;"
              ></GmapAutocomplete>

              <v-flex xs12>
                <GmapMap
                  :center="{lat:10, lng:10}"
                  :zoom="7"
                  map-type-id="terrain"
                  style="width: 500px; height: 300px"
                  ref="mapRef"
                >
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="true"
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
      number: 0,
      pin: 0,
      markers: [],
    }),
    methods: {
      place_changed: function (place) {
        console.log("place_changed!", place);

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
        let bindPromice = this.$store.dispatch('devices/BindDeviceToUser', {number: this.number, pin: this.pin});
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
