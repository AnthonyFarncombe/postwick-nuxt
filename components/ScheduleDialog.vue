<template>
  <v-dialog :value="dialog" max-width="500px" @input="$emit('toggle')">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark class="mb-2" v-on="on">New Schedule</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"
          >{{ editedSchedule.id ? 'Edit' : 'New' }} Schedule</span
        >
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
                :items="frequencyOptionsFiltered"
                item-text="text"
                item-value="value"
                label="Frequency"
                :error="errors.frequency"
              ></v-select>
            </v-col>
          </v-row>

          <v-row v-if="['0', '2', '3'].includes(editedSchedule.frequency)">
            <v-col cols="12">
              <v-select
                v-model="editedSchedule.nextDatePicker"
                :items="nextDates"
                item-text="text"
                item-value="value"
                label="Next Date"
                :error="errors.nextDatePicker"
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

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="editedSchedule.meetingSize"
                :items="meetingSizes"
                item-text="text"
                item-value="value"
                label="Meeting Size"
                :error="errors.meetingSize"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red darken-1" @click="deleteSchedule">Delete</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="$emit('toggle')">Cancel</v-btn>
        <v-btn color="blue darken-1" :disabled="formInvalid" @click="save"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  props: {
    dialog: Boolean,
    schedule: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    editedSchedule: {},
    timeOfMeetingMenuModel: false,
  }),
  computed: {
    ...mapState([
      'frequencyOptions',
      'daysOfTheWeek',
      'meetingSizes',
      'frequencyOptions',
    ]),
    errors() {
      return {
        dayOfWeek: !this.editedSchedule.dayOfWeek,
        timeOfMeeting: !this.editedSchedule.timeOfMeeting,
        frequency: !this.editedSchedule.frequency,
        nextDatePicker:
          !this.editedSchedule.nextDatePicker &&
          ['0', '2', '3'].includes(this.editedSchedule.frequency),
        meetingSize: !this.editedSchedule.meetingSize,
      }
    },
    formInvalid() {
      return (
        this.errors.dayOfWeek ||
        this.errors.timeOfMeeting ||
        this.errors.frequency ||
        this.errors.nextDate ||
        this.errors.meetingSize
      )
    },
    frequencyOptionsFiltered() {
      return this.frequencyOptions.filter(
        (f) => f.value !== 'CM' || this.editedSchedule.dayOfWeek === 'Saturday'
      )
    },
    nextDates() {
      const dates = []

      if (
        !this.editedSchedule.dayOfWeek ||
        !this.editedSchedule.frequency ||
        ['1', 'CM'].includes(this.editedSchedule.frequency)
      ) {
        return dates
      }

      const today = dayjs().set({
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
          value: date.format('YYYY-MM-DD'),
          text: date.format('dddd, DD MMM YYYY'),
        })
      }

      return dates
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        let nextDatePicker = ''
        if (['0', '2', '3'].includes(this.schedule.frequency)) {
          const today = dayjs().hour(0).minute(0).second(0).millisecond(0)
          let nextDate = dayjs(this.schedule.startDate)

          if (this.schedule.frequency !== '0') {
            let weeks = today.diff(nextDate, 'week', true)
            weeks =
              Math.ceil(weeks / parseInt(this.schedule.frequency)) *
              parseInt(this.schedule.frequency)
            if (weeks > 0) {
              nextDate = nextDate.add(weeks, 'week')
            }

            nextDatePicker = nextDate.format('YYYY-MM-DD')
          }
        }

        this.editedSchedule = {
          ...this.schedule,
          // nextDatePicker: dayjs(this.schedule.nextDate).format('YYYY-MM-DD'),
          nextDatePicker,
        }
      }
    },
    'editedSchedule.dayOfWeek'(newVal) {
      if (newVal !== 'Saturday' && this.editedSchedule.frequency === 'CM')
        this.editedSchedule.frequency = '1'
    },
    'editedSchedule.frequency'(newVal) {
      this.editedSchedule.overrideDay = ['0', 'CM'].includes(newVal)
    },
  },
  methods: {
    deleteSchedule() {
      this.$store.dispatch('deleteSchedule', this.editedSchedule.id)
      this.$emit('toggle')
    },
    save() {
      if (['0', '2', '3'].includes(this.editedSchedule.frequency))
        this.editedSchedule.startDate = this.editedSchedule.nextDatePicker
      this.$store.dispatch('saveSchedule', this.editedSchedule)
      this.$emit('toggle')
    },
  },
}
</script>
