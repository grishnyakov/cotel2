<template>
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      nudge-left="1"
      bottom left offset-y
      :nudge-width="200"
    >
      <v-btn
        slot="activator"
        color="indigo"
        dark
      >
        Настройка параметров
      </v-btn>

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Параметры устройства № {{idDevice}}</v-list-tile-title>
              <v-list-tile-sub-title>Значения будут сохранены при следующем установлении соединения с устройством
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list style="padding-top: 20px">

          <v-list-tile>
            <v-layout row wrap>
              <v-flex  sm5>
                <v-text-field
                  v-model="t1u"
                  label = "Темп. теплоносителя"
                  suffix="°C"
                ></v-text-field>
              </v-flex>
              <v-flex sm1>

              </v-flex>
              <v-flex  sm5>
                <v-text-field
                  v-model="t2u"
                  label = "Темп. помещения"
                  suffix="°C"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-list-tile>


          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="message" color="blue"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Тревога при протечке (vv)</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="blue"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Тревога при отключении электроэнергии (ee)</v-list-tile-title>
          </v-list-tile>


          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="blue"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Отправлять СМС при тревоге (su)</v-list-tile-title>
          </v-list-tile>

        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="menu = false">Отмена</v-btn>
          <v-btn color="primary" flat @click="menu = false">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: "C_DEVICE_SETTINGS",
    data: () => ({
      fav: true,
      menu: false,
      message: true,
      hints: true,
      t1u: 44,
      t2u: 25

    }),
    props: {
      idDevice: Number
    }
  }
</script>

<style scoped>

</style>
