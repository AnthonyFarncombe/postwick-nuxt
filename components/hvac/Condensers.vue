<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="toggleCondensersRunning"
          >{{ hvacRunning.value ? 'Stop' : 'Start' }} Condensers</v-btn
        >

        <v-data-table
          :items="condensers"
          :headers="condenserHeaders"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer
          :item-class="condenserItemClass"
        >
          <template v-slot:[`item.command`]="{ item }">
            {{
              (item.value & 0x40) > 0
                ? 'Disabled'
                : (item.value & 0x4) === 0
                ? 'Off'
                : condenserHeatingEnable.value
                ? 'Heat'
                : 'Cool'
            }}
          </template>

          <template v-slot:[`item.running`]="{ item }">
            {{ (item.value & 0x8) > 0 ? 'Running' : '' }}
          </template>

          <template v-slot:[`item.fault`]="{ item }">
            {{ (item.value & 0x10) > 0 ? 'In Fault' : '' }}
          </template>

          <template v-slot:[`item.defrost`]="{ item }">
            {{ (item.value & 0x20) > 0 ? 'Defrosting' : '' }}
          </template>

          <template v-slot:[`item.hours`]="{ item }">
            {{ getCondenserHours(item).value }} hours
          </template>

          <template v-slot:[`item.disable`]="{ item }">
            <v-btn @click="toggleCondenserDisable(item)">
              {{ (item.value & 0x40) > 0 ? 'Enable' : 'Disable' }}
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    hvacRunning: { value: false },
    condenserHeatingEnable: { value: false },
    condenserHeaders: [
      {
        text: 'Condenser',
        value: 'text',
      },
      {
        text: 'Command',
        value: 'command',
        align: 'center',
      },
      {
        text: 'Running',
        value: 'running',
        align: 'center',
      },
      {
        text: 'Fault',
        value: 'fault',
        align: 'center',
      },
      {
        text: 'Defrost',
        value: 'defrost',
        align: 'center',
      },
      {
        text: 'Hours',
        value: 'hours',
        align: 'center',
      },
      {
        text: 'Disable',
        value: 'disable',
        align: 'center',
      },
    ],
  }),
  computed: {
    condensers() {
      return this.$store.state.variables.filter((v) => v.group === 'condensers')
    },
  },
  created() {
    this.hvacRunning = this.$store.state.variables.find(
      (v) => v.name === 'hvacRunning'
    ) || { value: false }

    this.condenserHeatingEnable = this.$store.state.variables.find(
      (v) => v.name === 'condenserHeatingEnable'
    ) || { value: false }
  },
  methods: {
    toggleCondensersRunning() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleCondensers',
        value: true,
      })
    },
    getCondenserHours(condenser) {
      const name =
        condenser.name.substr(0, condenser.name.length - 'Status'.length) +
        'HoursRun'
      return (
        this.$store.state.variables.find((v) => v.name === name) || { value: 0 }
      )
    },
    toggleCondenserDisable(condenser) {
      const match = condenser.name.match(/^condenser(\d)Status/)
      const index = parseInt(match[1])
      this.$store.dispatch('setVariableValue', {
        name: 'toggleCondenserDisable',
        value: index,
      })
    },
    condenserItemClass(item) {
      if ((item.value & 0x40) > 0) {
        return 'grey' // Disabled
      } else if ((item.value & 0x10) > 0) {
        return 'yellow darken-1' // Fault
      } else if ((item.value & 0x20) > 0) {
        return 'purple' // Defrost
      } else if ((item.value & 0x8) === 0) {
        return 'red' // Off
      } else if (this.condenserHeatingEnable.value) {
        return 'orange' // Heating
      } else {
        return 'blue' // Cooling
      }
    },
  },
}
</script>
