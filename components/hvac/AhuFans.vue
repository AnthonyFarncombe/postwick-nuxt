<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <v-btn :disabled="hvacRunning.value" @click="toggleFans"
          >{{ supplyAirCommand.value > 0 ? 'Stop' : 'Start' }} Fans</v-btn
        >
        <v-data-table
          :items="fans"
          :headers="fanHeaders"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer
          :item-class="fanItemClass"
        >
          <template v-slot:[`item.speed`]="{ item }">
            {{ (getFanCommand(item).value / 100).toFixed(0) }}%
          </template>

          <template v-slot:[`item.fault`]="{ item }">
            {{ item.value ? 'In Fault' : 'OK' }}
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title>
            <h4>Fan Speed</h4>
          </v-card-title>

          <v-divider />

          <v-switch
            v-model="fanSpeedOverrideSwitch"
            label="Fan Speed Override"
          />

          <v-slider
            class="mt-5"
            thumb-label="always"
            :disabled="!fanSpeedOverride.value"
            :value="fanSpeedManual.value"
            @change="changeFanSpeedManual"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    hvacRunning: {},
    fans: [],
    fanSpeedOverride: { value: false },
    fanSpeedManual: { value: 30 },
    fanSpeedAuto: { value: 0 },
    supplyAirCommand: {},
    returnAirCommand: {},
    fanHeaders: [
      {
        text: 'Fan',
        value: 'text',
      },
      {
        text: 'Requested Speed',
        value: 'speed',
        align: 'center',
      },
      {
        text: 'Status',
        value: 'fault',
        align: 'center',
      },
    ],
  }),
  computed: {
    fanSpeedOverrideSwitch: {
      get() {
        return this.fanSpeedOverride.value
      },
      set(value) {
        this.$store.dispatch('setVariableValue', {
          name: 'fanSpeedOverride',
          value,
        })
        if (value) {
          const fanSpeedAuto = this.$store.state.variables.find(
            (v) => v.name === 'fanSpeedAuto'
          )
          if (fanSpeedAuto)
            this.$store.dispatch('setVariableValue', {
              name: 'fanSpeedManual',
              value: fanSpeedAuto.value,
            })
        }
      },
    },
  },
  created() {
    this.hvacRunning = this.$store.state.variables.find(
      (v) => v.name === 'hvacRunning'
    ) || { value: false }

    this.fans = this.$store.state.variables.filter((v) => v.group === 'fans')

    const fanSpeedOverride = this.$store.state.variables.find(
      (v) => v.name === 'fanSpeedOverride'
    )
    if (fanSpeedOverride) {
      this.fanSpeedOverride = fanSpeedOverride
    }

    this.fanSpeedManual = this.$store.state.variables.find(
      (v) => v.name === 'fanSpeedManual'
    ) || { value: 30 }

    this.fanSpeedAuto = this.$store.state.variables.find(
      (v) => v.name === 'fanSpeedAuto'
    ) || { value: 0 }

    this.supplyAirCommand = this.$store.state.variables.find(
      (v) => v.name === 'supplyAirCommand'
    ) || { value: 0 }

    this.returnAirCommand = this.$store.state.variables.find(
      (v) => v.name === 'returnAirCommand'
    ) || { value: 0 }
  },
  methods: {
    toggleFans() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleAhuFans',
        value: true,
      })
    },
    getFanCommand(fan) {
      if (fan.name.substr(0, 6) === 'supply') {
        return this.supplyAirCommand
      } else if (fan.name.substr(0, 6) === 'return') {
        return this.returnAirCommand
      }
      return { value: 0 }
    },
    changeFanSpeedManual(value) {
      this.$store.dispatch('setVariableValue', {
        name: 'fanSpeedManual',
        value,
      })
    },
    fanItemClass(item) {
      if (item.value) {
        return 'orange'
      } else if (this.getFanCommand(item).value) {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
}
</script>
