<template>
  <v-app>
    <!-- <!DOCTYPE html>
    <html>
      <head> -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <!-- </head>
    </html> -->

    <span>
      <span class="basic-header">
        {{level == 1 ? 'Your Organizations' : level == 2 ? `${selectedOrg.orgname} Collections` : `${selectedColl.collectionname} Notes`}}
      </span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn" 
            @click="level == 1 ? newOrg() : level == 2 ? newCollection() : newNote()"
            icon
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Create New</span>
      </v-tooltip>

      <v-tooltip bottom v-if="level != 1">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn"
            @click="level--"
            icon
            v-on="on"
            v-bind="attrs"
            :disabled="creating"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </template>
        <span>Collapse</span>
      </v-tooltip>
    </span>
    <hr>
    
    <!-- Creating a new org -->
    <v-col v-if="makingNewOrg" style="margin-top: 10px;">
      <v-row justify="center" align="center">
        <v-card class="card" elevation="5" width="400">
          <v-card-title class="basic-header" style="word-break: break-word;">
              New Organization
          </v-card-title>
          <v-card-text>
              <v-text-field
                class="selector"
                dense
                solo
                rounded
                background-color="#f9f9f9"
                v-model="newOrgName" 
                placeholder="Name (e.g. Harvard University)"
              >
              </v-text-field>
          </v-card-text>
          <v-card-actions>
              <label id="checkbox-label" for="private">Make Private</label>
              <input id="checkbox" type="checkbox" name="private" v-model="isPrivate" />
              <v-spacer />
              <v-btn text class="flat-btn" @click="cancelNewOrg()">
                  Cancel
              </v-btn>
              <v-btn class="good-btn" nuxt @click="createOrg()">
                  Submit
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- Creating a new collection -->
    <v-col v-if="makingNewCollection">
      <v-row justify="center" align="center">
        <v-card class="card" elevation="5" width="400">
          <v-card-title class="basic-header" style="word-break: break-word;">
              New Collection
          </v-card-title>
          <v-card-subtitle>
            {{ selectedOrg.orgname }}
          </v-card-subtitle>
          <v-card-text>
              <v-text-field
                class="selector"
                dense
                solo
                rounded
                background-color="#f9f9f9"
                v-model="newCollName" 
                placeholder="Name (e.g. History 100)"
              >
              </v-text-field>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn text class="flat-btn" @click="cancelNewCollection()">
                  Cancel
              </v-btn>
              <v-btn class="good-btn" @click="createCollection()">
                  Add
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- Creating a new note -->
    <v-col v-if="makingNewNote">
      <v-row justify="center" align="center">
        <v-card class="card" elevation="5" width="400" style="word-break: break-word;">
          <v-card-title class="basic-header">
              New Note
          </v-card-title>
          <v-card-subtitle>
            {{ selectedColl.collectionname }}
          </v-card-subtitle>
          <v-card-text>
              <v-text-field
                class="selector"
                dense
                solo
                rounded
                background-color="#f9f9f9"
                v-model="newNoteName"
                placeholder="Name (e.g. World War II)"
              >
              </v-text-field>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn text class="flat-btn" @click="cancelNewNote()">
                  Cancel
              </v-btn>
              <v-btn class="good-btn" @click="createNote()">
                  Add
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <span class="notice text-center"
      v-if="(orgs === null || orgs === undefined || orgs.length === 0) && level == 1"
    >
      You are currently not part of any organizations, such as your school. Create one above or 
      <nuxt-link to="/joinOrg">join one</nuxt-link>!
    </span>

    <span class="notice text-center"
      v-if="(collections === null || collections === undefined || collections.length === 0) && level == 2" 
    >
      You currently have no collections in this organization. Create one above!
    </span>

    <span class="notice text-center"
      v-if="(notes === null || notes === undefined || notes.length === 0) && level == 3"
    >
      You currently have no notes in this collection. Create one above!
    </span>

    <!-- List of orgs -->
    <v-col v-if="level == 1">
      <v-row>
        <v-card class="card" elevation="5" width="250" v-for="(org, i) in orgs" :key="i">
          <v-card-title class="card-title">
              {{org.orgname}}
              <v-spacer />
              <v-menu
                offset-y
                top
                left
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon
                    v-bind="attrs" 
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="joincode-popup">
                  <span class="joincode-1">Join code:</span>
                  <span class="joincode-2"> {{org.joincode}}</span>
                </v-list>
              </v-menu>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn text class="flat-btn" @click="leaveOrg(org.orgid)">Leave</v-btn>
            <v-btn class="good-btn" @click="loadCollections(org)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- List of collections -->
    <v-col v-if="level == 2">
      <v-row>
        <v-card class="card" elevation="5" width="250" v-for="(coll, i) in collections" :key="i">
          <v-card-title class="card-title"
            v-if="!editingColl || (editingColl && coll.collectionid !== collBeingEdited)"
          >
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
                  <v-btn icon
                    v-bind="attrs"
                    v-on="on"
                    @click="getSharedCollList(coll)"
                  >
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </template>
                <span>Share</span>
              </v-tooltip>
            <v-btn text class="flat-btn" @click="deleteCollection(coll.collectionid, coll.orgid)">Delete</v-btn>
            <v-btn class="good-btn" @click="loadNotes(coll)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- List of notes -->
    <v-col v-if="level == 3">
      <v-row>
        <v-card class="card" elevation="5" width="300" v-for="(note, i) in notes" :key="i">
          <v-card-title class="card-title">
              {{note.notename}}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                  v-bind="attrs"
                  v-on="on"
                  @click="getSharedNoteList(note)"
                >
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </template>
              <span>Share</span>
            </v-tooltip>
            <v-btn text class="flat-btn" @click="deleteNote(note.noteid, note.collectionid)">Delete</v-btn>
            <v-btn class="good-btn" @click="openNote(note.noteid)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
    <ShareColl style="margin: auto" />
    <ShareNote style="margin: auto" />
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import ShareColl from "~/components/ShareColl.vue"
import ShareNote from "~/components/ShareNote.vue"
import Loading from '~/components/Loading.vue'

export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
    this.$store.dispatch('users/allColls')
  },

  components: {
    ShareColl,
    ShareNote,
    Loading
  },

  data () {
    return {
      newOrgName: "",
      newCollName: "",
      newNoteName: "",
      collBeingEdited: null,
      editingColl: false,
      newName: "",
      showShareColl: false,
      showShareNote: false,
      isPrivate: false,
      selectedOrg: null,
      selectedColl: null,
      level: 1,
      creating: false,
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    newOrg () {
      this.creating = true
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newNote', false)
      this.$store.commit('users/newOrg', true)
    },

    newCollection () {
      this.creating = true
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
      this.creating = true
      if (this.allColls.length === 0) {
        alert('You must first create a collection before you can create a note.')
      }
      else {
        this.$store.commit('users/newOrg', false)
        this.$store.commit('users/newCollection', false)
        this.$store.commit('users/newNote', true)
        this.$store.dispatch('users/allColls')
      }
    },

    async getSharedCollList (coll) {
      await this.$store.dispatch('users/getSharedCollList', {
        collection: coll
      })
      await this.$store.commit('users/setShowShareColl', true)
    },

    async getSharedNoteList (note) {
      await this.$store.dispatch('users/getSharedNoteList', {
         note: note
      })
      await this.$store.commit('users/setShowShareNote', true)
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

    loadCollections (org) {
      this.level++
      this.selectedOrg = org
      this.$store.dispatch('users/collections', {
        orgid: org.orgid
      })
    },

    loadNotes (collection) {
      this.level++
      this.selectedColl = collection
      this.$store.dispatch('users/notes', {
        collectionid: collection.collectionid
      })
    },

    openNote (noteid) {
      this.$store.dispatch('users/openNote', {
        noteid: noteid
      })
    },

    createOrg () {
      if (this.newOrgName === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/createOrg', {
          orgname: this.newOrgName,
          isPrivate: this.isPrivate
        })
        this.cancelNewOrg()
      }
    },

    async createCollection () {
      if (this.newCollName === "") alert('No field may be left empty')
      else {
        await this.$store.dispatch('users/createCollection', {
          collectionname: this.newCollName,
          orgid: this.selectedOrg.orgid
        })
        this.cancelNewCollection()
      }
    },

    createNote () {
      if (this.newNoteName === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/createNote', {
          notename: this.newNoteName,
          collectionid: this.selectedColl.collectionid,
          orgid: this.selectedOrg.orgid
        })
        this.cancelNewNote()
      }
    },

    cancelNewOrg() {
      this.$store.commit('users/newOrg', false)
      this.newOrgName = ""
      this.isPrivate = false
      this.creating = false
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

    cancelNewCollection () {
      this.$store.commit('users/newCollection', false)
      this.newCollName = ""
      this.creating = false
    },

    cancelNewNote() {
      this.$store.commit('users/newNote', false)
      this.newNoteName = ""
      this.creating = false
    },
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    userData () {
      return this.$store.state.users.userData
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

.add-btn {
  vertical-align: baseline;
}

#checkbox-label {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  margin-left: 10px;
  margin-right: 10px;
}

#checkbox {
  width: 20px;
  height: 20px;
}

.card-title {
  word-break: break-all;
}

.joincode-popup {
  background-color: #dddddd;
}

.joincode-1 {
  padding-left: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-decoration: underline;
}

.joincode-2 {
  padding-right: 10px;
  font-size: 13px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

</style>
