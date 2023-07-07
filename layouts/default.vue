<template>
  <v-app dark>
    <script src="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/js/shepherd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/css/shepherd.css"/>

    <v-navigation-drawer
      class="main"
      id="menu-step-6"
      :mini-variant="windowWidth < 1161 ? true : miniVariant"
      :clipped="true"
      fixed
      app
      permanent
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :id="'menu-step-'+i"
          :to="item.to"
          @click="item.click"
          router
          exact
          :disabled="item.title !== 'Admin' ? false : userData.isadmin ? false : true"
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

    <v-app-bar
      class="app-bar"
      :clipped-left="true"
      fixed
      app
      color="light grey lighten-2"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon 
            @click.stop="miniVariant = !miniVariant"
            v-on="on"
            v-bind="attrs"
          />
        </template>
        <span>{{miniVariant ? 'Expand' : 'Collapse'}}</span>
      </v-tooltip>
      <button class="logo-btn" @click="toHome()">
        <img class="logo" src="~/assets/logos/GN.png" height="45px">
      </button>
      <v-spacer/>

      <v-toolbar-title class="name-display" v-if="user !== null && user !== undefined">
        {{userData.firstname}} {{userData.lastname}}
      </v-toolbar-title>
      <v-btn to="/account" icon><v-icon size="30">mdi-account</v-icon></v-btn>
    </v-app-bar>

    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>

    <Footer />

  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import Shepherd from 'shepherd.js'
import Footer from '~/components/Footer.vue'

export default {
  name: 'DefaultLayout',

  async mounted () {
    await this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    await this.$store.dispatch('users/userData')
    this.$store.dispatch('users/allColls')
    if (!this.userData.onboarded) {
      this.addSteps()
      this.tour.start()
      this.tour.on('complete', this.onboardingComplete)
    }
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  components: {
    Footer,
  },

  data () {
    return {
      fixed: false,
      isadmin: this.$store.state.users.userData.isadmin,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
          click: this.loadOrgs
        },
        {
          icon: 'mdi-domain',
          title: 'Join Organization',
          to: '/joinOrg'
        },
        {
          icon: 'mdi-calendar-alert',
          title: 'My Study Plans',
          to: '/plans'
        },
        {
          icon: 'mdi-share-variant',
          title: 'Shared With Me',
          to: '/shared'
        },
        {
          icon: 'mdi-account-cog',
          title: 'My Account',
          to: '/account',
          click: this.loadUserData
        },
        {
          icon: 'mdi-account-key',
          title: 'Admin',
          to: '/admin',
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          click: this.logout
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'GOAT Notes',
      windowWidth: window.innerWidth,
      tour: new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark',
        }
      }),
    }
  },

  methods: {
    addSteps() {
      this.tour.addSteps([
        {
          id: 'step-1',
          title: 'Hello there!',
          text: 'Welcome to GOAT Notes. Let\'s get you started on your tour!',
          buttons: [
            {
              text: 'Okay!',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'step-5',
          title: 'Hello there!',
          text: 'The organizations you are a part of will show up here. Click \'Go\' to expand and see your collections, and then again to see your notes.',
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-1',
          title: 'Hello there!',
          text: 'If the organization you want to be part of already exists, go to this page to find and join them! If they are a private organization, you\'ll need the join code from someone in the organization.',
          attachTo: {
            element: '#menu-step-1',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-2',
          title: 'Hello there!',
          text: 'You can create up to three study plans for each of your notes. On this page, you will see all the study plans you haven\'t completed for all your notes.',
          attachTo: {
            element: '#menu-step-2',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-3',
          title: 'Hello there!',
          text: 'You have the ability to share entire collections or individual notes with people as long as they are also in the same organization. On this page, you can see all the collections and notes that have been shared with you. You can\'t edit the notes they have written, but you can add vocab words, study questions, and links to their notes.',
          attachTo: {
            element: '#menu-step-3',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-5',
          title: 'Hello there!',
          text: 'If you are promoted to be a site admin, this is where you will go to see all the users and the data of GOAT Notes.',
          attachTo: {
            element: '#menu-step-5',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-6',
          title: 'Hello there!',
          text: 'Using touch screen, you can swipe this menu back and forth to completely hide it or show it again.',
          attachTo: {
            element: '#menu-step-6',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'final-step',
          title: 'Hello there!',
          text: 'That concludes our tour! Now, get to it!',
          buttons: [
            {
              text: 'Finish',
              action: this.tour.complete
            }
          ]
        },
      ]);
    },

    onboardingComplete () {
      console.log('Complete')
      this.$store.dispatch('users/basicOnboardingComplete')
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    toHome() {
      this.$router.push('/')
    },

    logout() {
      this.$store.dispatch('users/logout')
    },

    loadUserData () {
        this.$store.dispatch('users/userData')
    },

    loadOrgs () {
        this.$store.dispatch('users/orgs')
    },
  },

  computed: {
    user() {
      return this.$store.state.users.user
    },

    userData() {
      return this.$store.state.users.userData
    },

    orgs () {
      return this.$store.state.users.orgs
    },

    allColls () {
      return this.$store.state.users.allColls
    },
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.topButton {
  margin-right : 3px;
}

.name-display {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 22px;
  letter-spacing: 1px;
}

.logo-btn {
  transition: transform 0.5s;
}

.logo-btn:hover {
    transform: scale(1.05);
}

.logo {
  margin: 2px 6px 2px 6px;
  vertical-align: middle;
}

</style>