<template>

  <v-data-table
    :headers="headers"
    :items="ALERT_LIST"
    hide-actions
    class="elevation-1"
    item-key="id_device"
    v-model="selectedDevices"
    v-bind:pagination.sync="pagination"
  >

    <template slot="items" slot-scope="props">
      <tr
        @click="props.expanded = !props.expanded; if(props.expanded) {expandedId=props.item.id_device; reqMessages(); } else expandedId=false;">
        <td>
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td class="text-xs-left">{{ props.item.id_device }}</td>
        <td class="text-xs-left">{{props.item.time | formatDate}}</td>
        <td class="text-xs-center">
          <div v-if="props.item.id_danger == 1">
            <v-btn color="success" dark>OK
              <v-icon dark right>done</v-icon>
            </v-btn>
          </div>
          <div v-else-if="props.item.id_danger == 2">
            <v-btn color="red accent-4" dark>АВАРИЯ: {{props.item.id_danger}}
              <v-icon dark right>warning</v-icon>
            </v-btn>
          </div>
          <div v-else-if="props.item.id_danger == 3">
            <v-btn color="orange accent-4" dark>ВНИМАНИЕ: {{props.item.id_danger}}
              <v-icon dark right>warning</v-icon>
            </v-btn>
          </div>
        </td>
      </tr>
    </template>

    <template slot="expand" slot-scope="props">
      <v-flex xs12 class="orange">
        <!--:loading="isLoadingMessages"-->
        <v-data-table
          :headers="headersMessages"
          :items="MESSAGE_LIST"
          v-bind:pagination.sync="paginationMessages"
          class="elevation-1"
          no-data-text="Нет сообщений от устройств"
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.id_group}}</td>
            <td class="text-xs-left">{{ props.item.time | formatDate}}</td>
            <td class="text-xs-left">{{ props.item.t1 }}</td>
            <td class="text-xs-left">{{ props.item.t2 }}</td>
            <td class="text-xs-center">
              <div v-if="props.item.vv == 1">
                <v-btn color="success accent-4" dark>{{props.item.vv}}

                </v-btn>
              </div>
              <div v-else-if="props.item.vv == 0">
                <v-btn color="red accent-4" dark>{{props.item.vv}}
                  <v-icon dark right>warning</v-icon>
                </v-btn>
              </div>

            </td>
            <td class="text-xs-center">

              <div v-if="props.item.ee == 1">
                <v-btn color="success accent-4" dark>{{props.item.ee}}

                </v-btn>
              </div>
              <div v-else-if="props.item.ee == 0">
                <v-btn color="red accent-4" dark>{{props.item.ee}}
                  <v-icon dark right>warning</v-icon>
                </v-btn>
              </div>
            </td>

          </template>
        </v-data-table>

      </v-flex>
    </template>


  </v-data-table>

</template>


<script>
  import {mapState} from "vuex";
  export default {

    data() {
      return {
        selectedDevices: [],
        intervalID: null,
        intervalIDMessages: null,
        headers: [
          {text: '', value: 'check', sortable: false},
          {text: 'ID устройства', value: 'id_device', sortable: false},
          {text: 'Время последнего отклика', align: "left", value: 'time', sortable: false},
          {text: 'Состояние', value: 'id_danger', sortable: true, align: "center"}
        ],
        pagination: {'sortBy': 'id_danger', 'descending': true, 'rowsPerPage': -1},
        headersMessages: [

          {text: '№', value: 'id_group', sortable: false},
          {text: 'Время', value: 'time', sortable: true},
          {text: 'ТП', value: 't1', sortable: false},//температура помещения,
          {text: 'ТТ', value: 't2', sortable: false},// температура теплоносителя,
          {text: 'Протечка', value: 'vv', align: "center", sortable: false},
          {text: 'Эл-во', value: 'ee', align: "center", sortable: false},
        ],
        paginationMessages: {'sortBy': 'time', 'descending': true, 'rowsPerPage': -1},
        isLoadingMessages: false,
        expandedId: false,  //развернутый id
        id_device: 0
      }
    },
    computed:{
      ...mapState({
        DEVICE_LIST: state => state.devices.DEVICE_LIST,
        ALERT_LIST: state => state.devices.ALERT_LIST,
        MESSAGE_LIST: state => state.devices.MESSAGE_LIST,
        User: state => state.user.USER,
      }),
    },
    created() {
      let self = this;
      this.intervalID = setInterval(function() { self.$store.dispatch('devices/RequestNewAlertList') },   5000);
      this.intervalIDMessages = setInterval(function() { self.reqMessages() },   5000);
    },
    destroyed(){
      clearInterval(this.intervalID);
      clearInterval(this.intervalIDMessages);
    },
    methods: {
      reqMessages() {
        if (!this.expandedId) return;

        this.isLoadingMessages = true;
        let prom = this.$store.dispatch('devices/RequestNewMessageList',this.expandedId);
        prom.then(result => {
          this.isLoadingMessages = false;
        }).catch(err => {
          this.isLoadingMessages = false;
        });
      },
    }
  }
</script>

