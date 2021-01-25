/* eslint-disable no-console */
<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Cars</v-tab>
      <v-tab>Visits</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-data-table
          :headers="carHeaders"
          :items="cars"
          disable-pagination
          hide-default-footer
          class="elevation-1"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Cars</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="carDialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="default" dark class="mb-2" v-on="on"
                    >New Car</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ carDialogTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field
                            v-model="editedCar.plateText"
                            label="Plate Text"
                          />
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="editedCar.name" label="Name" />
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color="red darken-1" @click="deleteCar"
                      >Delete</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="carModal = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      :disabled="carFormInvalid"
                      @click="saveCar"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:[`item.lastVisit`]="{ value }">
            {{ formatDate(value, 'DD MMMM YYYY') }}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <v-btn small @click="viewVisits(item)">Visits</v-btn>
            <v-btn small @click="editCar(item)">Edit</v-btn>
            <v-btn small @click="deleteCar(item)">Delete</v-btn>
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item>
        <v-row>
          <v-col cols="12" lg="3">
            <v-text-field
              v-model="visitSearch"
              placeholder="Search..."
              class="ma-3"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="visit in visitsFiltered"
            :key="visit.id"
            class="d-flex child-flex"
            cols="12"
            sm="12"
            md="12"
            lg="6"
            xl="4"
          >
            <v-card max-width="600px" @click="openVisit(visit)">
              <v-card-title>
                <span
                  >{{ formatDate(visit.timestamp, 'DD/MM/YYYY HH:mm') }}
                </span>
                <span v-if="visit.plateText"
                  >&nbsp;- {{ visit.plateText }}</span
                >
              </v-card-title>

              <v-card-text>
                <v-img :src="getImagePath(visit)" aspect-ratio="1.768" contain>
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="visitDialog" max-width="960">
      <v-card>
        <v-card-title class="headline">
          <span
            >{{ formatDate(selectedVisit.timestamp, 'DD/MM/YYYY HH:mm') }}
          </span>
          <span v-if="selectedVisit.name"
            >&nbsp;- {{ selectedVisit.name }}</span
          >
          <span v-else-if="selectedVisit.plateText"
            >&nbsp;- {{ selectedVisit.plateText }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-img
                :src="getImagePath(selectedVisit, false)"
                aspect-ratio="1.768"
                contain
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>

            <v-col cols="12">
              <v-img
                :src="getImagePath(selectedVisit, true)"
                aspect-ratio="1.768"
                contain
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  layout: 'hmi',
  async asyncData({ $axios }) {
    const result = await Promise.all([
      $axios.get('anpr/cars'),
      $axios.get('anpr/visits'),
    ])
    return { cars: result[0].data, visits: result[1].data }
  },
  data: () => ({
    tab: null,
    carDialog: false,
    carDialogTitle: 'New Car',
    editedCar: {},
    carHeaders: [
      {
        text: 'Plate Text',
        value: 'plateText',
      },
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Visits',
        value: 'visits',
      },
      {
        text: 'Last Visit',
        value: 'lastVisit',
      },
      {
        text: 'Action',
        value: 'action',
      },
    ],
    visitSearch: '',
    visitDialog: false,
    selectedVisit: {},
  }),
  computed: {
    baseUrl() {
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3011'
        : ''
    },
    carFormInvalid() {
      return false
    },
    visitsFiltered() {
      if (!this.visitSearch) return this.visits
      return this.visits.filter((v) =>
        (v.plateText || '')
          .toUpperCase()
          .replace(' ', '')
          .includes(this.visitSearch.replace(' ', '').toUpperCase())
      )
    },
  },
  methods: {
    formatDate(value, format) {
      return value && dayjs(value).format(format)
    },
    getImagePath(visit, cropped) {
      if (!cropped && visit.imageNameOrig) {
        return `${this.baseUrl}/api/cctv/image/${visit.imageNameOrig}`
      } else if (cropped && visit.imageNameCropped) {
        return `${this.baseUrl}/api/cctv/image/${visit.imageNameCropped}`
      } else {
        return '/image-not-found.svg'
      }
    },
    editCar(car) {
      this.carDialogTitle = 'Edit Car'
      this.editedCar = Object.assign({}, car)
      this.carDialog = true
    },
    saveCar() {
      //
    },
    deleteCar() {
      //
    },
    viewVisits(car) {
      this.tab = 1
      this.visitSearch = car.plateText.toUpperCase().replace(' ', '')
    },
    openVisit(visit) {
      this.selectedVisit = visit
      this.visitDialog = true
    },
  },
  head: {
    title: 'ANPR',
  },
  meta: {
    role: 'anpr',
  },
}
</script>
