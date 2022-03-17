<template>
  <v-app>
    <v-container>

      <v-col v-if="makingNewOrg">
        <v-row justify="center" align="center">
          <v-card elevation="5" width="400">
          <v-card-title class="headline">
              Create a New Organization
          </v-card-title>
          <v-card-text>
              <input v-model="newOrgName" placeholder="Organization Name" required>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn color="primary" nuxt @click="newOrg()">
                  Cancel
              </v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" nuxt @click="createOrg()">
                  Submit
              </v-btn>
          </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <v-col v-if="makingNewCollection">
        <v-row justify="center" align="center">
          <v-card elevation="5" width="400">
          <v-card-title class="headline">
              Create a New Collection
          </v-card-title>
          <v-card-text>
              <input v-model="newCollName" placeholder="Collection Name" required>
          </v-card-text>
          <dropdown 
            :options="orgs" 
            :selected="orgSelected"
            v-on:updateOption="selectOrg"
            placeholder="Select an organization"
          >
          </dropdown>
          <v-card-actions>
              <v-spacer />
              <v-btn color="primary" nuxt @click="newCollection()">
                  Cancel
              </v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" nuxt @click="createCollection()">
                  Submit
              </v-btn>
          </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <v-col v-if="makingNewNote">
        <v-row justify="center" align="center">
          <v-card elevation="5" width="400">
          <v-card-title class="headline">
              Create a New Note
          </v-card-title>
          <v-card-text>
              <input v-model="newNoteName" placeholder="Note Name" required>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn color="primary" nuxt @click="newNote()">
                  Cancel
              </v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" nuxt @click="createNote()">
                  Submit
              </v-btn>
          </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <v-row>
        <v-card elevation="5" width="200" v-for="(org, i) in orgs" :key="i">
          <v-card-title class="headline">
              {{org.orgname}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="loadCollections(org.orgid)">Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>

      <v-row>
        <div v-for="(coll, i) in collections" :key="i">
          <v-card elevation="5" width="200">
            <v-card-title class="headline">
                {{coll.collectionname}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="loadNotes(coll.collectionid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-row>

      <v-row>
        <div v-for="(note, i) in notes" :key="i">
          <v-card elevation="5" width="200">
            <v-card-title class="headline">
                {{note.notename}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="openNote(note.noteid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import dropdown from 'vue-dropdowns'
export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
  },

  components: {
    'dropdown': dropdown
  },

  data () {
    return {
      newOrgName: "",
      newCollName: "",
      newNoteName: "",
      orgSelected: ""
    }
  },

  methods: {
    selectOrg (orgname) {
      this.orgSelected = orgname
    },

    loadCollections (orgid) {
      this.$store.dispatch('users/collections', {
        orgid
      })
    },

    loadNotes (collectionid) {
      this.$store.dispatch('users/notes', {
        collectionid
      })
    },

    openNote (noteid) {
      this.$store.dispatch('users/openNote', {
        noteid
      })
    },

    createOrg () {
      this.$store.dispatch('users/createOrg', {
        orgname: this.newOrgName
      })
      this.newOrgName = ""
      this.newOrg()
    },

    createCollection () {
      this.$store.dispatch('users/createCollection', {
        collectionname: this.newCollName
      })
      this.newCollName = ""
      this.newCollection()
    },

    newOrg () {
      this.$store.commit('users/newOrg', false)
    },

    newCollection () {
      this.$store.commit('users/newCollection', false)
    },

    newNote () {
      this.$store.commit('users/newNote', false)
    },
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

    notes () {
      return this.$store.state.users.notes
    },

    makingNewOrg () {
      return this.$store.state.users.makingNewOrg
    },

    makingNewCollection () {
      return this.$store.state.users.makingNewCollection
    },

    makingNewNote () {
      return this.$store.state.users.makingNewNote
    }
  }
}
</script>
