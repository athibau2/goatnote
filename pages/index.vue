<template>
  <v-app>
    <v-list>
      <v-list-item
        v-for="(org, i) in orgs"
        :key="i"
      >
        <v-card elevation="5" width="200">
          <v-card-title class="headline">
              {{org.orgname}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="loadCollections()">Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-list-item>
      <v-spacer />
    </v-list>

    <v-list v-if="gettingColls">
      <v-list-item
        v-for="(coll, i) in collections"
        :key="i"
      >
        <v-card elevation="5" width="200">
          <v-card-title class="headline">
              {{coll.collectionname}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn>Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-list-item>
      <v-spacer />
    </v-list>
  </v-app>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  data () {
    return {
      response: '',
    }
  },

  methods: {
    loadCollections () {
      this.$store.dispatch('users/getColls', true)
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

    gettingColls () {
      return this.$store.state.users.gettingColls
    }
  }
}
</script>
