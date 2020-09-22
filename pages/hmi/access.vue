<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="6">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr
                :class="
                  securityAlarmTriggered.value
                    ? 'red'
                    : securityAlarmEnabled.value
                    ? 'blue'
                    : 'green'
                "
              >
                <td class="text-left">
                  <span class="title">Security Alarm</span>
                </td>
                <td class="text-right">
                  <span class="title">{{
                    securityAlarmTriggered.value
                      ? 'Triggered'
                      : securityAlarmEnabled.value
                      ? 'Enabled'
                      : 'Disabled'
                  }}</span>
                </td>
              </tr>
              <tr :class="fireAlarmTriggered.value ? 'red' : 'blue'">
                <td class="text-left">
                  <span class="title">Fire Alarm</span>
                </td>
                <td class="text-right">
                  <span class="title">{{
                    fireAlarmTriggered.value ? 'Triggered' : 'Enabled'
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
  asyncData({ store }) {
    const securityAlarmEnabled =
      store.state.variables.find((v) => v.name === 'securityAlarmEnabled') || {}
    const securityAlarmTriggered =
      store.state.variables.find((v) => v.name === 'securityAlarmTriggered') ||
      {}
    const fireAlarmTriggered =
      store.state.variables.find((v) => v.name === 'fireAlarmTriggered') || {}
    return { securityAlarmEnabled, securityAlarmTriggered, fireAlarmTriggered }
  },
  head: {
    title: 'Access',
  },
}
</script>
