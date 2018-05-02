
<template>
  <div>
    <D_BIND_DEVICES> </D_BIND_DEVICES>

    <v-data-table
      :headers="headers"
      :items="devices"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.id_type }}</td>
        <td class="text-xs-right">{{ props.item.info }}</td>
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
          { text: 'Type', value: 'id_type' },
          { text: 'info', value: 'info' }
        ],
        devices: this.$store.getters.getDevices
      }
    },
    created(){

      }
  }
</script>

