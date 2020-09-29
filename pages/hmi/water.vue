<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="6">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr
                v-for="sensor in moistureSensors"
                :key="sensor.name"
                :class="sensor.value ? 'green' : 'red'"
              >
                <td class="text-left">
                  <span class="title">Moisture Sensor {{ sensor.text }}</span>
                </td>
                <td class="text-right">
                  <span class="title">{{
                    sensor.value ? 'Dry' : 'Triggered'
                  }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col sm="6" md="4" lg="3">
        <v-card :color="waterSolenoidColor">
          <v-card-title>
            <h4>Water Solenoid</h4>
          </v-card-title>

          <v-divider />

          <v-radio-group
            :value="waterSolenoidMode.value"
            column
            class="ml-4"
            @change="modeChange"
          >
            <v-radio
              :label="`Auto (${waterSolenoidStatus.value ? 'On' : 'Off'})`"
              :value="0"
              class="my-2"
            />
            <v-radio label="Off" :value="1" class="my-2" />
            <v-radio label="On" :value="2" class="my-2" />
          </v-radio-group>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'hmi',
  computed: {
    moistureSensors() {
      return this.$store.state.variables.filter((v) => v.group === 'water')
    },
    waterSolenoidStatus() {
      return (
        this.$store.state.variables.find(
          (v) => v.name === 'waterSolenoidStatus'
        ) || { value: false }
      )
    },
    waterSolenoidMode() {
      return (
        this.$store.state.variables.find(
          (v) => v.name === 'waterSolenoidMode'
        ) || { value: 0 }
      )
    },
    waterSolenoidColor() {
      switch (this.waterSolenoidMode.value) {
        case 1:
          return 'red'
        case 2:
          return 'green'
        default:
          return this.waterSolenoidStatus.value ? 'green' : 'red'
      }
    },
  },
  methods: {
    modeChange(value) {
      this.$store.dispatch('setVariableValue', {
        name: 'waterSolenoidMode',
        value,
      })
    },
  },
  head: {
    title: 'Water',
  },
}
</script>
