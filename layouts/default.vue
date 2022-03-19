<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="item.click"
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
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="light grey lighten-1"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-bold" v-text="title" />
      <v-spacer/>
      <div class="topButton">
      <v-btn color="light blue lighten-4" @click="newOrg()" to="/">Add Organization </v-btn>
      </div>
      <div class="topButton">
      <v-btn color="light green lighten-3" @click="newCollection()" to="/">Add Collection </v-btn>
      </div>
      <div class="topButton">
      <v-btn color="light purple lighten-3" @click="newNote()" to="/">Add Note </v-btn>
      </div>
      <v-toolbar-title v-if="user !== null && user !== undefined">
        &nbsp;{{userData.firstname}} {{userData.lastname}}
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  mounted () {
    this.$store.dispatch('users/userData')
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/',
          click: this.loadOrgs
        },
        {
          icon: 'mdi-account-cog',
          title: 'Account',
          to: '/account',
          click: this.loadUserData
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
      title: 'GoatNotes'
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('users/logout')
    },

    loadUserData () {
        this.$store.dispatch('users/userData')
    },

    loadOrgs () {
        this.$store.dispatch('users/orgs')
    },

    loadCollections () {
      this.$store.dispatch('users/collections')
    },

    newOrg () {
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newNote', false)
      this.$store.commit('users/newOrg', true)
    },

    newCollection () {
      this.$store.commit('users/newNote', false)
      this.$store.commit('users/newOrg', false)
      this.$store.commit('users/newCollection', true)
    },

    newNote() {
      this.$store.commit('users/newOrg', false)
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newNote', true)
      this.$store.dispatch('users/allColls')
    }
  },

  computed: {
    user() {
      return this.$store.state.users.user
    },

    userData() {
      return this.$store.state.users.userData
    }
  }
}
</script>

<style scoped>
.topButton {
  margin-right : 3px;
}
</style>