<template>
  <div>
    <v-row>
      <v-col
        v-for="light in lights"
        :key="light.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card :color="light.value ? 'green' : 'red darken-4'">
          <v-card-title>
            <h4>{{ light.description }}</h4>
          </v-card-title>

          <v-divider />

          <v-radio-group v-model="light.mode" column class="ml-4">
            <v-radio
              :label="`Auto (${light.value ? 'On' : 'Off'})`"
              :value="0"
            />
            <v-radio label="Off" :value="1" />
            <v-radio label="On" :value="2" />
          </v-radio-group>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'hmi',
  data: () => ({
    lights: [
      {
        name: 'hallLights1',
        description: 'Hall Lights 1',
        value: false,
        auto: true,
        mode: 0,
      },
      {
        name: 'hallLights2',
        description: 'Hall Lights 2',
        value: true,
        auto: true,
        mode: 0,
      },
      {
        name: 'hallLights3',
        description: 'Hall Lights 3',
        value: false,
        auto: true,
        mode: 0,
      },
    ],
  }),
}
</script>
