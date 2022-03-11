<template>
  <v-app>
    <div>
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
              <v-btn @click="loadCollections(org.orgid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-list-item>
        <v-spacer />
      </v-list>
    </div>
    
    <div>
      <v-list>
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
    </div>
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

    // gettingColls () {
    //   return this.$store.state.users.gettingColls
    // }
  }
}
</script>
