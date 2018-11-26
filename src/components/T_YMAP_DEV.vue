<template>
  <div>
    <yandex-map
      :coords="[55.33868,65.276724]"
      zoom="10"
      style="width: 600px; height: 600px;"
      :cluster-options="{

  }"
      :behaviors="['default']"
      :controls="['zoomControl','searchControl','geolocationControl']"
      map-type="map"
    >

      <ymap-marker
        marker-id="1"
        marker-type="placemark"
        :coords="[55.33868,65.276724]"
        hint-content="Hint content 1"
        :callbacks="{dragend: dragend}"
        :options="{draggable: true}"
        cluster-name="1"
      ></ymap-marker>
    </yandex-map>


  </div>

</template>

<script>
  //https://www.npmjs.com/package/vue-yandex-maps

  // or for a single instance
  import {yandexMap, ymapMarker} from 'vue-yandex-maps'
  import Vue from 'vue'


  export default {
    name: "T_YMAP_DEV",
    props: ["currentPlace"],
    data: () => ({
      placemarks: [
        {
          coords: [54.8, 39.8],
          properties: {}, // define properties here
          options: {}, // define options here
          clusterName: "1",
          balloonTemplate: '<div>"Your custom template"</div>',
          callbacks: {
            click: function () {
            }
          }
        }
      ]
    }),
    methods: {
      dragend: function(arg) {
        let t = arg.originalEvent.target;
        t.properties.set('iconCaption', t.geometry._bounds[1].toString());
        this.$emit('setGeometry',t.geometry);
      },
    }
    ,
    mounted() {

    },
    components: {
      yandexMap, ymapMarker
    }
  }
</script>

<style scoped>

</style>
