<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-list rounded>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Postwick BMS</v-toolbar-title>
      <v-spacer />
      <v-toolbar-title v-if="authUser" class="mr-5"
        >Hi {{ authUser.firstName }}!</v-toolbar-title
      >
      <v-btn v-if="authUser" color="secondary" @click="logout">Logout</v-btn>
      <!-- <v-btn v-if="!authUser" @click="login">Login</v-btn> -->
      <HmiLoginDialog v-if="!authUser" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} NCH Construction Ltd</span>
    </v-footer>
  </v-app>
</template>

<script>
import HmiLoginDialog from '@/components/HmiLoginDialog'

export default {
  middleware: 'auth',
  components: {
    HmiLoginDialog,
  },
  data: () => ({
    drawer: true,
  }),
  computed: {
    authUser() {
      return this.$store.state.authUser
    },
    items() {
      const items = [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/hmi',
        },
        {
          icon: 'mdi-lightbulb',
          title: 'Lights',
          to: '/hmi/lights',
        },
        {
          icon: 'mdi-fan',
          title: 'HVAC',
          to: '/hmi/hvac',
        },
        {
          icon: 'mdi-lock-open',
          title: 'Access',
          to: '/hmi/access',
        },
        {
          icon: 'mdi-water',
          title: 'Water',
          to: '/hmi/water',
        },
        {
          icon: 'mdi-calendar-clock',
          title: 'Calendar',
          to: '/hmi/calendar',
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          to: '/hmi/users',
          role: 'users',
        },
      ]
      return items.filter(
        (i) =>
          !i.role ||
          ((this.authUser && this.authUser.roles) || []).includes(i.role)
      )
    },
  },
  created() {
    // eslint-disable-next-line no-console
    console.log('HMI loaded')
  },
  beforeDestroy() {
    // eslint-disable-next-line no-console
    console.log('HMI unloaded')
  },
  methods: {
    login() {
      this.$store.commit('setAuthUser', {
        firstName: 'Anthony',
        roles: ['users'],
      })
    },
    logout() {
      this.$store.commit('setAuthUser', false)
    },
  },
}
</script>
