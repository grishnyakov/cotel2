
<template>
  <div >
    <D_BIND_DEVICES> </D_BIND_DEVICES>

    <v-data-table
      :headers="headers"
      :items="devices"
      hide-actions
      class="elevation-1"

    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.id_type }}</td>
        <td class="text-xs-left">{{ props.item.info }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" >
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" >
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>


</template>


<script>
  import D_BIND_DEVICES from "./D_BIND_DEVICES";
  export default {
    components: {D_BIND_DEVICES},
    data () {
      return {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Тип устройсва', value: 'id_type' },
          { text: 'Информация', value: 'info' },
          { text: 'Действия', value: 'action' }
        ],
        devices: this.$store.state.DEVICE_LIST
      }
    },
    mounted(){
       this.$store.getters.GET_DEVICE_LIST.then(
        result => {
          this.devices = result;
          console.log("this devices",this.devices );
        },
          error => {
            console.log("err", error );
          });

    }
  }
</script>

<style>
  .table__overflow{
    overflow: hidden;
  }
</style>

