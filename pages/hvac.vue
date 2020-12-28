<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>General</v-tab>
      <v-tab>Sensors</v-tab>
      <v-tab>Dampers</v-tab>
      <v-tab>Fans</v-tab>
      <v-tab>Condensers</v-tab>
      <v-tab>Foyer</v-tab>
      <v-tab>Toilets</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="6" xl="4">
              <HvacControl />
            </v-col>

            <v-col cols="12" sm="12" md="8" lg="6" xl="4">
              <MeetingSize />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <Sensors />
      </v-tab-item>

      <v-tab-item>
        <Dampers />
      </v-tab-item>

      <v-tab-item>
        <AhuFans />
      </v-tab-item>

      <v-tab-item>
        <Condensers />
      </v-tab-item>

      <v-tab-item>
        <FoyerCassettes />
      </v-tab-item>

      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12" lg="5">
              <ToiletHeaters />
            </v-col>
            <v-col cols="12" lg="7">
              <ToiletExtractFans />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import HvacControl from '@/components/hvac/HvacControl'
import MeetingSize from '@/components/hvac/MeetingSize'
import Sensors from '@/components/hvac/Sensors'
import Dampers from '@/components/hvac/Dampers'
import AhuFans from '@/components/hvac/AhuFans'
import Condensers from '@/components/hvac/Condensers'
import FoyerCassettes from '@/components/hvac/FoyerCassettes'
import ToiletHeaters from '@/components/hvac/ToiletHeaters'
import ToiletExtractFans from '@/components/hvac/ToiletExtractFans'

export default {
  layout: 'hmi',
  components: {
    HvacControl,
    MeetingSize,
    Sensors,
    Dampers,
    AhuFans,
    Condensers,
    FoyerCassettes,
    ToiletHeaters,
    ToiletExtractFans,
  },
  data: () => ({
    tab: null,
  }),
  head: {
    title: 'HVAC',
  },
}
</script>
