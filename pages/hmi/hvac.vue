<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="3">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr :class="hvacRunning.value ? 'green' : 'red'">
                <td class="text-left">
                  <span class="title"
                    >HVAC {{ hvacRunning.value ? 'Running' : 'Off' }}</span
                  >
                </td>
                <td class="text-right">
                  <v-btn @click="toggleHvacRunning"
                    >Turn {{ hvacRunning.value ? 'Off' : 'On' }}</v-btn
                  >
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span class="title">HVAC Set Point Temperature</span>
                </td>
                <td class="text-right">
                  <v-btn
                    fab
                    x-small
                    color="primary"
                    class="mx-1"
                    :disabled="hvacSetPoint.value - 5 < minSetPoint"
                    @click="modifySetPoint(-5)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    x-small
                    color="primary"
                    class="mx-1"
                    :disabled="hvacSetPoint.value + 5 > maxSetPoint"
                    @click="modifySetPoint(5)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <span class="title"
                    >{{ (hvacSetPoint.value / 10).toFixed(1) }}°C</span
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col sm="12" md="8" lg="6" xl="3">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <th class="text-left pa-4">Sensor</th>
              <th class="text-right pa-4">Value</th>
            </thead>
            <tbody>
              <tr v-for="sensor in sensors" :key="sensor.name">
                <td class="text-left">{{ sensor.text }}</td>
                <td class="text-right">
                  {{ (sensor.value / 10).toFixed(1) }} °C
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'hmi',
  data: () => ({
    hvacRunning: {},
    hvacSetPoint: {},
    minSetPoint: 160,
    maxSetPoint: 240,
  }),
  computed: {
    sensors() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'temperatureSensors'
      )
    },
  },
  created() {
    this.hvacRunning = this.$store.state.variables.find(
      (v) => v.name === 'hvacRunning'
    ) || { value: false }

    this.hvacSetPoint = this.$store.state.variables.find(
      (v) => v.name === 'hvacSetPoint'
    ) || { value: 200 }
  },
  methods: {
    toggleHvacRunning() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleHvacRunning',
        value: true,
      })
    },
    modifySetPoint(val) {
      const newSetPoint = this.hvacSetPoint.value + val
      if (newSetPoint >= this.minSetPoint && newSetPoint <= this.maxSetPoint) {
        this.$store.dispatch('setVariableValue', {
          name: 'hvacSetPoint',
          value: newSetPoint,
        })
      }
    },
  },
  head: {
    title: 'HVAC',
  },
}
</script>
