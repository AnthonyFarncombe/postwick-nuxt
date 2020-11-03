<template>
  <div>
    <h1>
      {{ numberOfCars.value }}
      {{ numberOfCars.value === 1 ? 'car' : 'cars' }} in the car park
    </h1>
  </div>
</template>

<script>
export default {
  layout: 'hmi',
  data: () => ({
    numberOfCars: { value: 0 },
  }),
  created() {
    this.numberOfCars = this.$store.state.variables.find(
      (v) => v.name === 'numberOfCars'
    ) || { value: 0 }
  },
  head: {
    title: 'Dashboard',
  },
}
</script>
