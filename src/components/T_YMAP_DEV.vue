<template>
  <yandex-map
    :coords="[55.33868,65.276724]"
    zoom="10"
    style="width: 600px; height: 600px;"
    :cluster-options="{

  }"
    :behaviors="['default']"
    :controls="['zoomControl','searchControl','geolocationControl']"
    :placemarks="placemarks"
    map-type="map"
  >
  </yandex-map>
</template>

<script>
  //https://www.npmjs.com/package/vue-yandex-maps

  // or for a single instance
  import {yandexMap, ymapMarker} from 'vue-yandex-maps'

  export default {
    name: "T_YMAP_DEV",
    data: () => ({
      placemarks: [
        {
          feature:"Место установки устрйоства",
          coords: [55.33868,65.276724],
          properties: {
            iconCaption  : 'hint-content',
          }, // define properties here
          options: {
            draggable: true
          }, // define options here
          clusterName: "1",

          callbacks: {
            click: function () {

            },
            dragend: (arg)=> {
              const t = arg.originalEvent.target;
              t.properties.set('iconCaption', t.geometry._bounds[1].toString());
              debugger
            }, // По окончании перемещения метки вызываем функцию отрисовки адреса
            dragstart: (arg)=> {
              const t = arg.originalEvent.target;
              //console.log(t);
            }// // При перемещении метки сбрасываем подпись, содержимое балуна и перекрашиваем метку.
          }
        }
      ]
    }),
    components: {yandexMap, ymapMarker}
  }
</script>

<style scoped>

</style>
