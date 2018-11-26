

<template>

       <v-card >

           <T_DEVICES_STATE></T_DEVICES_STATE>

       </v-card>

</template>


<script>
  import T_DEVICES_STATE from "./T_DEVICES_STATE";

  import T_LINE_CHART from "./T_LINE_CHART";


  export default {
    components: {T_DEVICES_STATE,T_LINE_CHART},

    data() {
      return {
        headers: [
          {text: 'ID', value: 'id'},
          {text: 'Device', value: 'id_device'},
          {text: 'Time', value: 'id_group'},
          {text: 'Type', value: 'type_parametr'},
          {text: 'Value', value: 'value'}
        ],
        messages: [],

        chartData: {
          labels: ['18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50'],
          datasets: [
            {
              label: 'DEVICE 1',
              borderColor: '#8dc2ef',
              fill: false,

              data: [40, 41, 43,42,45,40,39,38,50,52,55]
            },
            {
              label: 'DEVICE 2',
              borderColor: '#f87979',
              fill: false,
              data: [40, 35,33,32,35,36,47,23,64,43,74]
            }
          ]
        }
      }
    },
    mounted() {

    }
  }

</script>

