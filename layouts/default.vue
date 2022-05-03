<template>
  <v-app dark>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
      color="light grey lighten-5"
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
    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
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
    this.$store.dispatch('users/allColls')
  },

  data () {
    return {
      fixed: false,
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
      title: 'GOAT Notes'
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
      if (this.orgs.length === 0) {
        alert('You must first create an organization before you can create a collection.')
      }
      else {
        this.$store.commit('users/newNote', false)
        this.$store.commit('users/newOrg', false)
        this.$store.commit('users/newCollection', true)
      }
    },

    newNote() {
      if (this.allColls.length === 0) {
        alert('You must first create a collection before you can create a note.')
      }
      else {
        this.$store.commit('users/newOrg', false)
        this.$store.commit('users/newCollection', false)
        this.$store.commit('users/newNote', true)
        this.$store.dispatch('users/allColls')
      }
    }
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
.topButton {
  margin-right : 3px;
}

.main{
  background-color: rgb(218, 236, 218)
}
</style>