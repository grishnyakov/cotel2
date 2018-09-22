
<template>
  <div >
    <D_BIND_DEVICES> </D_BIND_DEVICES>

    <v-data-table
      :headers="headers"
      :items="DEVICE_LIST"
      hide-actions
      class="elevation-1"
      no-data-text="Нет привязанных устройств"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.id_type }}</td>
        <td class="text-xs-left">{{ props.item.info }}</td>
        <td class="justify-center layout px-0">
          <C_DEVICE_SETTINGS v-bind:idDevice = "props.item.id"></C_DEVICE_SETTINGS>
        </td>
      </template>
    </v-data-table>
  </div>


</template>


<script>
  import D_BIND_DEVICES from "./D_BIND_DEVICES";
  import C_DEVICE_SETTINGS from "./C_DEVICE_SETTINGS";
  import {mapGetters, mapState} from 'vuex'

  export default {
    components: {D_BIND_DEVICES, C_DEVICE_SETTINGS},
    data () {
      return {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Тип устройсва', value: 'id_type' },
          { text: 'Информация', value: 'info' },
          { text: '', value: 'action', align: "center",sortable: false }
        ],
      }
    },
    computed: {
      ...mapState({
        DEVICE_LIST: state => state.devices.DEVICE_LIST,
        User: state => state.user.USER,
      }),
    },
    mounted(){
      let prom = this.$store.dispatch('devices/RequestNewDeviceList',this.User);
    }
  }
</script>

<style>
  .table__overflow{
    overflow: hidden;
  }
  .container{
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

