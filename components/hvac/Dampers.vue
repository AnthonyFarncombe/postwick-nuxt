<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <v-data-table
          :items="dampers"
          :headers="damperHeaders"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer
        >
          <template v-slot:[`item.command`]="{ value }">
            {{ value.value }}%
          </template>

          <template v-slot:[`item.status`]="{ value }">
            {{ value.value }}%
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dampers: [],
    damperHeaders: [
      {
        text: 'Damper',
        value: 'text',
      },
      {
        text: 'Command',
        value: 'command',
        align: 'center',
      },
      {
        text: 'Status',
        value: 'status',
        align: 'center',
      },
    ],
  }),
  created() {
    const dampers = this.$store.state.variables.filter(
      (v) => v.group === 'dampers'
    )

    this.dampers = dampers.map((d) => ({
      text: d.text,
      command: this.$store.state.variables.find(
        (v) => v.name === d.name.replace('Status', 'Cmd')
      ),
      status: d,
    }))
  },
}
</script>
