
<template>




  <div>
    <v-data-table
      :headers="headers"
      :items="danger_list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props" >
        <td class="text-xs-left">{{ props.item.id_device }}</td>
        <td class="text-xs-left">{{props.item.time | formatDate}}</td>
        <td class="text-xs-left">
          <div v-if="props.item.id_danger == 0">
            <v-btn color="success" dark>OK
              <v-icon dark right>done</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <v-btn color="orange accent-4" dark>АВАРИЯ: {{props.item.id_danger}}
              <v-icon dark right>warning</v-icon>
            </v-btn>
          </div>
        </td>

      </template>
    </v-data-table>
  </div>


</template>


<script>
  import axios from 'axios';

  export default {

    data () {
      return {
        headers: [
          { text: 'ID устройства', value: 'id_device' ,color:"success"},
          { text: 'Время последнего отклика', value: 'time' },
          { text: 'Состояние', value: 'id_danger'},
          { text: '', value: ''}
        ],
        danger_list: []
      }
    },
    created(){
      this.reqStateDevices();
    },
    methods:{
      reqStateDevices(){
      this.$store.getters.getIdDevices.then(
        result => {
          console.log("i try get danger list");
          // Send a POST request
          let uri = 'http://localhost:7877/data/dangerlist';
          axios.post(uri,{
            devices: result
          })
            .then(response => {
              console.log(response);
              if(response.data.success) {
                this.danger_list = response.data.danger_list;
              }
              setTimeout(this.reqStateDevices,3000);
            })
            .catch(function (error) {
              console.error(error);
            });


        },
        error => {
          console.log("err", error);
        });
    }
    }
  }
</script>

