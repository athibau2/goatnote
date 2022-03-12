<template>
  <v-container>
    <v-row>
      <v-col v-for="(org, i) in orgs" :key="i">
        <v-card elevation="5" width="200">
          <v-card-title class="headline">
              {{org.orgname}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="loadCollections(org.orgid)">Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <div v-for="(coll, i) in collections" :key="i">
        <v-card elevation="5" width="200">
          <v-card-title class="headline">
              {{coll.collectionname}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn>Go</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.dispatch('users/orgs')
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
  },

  data () {
    return {
      response: '',
    }
  },

  methods: {
    loadCollections (orgid) {
      this.$store.dispatch('users/collections', {
        orgid
      })
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    orgs () {
      return this.$store.state.users.orgs
    },

    collections () {
      return this.$store.state.users.collections
    },

  }
}
</script>
