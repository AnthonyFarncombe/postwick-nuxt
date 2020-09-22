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
  },
  head: {
    title: 'Water',
  },
}
</script>
