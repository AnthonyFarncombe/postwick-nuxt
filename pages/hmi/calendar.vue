<template>
  <v-data-table
    :headers="headers"
    :items="schedules"
    :disable-pagination="true"
    :disable-sort="true"
    class="elevation-1"
    @click:row="editSchedule"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Schedules</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" :persistent="true">
          <template v-slot:activator="{ on }">
            <v-btn color="default" dark class="mb-2" v-on="on"
              >New Schedule</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="editedSchedule.dayOfWeek"
                      :items="daysOfTheWeek"
                      label="Day of the week"
                      :error="errors.dayOfWeek"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-menu
                      ref="timeOfMeetingMenuRef"
                      v-model="timeOfMeetingMenuModel"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedSchedule.timeOfMeeting"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="editedSchedule.timeOfMeeting"
                          label="Time of Meeting"
                          readonly
                          :error="errors.timeOfMeeting"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="timeOfMeetingMenuModel"
                        v-model="editedSchedule.timeOfMeeting"
                        format="24hr"
                        full-width
                        @click:minute="
                          $refs.timeOfMeetingMenuRef.save(
                            editedSchedule.timeOfMeeting
                          )
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="editedSchedule.frequency"
                      :items="frequencyOptions"
                      item-text="text"
                      item-value="value"
                      label="Frequency"
                      :error="errors.frequency"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row
                  v-if="['0', '2', '3'].includes(editedSchedule.frequency)"
                >
                  <v-col cols="12">
                    <v-select
                      v-model="editedSchedule.startDate"
                      :items="startDates"
                      item-text="text"
                      item-value="value"
                      label="Start Date"
                      :error="errors.startDate"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-switch
                      v-model="editedSchedule.overrideDay"
                      label="Override all other schedules for the day"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-1" @click="deleteSchedule">Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" :disabled="formInvalid" @click="save"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.frequency`]="{ value }">
      {{ frequencyOptions.find((o) => o.value === value).text }}
    </template>
    <template v-slot:[`item.startDate`]="{ value }">
      {{ formatStartDate(value) }}
    </template>
    <template v-slot:[`item.overrideDay`]="{ value }">
      {{ value ? 'Yes' : 'No' }}
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment'

export default {
  layout: 'hmi',
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Day of Week',
        value: 'dayOfWeek',
      },
      {
        text: 'Time of Meeting',
        value: 'timeOfMeeting',
      },
      {
        text: 'Frequency',
        value: 'frequency',
      },
      {
        text: 'Start Date',
        value: 'startDate',
      },
      {
        text: 'Override Day',
        value: 'overrideDay',
      },
    ],
    editedIndex: -1,
    editedSchedule: {},
    defaultSchedule: {},
    daysOfTheWeek: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    timeOfMeetingMenuModel: false,
  }),
  computed: {
    schedules() {
      return this.$store.state.schedules
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Schedule' : 'Edit Schedule'
    },
    frequencyOptions() {
      const options = [
        { value: '0', text: 'One Off' },
        { value: '1', text: 'Every Week' },
        { value: '2', text: 'Every Other Week' },
        { value: '3', text: 'Every Three Weeks' },
        { value: 'CM', text: 'Care Meeting' },
      ]
      if (this.editedSchedule.dayOfWeek === 'Saturday')
        options.push({ value: 'CM', text: 'Care Meeting' })
      return options
    },
    startDates() {
      const dates = []

      if (
        !this.editedSchedule.dayOfWeek ||
        !this.editedSchedule.frequency ||
        ['1', 'CM'].includes(this.editedSchedule.frequency)
      ) {
        return dates
      }

      const today = moment().utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })

      const firstDate = today.add(
        (this.daysOfTheWeek.indexOf(this.editedSchedule.dayOfWeek) +
          7 -
          today.day()) %
          7,
        'days'
      )

      const frequency = parseInt(this.editedSchedule.frequency) || 4

      for (let i = 0; i < frequency; i++) {
        const date = firstDate.clone().add(i, 'weeks')
        dates.push({
          value: date.toISOString(),
          text: date.format('dddd, Do MMM YYYY'),
        })
      }

      return dates
    },
    errors() {
      return {
        dayOfWeek: !this.editedSchedule.dayOfWeek,
        timeOfMeeting: !this.editedSchedule.timeOfMeeting,
        frequency: !this.editedSchedule.frequency,
        startDate:
          !this.editedSchedule.startDate &&
          ['0', '2', '3'].includes(this.editedSchedule.frequency),
      }
    },
    formInvalid() {
      return (
        this.errors.dayOfWeek ||
        this.errors.timeOfMeeting ||
        this.errors.frequency ||
        this.errors.startDate
      )
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    'editedSchedule.dayOfWeek'(newVal) {
      if (newVal !== 'Saturday' && this.editedSchedule.frequency === 'CM')
        this.editedSchedule.frequency = '1'
    },
    'editedSchedule.frequency'(newVal) {
      this.editedSchedule.overrideDay = newVal === '0'
    },
  },
  methods: {
    formatStartDate(value) {
      return value && moment(value).utc().format('MMMM Do YYYY')
    },
    editSchedule(schedule) {
      this.editedSchedule = Object.assign({}, schedule)
      this.dialog = true
    },
    deleteSchedule() {
      this.$store.dispatch('deleteSchedule', this.editedSchedule.id)
      this.close()
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedSchedule = Object.assign({}, this.defaultSchedule)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      this.$store.dispatch('saveSchedule', this.editedSchedule)
      this.close()
    },
  },
  head: {
    title: 'Calendar',
  },
}
</script>
