<template>
  <v-data-table
    :headers="headers"
    :items="schedules"
    disable-pagination
    disable-sort
    hide-default-footer
    class="elevation-1"
    @click:row="editSchedule"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Schedules</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <ScheduleDialog
          :dialog="dialog"
          :schedule="editedSchedule"
          @toggle="dialog = !dialog"
        />
      </v-toolbar>
    </template>

    <template v-slot:[`item.frequency`]="{ value }">
      {{ frequencyOptions.find((o) => o.value === value).text }}
    </template>

    <template v-slot:[`item.nextDate`]="{ value }">
      {{ value | formatDate }}
    </template>

    <template v-slot:[`item.overrideDay`]="{ value }">
      {{ value ? 'Yes' : 'No' }}
    </template>

    <template v-slot:[`item.meetingSize`]="{ value }">
      {{ meetingSizeToString(value) }}
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import ScheduleDialog from '@/components/ScheduleDialog'

export default {
  layout: 'hmi',
  components: {
    ScheduleDialog,
  },
  filters: {
    formatDate(value) {
      return value && dayjs(value).format('DD MMMM YYYY')
    },
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Day of Week',
        value: 'dayOfWeek',
        align: 'center',
      },
      {
        text: 'Time of Meeting',
        value: 'timeOfMeeting',
        align: 'center',
      },
      {
        text: 'Frequency',
        value: 'frequency',
        align: 'center',
      },
      {
        text: 'Next Date',
        value: 'nextDate',
        align: 'center',
      },
      {
        text: 'Override Day',
        value: 'overrideDay',
        align: 'center',
      },
      {
        text: 'Meeting Size',
        value: 'meetingSize',
        align: 'center',
      },
    ],
    editedSchedule: {},
    timeOfMeetingMenuModel: false,
  }),
  computed: mapState([
    'schedules',
    'daysOfTheWeek',
    'meetingSizes',
    'frequencyOptions',
  ]),
  methods: {
    meetingSizeToString(value) {
      const meetingSize = this.meetingSizes.find((s) => s.value === value)
      return (meetingSize && meetingSize.text) || 'Unknown'
    },
    editSchedule(schedule) {
      this.editedSchedule = schedule
      this.dialog = true
    },
  },
  head: {
    title: 'Calendar',
  },
}
</script>
