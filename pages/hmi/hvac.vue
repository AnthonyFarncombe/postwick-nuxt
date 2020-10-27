<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>General</v-tab>
      <v-tab>Sensors</v-tab>
      <v-tab>Condensers</v-tab>
      <v-tab>Fans</v-tab>
      <v-tab>Foyer</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="6" xl="4">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr :class="hvacRunning.value ? 'green' : 'red'">
                      <td class="text-left">
                        <span class="title"
                          >HVAC
                          {{ hvacRunning.value ? 'Running' : 'Off' }}</span
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
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-simple-table style="max-width: 360px">
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
      </v-tab-item>

      <v-tab-item>
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
              (item.value & 0x4) === 0
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

          <template v-slot:[`item.hours`]> 0 </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
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
                  {{ getFanCommand(item).value }}
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

                <v-radio-group
                  :value="meetingSize.value"
                  column
                  class="ml-4"
                  @change="changeMeetingSize"
                >
                  <v-radio label="Manual" :value="0" class="my-2" />
                  <v-radio label="Auto" :value="1" class="my-2" />
                  <v-radio label="Local" :value="2" class="my-2" />
                  <v-radio label="City" :value="3" class="my-2" />
                  <v-radio label="Interchange" :value="4" class="my-2" />
                  <v-radio label="Full" :value="5" class="my-2" />
                </v-radio-group>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-data-table
          :items="cassettes"
          :headers="cassetteHeaders"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer
          :item-class="cassetteItemClass"
        >
          <template v-slot:[`item.command`]="{ item }">
            {{ (item.value & 0x4) > 0 ? 'Requesting' : 'No Command' }}
          </template>

          <template v-slot:[`item.running`]="{ item }">
            {{ (item.value & 0x8) > 0 ? 'Running' : 'Off' }}
          </template>

          <template v-slot:[`item.fault`]="{ item }">
            {{ (item.value & 0x10) > 0 ? 'Fault' : 'OK' }}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <v-btn @click="toggleCassette(item)"
              >Turn {{ (item.value & 0x8) > 0 ? 'Off' : 'On' }}</v-btn
            >
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  layout: 'hmi',
  data: () => ({
    tab: null,
    hvacRunning: {},
    hvacSetPoint: {},
    condenserHeatingEnable: {},
    fans: [],
    supplyAirCommand: {},
    returnAirCommand: {},
    minSetPoint: 160,
    maxSetPoint: 240,
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
    ],
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
    meetingSize: { value: 0 },
    cassettes: [],
    cassetteHeaders: [
      {
        text: 'Cassette',
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
        text: 'Action',
        value: 'action',
        align: 'center',
      },
    ],
  }),
  computed: {
    sensors() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'temperatureSensors'
      )
    },
    condensers() {
      return this.$store.state.variables.filter((v) => v.group === 'condensers')
    },
  },
  created() {
    this.hvacRunning = this.$store.state.variables.find(
      (v) => v.name === 'hvacRunning'
    ) || { value: false }

    this.hvacSetPoint = this.$store.state.variables.find(
      (v) => v.name === 'hvacSetPoint'
    ) || { value: 200 }

    this.condenserHeatingEnable = this.$store.state.variables.find(
      (v) => v.name === 'condenserHeatingEnable'
    ) || { value: false }

    this.fans = this.$store.state.variables.filter((v) => v.group === 'fans')

    this.meetingSize = this.$store.state.variables.find(
      (v) => v.name === 'meetingSize'
    ) || { value: 0 }

    this.supplyAirCommand = this.$store.state.variables.find(
      (v) => v.name === 'supplyAirCommand'
    ) || { value: 0 }

    this.returnAirCommand = this.$store.state.variables.find(
      (v) => v.name === 'returnAirCommand'
    ) || { value: 0 }

    this.cassettes = this.$store.state.variables.filter(
      (v) => v.group === 'cassettes'
    )
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
    getFanCommand(fan) {
      if (fan.name.substr(0, 6) === 'supply') {
        return this.supplyAirCommand
      } else if (fan.name.substr(0, 6) === 'return') {
        return this.returnAirCommand
      }
      return { value: 0 }
    },
    changeMeetingSize(value) {
      this.$store.dispatch('setVariableValue', {
        name: 'meetingSize',
        value,
      })
    },
    toggleCassette(item) {
      const name =
        'toggle' +
        item.name[0].toUpperCase() +
        item.name.substr(1, item.name.length - 7) +
        's'
      this.$store.dispatch('setVariableValue', { name, value: true })
    },
    condenserItemClass(item) {
      if ((item.value & 0x10) > 0) {
        return 'orange'
      } else if ((item.value & 0x20) > 0) {
        return 'blue'
      } else if ((item.value & 0x8) > 0) {
        return 'green'
      } else {
        return 'red'
      }
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
    cassetteItemClass(item) {
      if ((item.value & 0x10) > 0) {
        return 'orange'
      } else if ((item.value & 0x8) > 0) {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
  head: {
    title: 'HVAC',
  },
}
</script>
