
<template>
 <v-container class="scroll-y" style="overflow: hidden; max-height: max-content">

   <v-layout row wrap>

     <v-flex xs12>
       <v-card >
         <v-card-title primary-title>
           <div>
             <h3 class="headline mb-0">Состояния устройств</h3>
           </div>
         </v-card-title>
         <v-card-text>
           <T_DEVICES_STATE></T_DEVICES_STATE>
         </v-card-text>
       </v-card>
     </v-flex>

     <v-flex xs12>
       <v-card >
         <v-card-title primary-title>
           <div>
             <h3 class="headline mb-0">Сообщения от ваших устройств</h3>
           </div>
         </v-card-title>
         <v-card-text>
           <v-data-table
             :headers="headers"
             :items="messages"
             hide-actions
             class="elevation-1"
             :loading="isLoading"
           >
             <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
             <template slot="items" slot-scope="props">
               <td class="text-xs-left">{{ props.item.id }}</td>
               <td class="text-xs-left">{{ props.item.id_device }}</td>
               <td class="text-xs-left">{{ props.item.id_group }}</td>
               <td class="text-xs-left">{{ props.item.type_parametr }}</td>
               <td class="text-xs-left">{{ props.item.value }}</td>
             </template>
           </v-data-table>
         </v-card-text>
       </v-card>
     </v-flex>

   </v-layout>

  </v-container>

</template>


<script>
  import axios from 'axios';
  import T_DEVICES_STATE from "./T_DEVICES_STATE";

  export default {
    components: {T_DEVICES_STATE},
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
        isLoading: false
      }
    },
    mounted() {

      this.$store.getters.getIdDevices.then(
        result =>{
          this.isLoading = true;
          console.log("i try get messages");
          // Send a POST request
          let uri = 'http://localhost:7877/data/messages';
          axios.post(uri, {
            devices: result
          })
            .then(response => {

              this.isLoading = false;
              console.log(response);
              if (response.data.success) {
                this.messages = response.data.messages;
              }
            })
            .catch(function (error) {
              this.isLoading = false;
              console.error(error);

            });
        },
        error => {
          console.log("err", error);
        });


    }
  }

</script>

