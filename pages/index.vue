<template>
  <v-app>
    <!-- <!DOCTYPE html>
    <html>
      <head> -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <!-- </head>
    </html> -->
    
    <v-container>

      <!-- Creating a new org -->
      <v-col v-if="makingNewOrg">
        <v-row justify="center" align="center">
          <v-card color="#faf9e2" elevation="5" width="400">
            <v-card-title class="headline">
                Create a New Organization
            </v-card-title>
            <v-card-text>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-4"
                  v-model="newOrgName" 
                  placeholder="New Organization Name"
                >
                </v-text-field>
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

      <!-- Creating a new collection -->
      <v-col v-if="makingNewCollection">
        <v-row justify="center" align="center">
          <v-card color="#faf9e2" elevation="5" width="400">
            <v-card-title class="headline">
                Create a New Collection
            </v-card-title>
            <v-card-text>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light green lighten-3"
                  v-model="newCollName" 
                  placeholder="New Collection Name"
                >
                </v-text-field>
                <v-menu
                  bottom
                  :close-on-content-click="true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="selector"
                      dense
                      solo
                      rounded
                      readonly
                      background-color="light blue lighten-4"
                      append-icon="mdi-chevron-down"
                      v-bind="attrs" 
                      v-on="on" 
                      v-model="orgToAddTo" 
                      placeholder="Add to Organization"
                    >
                    </v-text-field>
                  </template>
                  <v-list>
                    <v-list-item v-for="(org, i) in orgs" :key="i">
                      <v-btn color="light blue lighten-4" @click="setOrgToAddTo(org)">
                        {{org.orgname}}
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="light red lighten-2" nuxt @click="newCollection()">
                    Cancel
                </v-btn>
                <v-btn color="primary" @click="createCollection()">
                    Add
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <!-- Creating a new note -->
      <v-col v-if="makingNewNote">
        <v-row justify="center" align="center">
          <v-card color="#faf9e2" elevation="5" width="400">
            <v-card-title class="headline">
                Create a New Note
            </v-card-title>
            <v-card-text>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light purple lighten-3"
                  v-model="newNoteName" 
                  placeholder="New Note Name"
                >
                </v-text-field>
                <v-menu
                  bottom
                  :close-on-content-click="true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="selector"
                      dense
                      solo
                      rounded
                      readonly
                      background-color="light green lighten-3"
                      append-icon="mdi-chevron-down"
                      v-bind="attrs" 
                      v-on="on" 
                      v-model="collToAddTo" 
                      placeholder="Add to Collection"
                    >
                    </v-text-field>
                  </template>
                  <v-list>
                    <v-list-item v-for="(coll, i) in allColls" :key="i">
                      <v-btn color="light green lighten-3" @click="setCollToAddTo(coll)">
                        {{coll.collectionname}}
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="light red lighten-2" nuxt @click="newNote()">
                    Cancel
                </v-btn>
                <v-btn color="primary" @click="createNote()">
                    Add
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <br>

      <h2 v-if="orgs === null || orgs === undefined || orgs.length === 0" class="notice text-center">
        You are currently not part of any organizations and have no collections or notes. Create one above!
      </h2>

      <!-- List of orgs -->
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

      <!-- List of collections -->
      <v-col>
        <v-row>
          <v-card class="list-card" color="light green lighten-3" elevation="5" width="250" v-for="(coll, i) in collections" :key="i">
            <v-card-title v-if="!editingColl || (editingColl && coll.collectionid !== collBeingEdited)">
                {{coll.collectionname}}
                <v-spacer />
                <v-btn 
                  :disabled="(editingColl && coll.collectionid !== collBeingEdited) ? true : false" 
                  icon @click="setEditColl(coll)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-title v-else>
              <v-text-field
                :value="coll.collectionname"
                append-icon="mdi-pencil"
                @click:append="editingColl = !editingColl"
                @input="textChanged($event)"
                @keyup.enter="updateColl(coll)"
              >
              </v-text-field>
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="#cccccc"
                      v-bind="attrs"
                      v-on="on"
                      @click="getSharedList(coll)"
                    >
                      <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Share</span>
                </v-tooltip>
              <v-btn color="light red lighten-2" @click="deleteCollection(coll.collectionid, coll.orgid)">Delete</v-btn>
              <v-btn color="primary" @click="loadNotes(coll.collectionid)">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <br>

      <!-- List of notes -->
      <v-col>
        <v-row>
          <v-card class="list-card" color="light purple lighten-3" elevation="5" width="300" v-for="(note, i) in notes" :key="i">
            <v-card-title>
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
      <ShareColl v-show="showShareColl" @close-modal="showShareColl = false" />
    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import ShareColl from "~/components/ShareColl.vue"

export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
    this.$store.dispatch('users/allColls')
  },

  components: {
    ShareColl
  },

  data () {
    return {
      newOrgName: "",
      newCollName: "",
      newNoteName: "",
      orgToAddTo: "",
      orgIdToAddTo: null,
      collToAddTo: "",
      collIdToAddTo: null,
      orgOfCollBeingAddedTo: null,
      collBeingEdited: null,
      editingColl: false,
      newName: "",
      showShareColl: false
    }
  },

  methods: {
    getSharedList (coll) {
      this.showShareColl = true
      this.$store.dispatch('users/getSharedCollList', {
        collection: coll
      })
    },

    textChanged (event) {
      this.newName = event
    },

    setEditColl (coll) {
      this.editingColl = !this.editingColl
      if (this.editingColl) this.collBeingEdited = coll.collectionid
      else this.collBeingEdited = null
    },

    async updateColl (coll) {
      await this.$store.dispatch('users/updateCollName', {
        collectionid: coll.collectionid,
        newName: this.newName,
        orgid: coll.orgid
      })
      this.setEditColl()
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

    setOrgToAddTo (org) {
      this.orgToAddTo = org.orgname
      this.orgIdToAddTo = org.orgid
    },

    setCollToAddTo (coll) {
      this.orgOfCollBeingAddedTo = coll.orgid
      this.collToAddTo = coll.collectionname
      this.collIdToAddTo = coll.collectionid
    },

    createOrg () {
      if (this.newOrgName === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/createOrg', {
          orgname: this.newOrgName
        })
        this.newOrgName = ""
        this.newOrg()
      }
    },

    createCollection () {
      if (this.newCollName === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/createCollection', {
          collectionname: this.newCollName,
          orgid: this.orgIdToAddTo
        })
        this.newCollName = ""
        this.newCollection()
      }
    },

    createNote () {
      if (this.newNoteName === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/createNote', {
          notename: this.newNoteName,
          collectionid: this.collIdToAddTo,
          orgid: this.orgOfCollBeingAddedTo
        })
        this.newNoteName = ""
        this.newNote()
      }
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
      this.newOrgName = ""
    },

    newCollection () {
      this.$store.commit('users/newCollection', false)
      this.orgToAddTo = ""
      this.orgIdToAddTo = null
      this.newCollName = ""
    },

    newNote () {
      this.$store.commit('users/newNote', false)
      this.collToAddTo = ""
      this.collIdToAddTo = null
      this.newNoteName = ""
      this.orgOfCollBeingAddedTo = null
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
