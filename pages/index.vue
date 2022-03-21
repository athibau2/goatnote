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
              <input v-model="newOrgName" placeholder="New Organization Name" required>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" nuxt @click="newOrg()">
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
              <input v-model="newCollName" placeholder="New Collection Name" required>
          </v-card-text>
          <v-card-subtitle>
            Add your new Collection to an Organization:
          </v-card-subtitle>
          <v-list>
            <v-list-item v-for="(org, i) in orgs" :key="i">
              <v-btn color="light blue lighten-4" @click="createCollection(org.orgid)">
                {{org.orgname}}
              </v-btn>
            </v-list-item>
          </v-list>
          <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" nuxt @click="newCollection()">
                  Cancel
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
              <input v-model="newNoteName" placeholder="New Note Name" required>
          </v-card-text>
          <v-card-subtitle>
            Add your new Note to a Collection:
          </v-card-subtitle>
          <v-list>
            <v-list-item v-for="(coll, i) in allColls" :key="i">
              <v-btn color="light green lighten-3" @click="createNote(coll.collectionid)">
                {{coll.collectionname}}
              </v-btn>
            </v-list-item>
          </v-list>
          <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" nuxt @click="newNote()">
                  Cancel
              </v-btn>
          </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <br>

      <v-col>
        <v-row>
          <v-card class="list-card" color="light blue lighten-4" elevation="5" width="250" v-for="(org, i) in orgs" :key="i">
            <v-card-title class="headline">
                {{org.orgname}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" @click="leaveOrg(org.orgid)">Leave</v-btn>
              <v-btn color="primary" @click="loadCollections(org.orgid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <br>

      <v-col>
        <v-row>
          <v-card class="list-card" color="light green lighten-3" elevation="5" width="250" v-for="(coll, i) in collections" :key="i">
            <v-card-title class="headline">
                {{coll.collectionname}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" @click="deleteCollection(coll.collectionid, coll.orgid)">Delete</v-btn>
              <v-btn color="primary" @click="loadNotes(coll.collectionid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <br>

      <v-col>
        <v-row>
          <v-card class="list-card" color="light purple lighten-3" elevation="5" width="250" v-for="(note, i) in notes" :key="i">
            <v-card-title class="headline">
                {{note.notename}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="light red lighten-2" @click="deleteNote(note.noteid, note.collectionid)">Delete</v-btn>
              <v-btn color="primary" @click="openNote(note.noteid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"

export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
    this.$store.dispatch('users/allColls')
  },

  data () {
    return {
      newOrgName: "",
      newCollName: "",
      newNoteName: "",
    }
  },

  methods: {
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

    createCollection (orgid) {
      this.$store.dispatch('users/createCollection', {
        collectionname: this.newCollName,
        orgid: orgid
      })
      this.newCollName = ""
      this.newCollection()
    },

    createNote (collectionid) {
      this.$store.dispatch('users/createNote', {
        notename: this.newNoteName,
        collectionid: collectionid
      })
      this.newNoteName = ""
      this.newNote()
    },

    leaveOrg(orgid) {
      if (confirm("Are you sure you want to leave this organization? You will lose access to all collections and notes inside this organization.")) {
        this.$store.dispatch('users/leaveOrg', {
        orgid: orgid
        })
      }
    },

    deleteCollection(collectionid, orgid) {
      if (confirm("Are you sure you want to delete this collection? This will also delete all notes inside this collection.")) {
        this.$store.dispatch('users/deleteCollection', {
          collectionid: collectionid,
          orgid: orgid
        })
      }
    },

    deleteNote(noteid, collectionid) {
      if (confirm("Are you sure you want to delete this note? This will also delete all words, questions, and links inside this note.")) {
        this.$store.dispatch('users/deleteNote', {
          noteid: noteid,
          collectionid: collectionid
        })
      }
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

    allColls () {
      return this.$store.state.users.allColls
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

<style scoped>
@import '~/assets/styles.css';

.list-card{
  margin-right: 10px;
}

</style>
