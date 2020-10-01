<template>
  <v-app dark>
    <template v-if="connected">
      <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
        <v-list rounded>
          <v-list-item
            v-for="(page, i) in pages"
            :key="i"
            :to="page.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ page.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="page.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar :clipped-left="true" fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Postwick BMS</v-toolbar-title>
        <v-spacer />
        <v-toolbar-title v-if="authUser && authUser.id" class="mr-5">
          Hi {{ authUser.firstName }}!
        </v-toolbar-title>
        <v-btn v-if="authUser && authUser.id" color="secondary" @click="logout"
          >Logout</v-btn
        >
        <HmiLoginDialog v-if="!authUser || !authUser.id" />
      </v-app-bar>
      <v-main>
        <v-container>
          <nuxt />
        </v-container>
      </v-main>
      <v-footer app>
        <span>&copy; {{ new Date().getFullYear() }} NCH Construction Ltd</span>
      </v-footer>
    </template>
    <v-container v-else style="height: 400px">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="subtitle-1 text-center" cols="12"> Connecting... </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState(['authUser', 'connected']),
    pages() {
      const pages = [
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
      return pages.filter(
        (i) =>
          !i.role ||
          ((this.authUser && this.authUser.roles) || []).includes(i.role)
      )
    },
  },
  created() {
    this.$store.commit('setHmiActive', true)
  },
  beforeDestroy() {
    this.$store.commit('setHmiActive', false)
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$store
        .dispatch('loadAuthUser')
        .then((authUser) => {
          const page = this.pages.find((p) => p.to === this.$route.fullPath)
          if (!page) this.$router.push('/hmi')
        })
        .catch(() => {
          this.$router.push('/auth/login')
        })
    },
  },
}
</script>
