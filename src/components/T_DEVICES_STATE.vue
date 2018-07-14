<template>

  <v-data-table
    :headers="headers"
    :items="danger_list"
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
          :items="messages"
          v-bind:pagination.sync="paginationMessages"
          class="elevation-1"

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

  export default {

    data() {
      return {
        selectedDevices: [],
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
        danger_list: this.$store.state.DANGER_LIST,  //состояния устройств
        messages: this.$store.state.MESSAGE_LIST,  //массим объектов групп сообщений с параметрами
        isLoadingMessages: false,
        expandedId: false,  //развернутый id
        id_device: 0
      }
    },
    created() {
      this.reqStateDevices();
    },
    methods: {
      reqStateDevices() {
        this.$store.getters.GET_DANGER_LIST.then(list_d => {
          this.danger_list = list_d;
        });
      },
      reqMessages() {
        let idDevice = this.expandedId;
        console.log("idDevice", idDevice);
        if (!idDevice) return;
        this.isLoadingMessages = true;
        this.$store.getters.GET_MESSAGE_LIST(idDevice).then(list_m => {
          if (list_m) {
            this.messages = list_m;
          }
          this.isLoadingMessages = false;
        }).catch(err => {
          this.isLoadingMessages = false;
        });
      },
    }
  }
</script>

