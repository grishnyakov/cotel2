<template>
  <v-container grid-list-md text-xs-center style="overflow: hidden;">
    <v-layout row warp>

      <v-flex xs6>
        <v-text-field
          name="input-1"
          label="Название"
          id="testing"
          v-bind:value="orginfo.name"
        ></v-text-field>
      </v-flex>


      <v-flex xs6>
        <v-text-field
          name="input-phone"
          label="контактный телефон"
          class="input-group--focused"
          prepend-icon="phone"
          v-bind:value="orginfo.tel1"
          single-line
        ></v-text-field>
      </v-flex>

    </v-layout>

    <v-layout row wrap>

      <v-flex xs12>
        <v-text-field
          name="input-address"
          label="Адрес"
          v-bind:value="ORG_INFO.address"
          multi-line
        ></v-text-field>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>

  export default {
    data() {
      return {
        ORG_INFO: this.$store.state.ORG_INFO
      }
    },
    created() {
      this.$store.getters.GET_ORG_INFO;
      console.log("this.$store.getters.getOrgInfo", this.ORG_INFO);
    }
  }
</script>

