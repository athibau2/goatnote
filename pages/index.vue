<template>
  <v-app>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <span>
      <span class="basic-header">
        {{level == 1 ? 'Your Organizations' : level == 5 ? `${selectedFolder.foldername}` : level == 2 ? `${selectedOrg.orgname}` : `${selectedColl.collectionname}`}}
      </span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn" 
            @click="level == 1 ? newOrg() : level == 2 || level == 5 ? newCollection() : newNote()"
            icon
            v-on="on"
            v-bind="attrs"
            :disabled="creating"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>New {{level == 1 ? 'Organization' : level == 2 || level == 5 ? 'Collection' : 'Note'}}</span>
      </v-tooltip>

      <v-tooltip bottom v-if="level != 1">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn"
            @click="level == 5 ? level = 2 : level == 3 && inFolder ? level = 5 : level--"
            icon
            v-on="on"
            v-bind="attrs"
            :disabled="creating"
          >
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </template>
        <span>Collapse</span>
      </v-tooltip>
      
      <v-tooltip bottom v-if="level == 2">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn"
            @click="newFolder()"
            icon
            v-on="on"
            v-bind="attrs"
            :disabled="creating"
          >
            <v-icon>mdi-folder-plus</v-icon>
          </v-btn>
        </template>
        <span>New Folder</span>
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

    <!-- Creating a new folder -->
    <v-col v-if="makingNewFolder">
      <v-row justify="center" align="center">
        <v-card class="card" elevation="5" width="400">
          <v-card-title class="basic-header" style="word-break: break-word;">
              New Folder
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
                v-model="newFolderName" 
                placeholder="Name (e.g. Winter 2024 or Generals)"
              >
              </v-text-field>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn text class="flat-btn" @click="cancelNewFolder()">
                  Cancel
              </v-btn>
              <v-btn class="good-btn" @click="createFolder()">
                  Add
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

    <Loading v-if="loading" />

    <span class="notice text-center"
      v-if="(orgs === null || orgs === undefined || orgs.length === 0) && level == 1 && !loading"
    >
      You are currently not part of any organizations, such as your school. Create one above or 
      <nuxt-link to="/joinOrg">join one</nuxt-link>!
    </span>

    <span class="notice text-center"
      v-if="(folders === null || folders === undefined || folders.length === 0) && level == 5 && !loading" 
    >
      You currently have no collections in this folder. Create one above!
    </span>

    <span class="notice text-center"
      v-if="(collections === null || collections === undefined || collections.length === 0) && level == 2 && !loading" 
    >
      You currently have no collections in this organization. Create one above!
    </span>

    <span class="notice text-center"
      v-if="(notes === null || notes === undefined || notes.length === 0) && level == 3 && !loading"
    >
      You currently have no notes in this collection. Create one above!
    </span>

    <!-- List of orgs -->
    <v-col v-if="level == 1">
      <v-row v-if="orgs.length != 0">
        <v-card class="card" elevation="5" width="250" v-for="(org, i) in orgs" :key="i">
          <v-card-title class="card-title">
              {{parseOrgName(org.orgname)}}
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
                    @click="codeCopied = false"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="joincode-popup">
                  <span class="joincode-1">Join code:</span>
                  <span class="joincode-2">&ensp;{{org.joincode}}</span>
                  <button @click="copyCode(org.joincode)">
                    <v-icon size="20"
                      :style="codeCopied ? {'color': '#7bbb93'} : null"
                    >
                      {{codeCopied ? 'mdi-check-bold' : 'mdi-content-copy'}}
                    </v-icon>
                  </button>
                </v-list>
              </v-menu>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn text class="flat-btn" @click="leaveOrg(org.orgid)">Leave</v-btn>
            <v-btn class="good-btn" @click="loadFolders(org)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- List of folders -->
    <v-col v-if="level == 2 && folders.length != 0" style="max-height: 90px; overflow-x: scroll;">
      <v-row>
        <button @click="loadFolderColls(folder)" v-for="(folder, i) in folders" :key="i">
          <div class="folder-card">
            <v-icon>mdi-folder</v-icon>&ensp;
            <span class="basic-header" style="font-size: 20px;">{{folder.foldername}}</span>
          </div>
        </button>
      </v-row>
    </v-col>

    <!-- List of folder collections -->
    <v-col v-if="level == 5">
      <v-row>
        <v-card class="coll-card"
          elevation="5"
          width="250"
          v-for="(coll, i) in folderColls"
          :key="i"
          :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${coll.color})`}"
        >
          <v-tooltip top v-if="!editingColl || (editingColl && coll.collectionid !== collBeingEdited)">
            <template v-slot:activator="{ on, attrs }">
              <span class="coll-card-title">
                <button @click="setEditColl(coll)"
                  :disabled="(editingColl && coll.collectionid !== collBeingEdited) ? true : false"
                  v-on="on"
                  v-bind="attrs"
                >
                  {{parseCollName(coll.collectionname)}}
                </button>
              </span>
            </template>
            <span>Edit Name</span>
          </v-tooltip>
          <v-menu top offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="color-picker-btn"
                v-on="on"
                v-bind="attrs"
                @click="setChooseColor(coll)"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
            <div class="color-picker">
              <button class="color-choice"
                v-for="(color, i) in colors"
                :key="i"
                @click="updateColor(color, coll)"
                :style="{'background-color': color}"
              ></button>
            </div>
          </v-menu>
          <v-card-title v-if="editingColl && coll.collectionid == collBeingEdited">
            <v-text-field
              :value="coll.collectionname"
              append-icon="mdi-pencil"
              @click:append="editingColl = !editingColl"
              @input="textChanged($event)"
              @keyup.enter="updateColl(coll)"
            >
            </v-text-field>
          </v-card-title>
          <v-card-actions style="margin-top: 20px;">
            <v-spacer />
            <v-menu top offset-y
              v-model="menuOpen"
              @click:outside="menuOpen = false"
              v-if="!menuOpen || collBeingMoved?.collectionid == coll.collectionid"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tooltip top v-on="on" v-bind="attrs">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleMenu(coll)"
                    >
                      <v-icon>mdi-folder-move</v-icon>
                    </v-btn>
                  </template>
                  <span>Move</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item link @click="moveToFolder(coll, null)">
                  <span>None</span>
                </v-list-item>
                <v-list-item link
                  v-for="(folder, i) in folders"
                  :key="i"
                  @click="moveToFolder(coll, folder.folderid)"
                >
                  <span>{{folder.foldername}}</span>
                </v-list-item>
              </v-list>
            </v-menu>
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
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteCollection(coll.collectionid, coll.orgid)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <v-btn text class="flat-btn" @click="loadNotes(coll)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- List of collections -->
    <v-col v-if="level == 2">
      <v-row>
        <v-card class="coll-card"
          elevation="5"
          width="250"
          v-for="(coll, i) in collections"
          :key="i"
          :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${coll.color})`}"
        >
          <v-tooltip top v-if="!editingColl || (editingColl && coll.collectionid !== collBeingEdited)">
            <template v-slot:activator="{ on, attrs }">
              <span class="coll-card-title">
                <button @click="setEditColl(coll)"
                  :disabled="(editingColl && coll.collectionid !== collBeingEdited) ? true : false"
                  v-on="on"
                  v-bind="attrs"
                >
                  {{parseCollName(coll.collectionname)}}
                </button>
              </span>
            </template>
            <span>Edit Name</span>
          </v-tooltip>
          <v-menu top offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="color-picker-btn"
                v-on="on"
                v-bind="attrs"
                @click="setChooseColor(coll)"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
            <div class="color-picker">
              <button class="color-choice"
                v-for="(color, i) in colors"
                :key="i"
                @click="updateColor(color, coll)"
                :style="{'background-color': color}"
              ></button>
            </div>
          </v-menu>
          <v-card-title v-if="editingColl && coll.collectionid == collBeingEdited">
            <v-text-field
              :value="coll.collectionname"
              append-icon="mdi-pencil"
              @click:append="editingColl = !editingColl"
              @input="textChanged($event)"
              @keyup.enter="updateColl(coll)"
            >
            </v-text-field>
          </v-card-title>
          <v-card-actions style="margin-top: 20px;">
            <v-spacer />
            <v-menu top offset-y
              v-model="menuOpen"
              @click:outside="menuOpen = false"
              v-if="!menuOpen || collBeingMoved?.collectionid == coll.collectionid"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tooltip top v-on="on" v-bind="attrs">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleMenu(coll)"
                    >
                      <v-icon>mdi-folder-move</v-icon>
                    </v-btn>
                  </template>
                  <span>Move</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item link @click="moveToFolder(coll, null)">
                  <span>None</span>
                </v-list-item>
                <v-list-item link
                  v-for="(folder, i) in folders"
                  :key="i"
                  @click="moveToFolder(coll, folder.folderid)"
                >
                  <span>{{folder.foldername}}</span>
                </v-list-item>
              </v-list>
            </v-menu>
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
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteCollection(coll.collectionid, coll.orgid)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <v-btn text class="flat-btn" @click="loadNotes(coll)">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>

    <!-- List of notes -->
    <v-col v-if="level == 3">
      <v-row>
        <v-card class="note-card"
          elevation="5"
          width="300"
          v-for="(note, i) in notes"
          :key="i"
          :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${selectedColl.color})`}"
        >
          <v-card-title class="card-title">
              {{parseNoteName(note.notename)}}
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
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteNote(note.noteid, note.collectionid)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <v-btn text class="flat-btn" @click="openNote(note.noteid)" :disabled="loadingNote">
              <Loading v-if="loadingNote && noteBeingOpened == note.noteid" />
              {{loadingNote && noteBeingOpened == note.noteid ? null : 'Open'}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
    <ShareColl style="margin: auto" />
    <ShareNote style="margin: auto" />
  </v-app>
</template>

<script>
import ShareColl from "~/components/ShareColl.vue"
import ShareNote from "~/components/ShareNote.vue"
import Loading from '~/components/Loading.vue'

export default {
  name: 'IndexPage',

  head() {
    return {
      title: 'Home - GOAT Notes',
      meta: [
        { hid: 'home-description', name: 'description', content: 'GOAT Notes home page; view your organizations, collections, and notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, home page, organization' }
      ]
    }
  },

  async mounted () {
    if (this.userData != null) {
      this.loading = true
      await this.$store.dispatch('users/orgs')
      this.loading = false
    }
  },

  components: {
    ShareColl,
    ShareNote,
    Loading
  },

  data () {
    return {
      menuOpen: false,
      codeCopied: false,
      loadingNote: false,
      loading: false,
      noteBeingOpened: null,
      newOrgName: "",
      newCollName: "",
      newNoteName: "",
      newFolderName: '',
      inFolder: false,
      collBeingEdited: null,
      collBeingMoved: null,
      editingColl: false,
      newName: null,
      showShareColl: false,
      showShareNote: false,
      isPrivate: false,
      selectedOrg: null,
      selectedColl: null,
      selectedFolder: null,
      level: 1,
      creating: false,
      windowWidth: window.innerWidth,
      colors: [
        '#FFC4CB',
        '#FAC3E0',
        '#FFDAB3',
        '#FFF9C0',
        '#FFD700',
        '#C0FBCF',
        '#85C59D',
        '#B3E5FC',
        '#AFEEEE',
        '#B5A1E2',
        '#E6E6FA',
        '#D3D3D3',
      ]
    }
  },

  watch: {
    async level(newValue, oldValue) {
      if (newValue == 1 || newValue == 2) this.inFolder = false
      if (newValue == 5 || (newValue == 3 && oldValue == 5)) this.inFolder = true
      if (newValue == 3 && oldValue == 2) this.inFolder = false
      if (newValue == 2 && oldValue == 5) {
        await this.$store.dispatch('users/collections', {
          orgid: this.selectedOrg.orgid
        })
      }
    },

    menuOpen(newValue, oldValue) {
      if (newValue == false) {
        this.collBeingMoved = null
      }
    },
  },

  methods: {
    copyCode(code) {
      this.codeCopied = true
      navigator.clipboard.writeText(code).catch(function(err) {
        console.error('Unable to copy text to clipboard', err);
      });
    },

    parseOrgName(name) {
      if (name.length >= 16) {
        let short = name.substring(0, 16) + '...'
        return short
      } else return name
    },
    
    parseCollName(name) {
      if (name.length >= 24) {
        let short = name.substring(0, 24) + '...'
        return short
      } else return name
    },
    
    parseNoteName(name) {
      if (name.length >= 30) {
        let short = name.substring(0, 30) + '...'
        return short
      } else return name
    },

    async moveToFolder(coll, folderid) {
      await this.$store.dispatch('users/moveCollToFolder', {
        collectionid: coll.collectionid,
        folderid: folderid,
        currentFolderid: this.selectedFolder?.folderid ?? null,
        orgid: coll.orgid,
        level: this.level
      })
    },

    toggleMenu(coll) {
      this.collBeingMoved = coll
      this.menuOpen = !this.menuOpen;
    },

    newOrg () {
      this.creating = true
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newFolder', false)
      this.$store.commit('users/newNote', false)
      this.$store.commit('users/newOrg', true)
    },

    async newFolder() {
      this.creating = true
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newFolder', true)
      this.$store.commit('users/newNote', false)
      this.$store.commit('users/newOrg', false)
    },

    async newCollection () {
      this.creating = true
      if (this.orgs.length === 0) {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'You must first create an organization before you can create a collection.'
        })
      }
      else {
        this.$store.commit('users/newNote', false)
        this.$store.commit('users/newOrg', false)
        this.$store.commit('users/newFolder', false)
        this.$store.commit('users/newCollection', true)
      }
    },

    newNote() {
      this.creating = true
      this.$store.commit('users/newOrg', false)
      this.$store.commit('users/newFolder', false)
      this.$store.commit('users/newCollection', false)
      this.$store.commit('users/newNote', true)
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

    async updateColor(color, coll) {
      await this.$store.dispatch('users/updateCollColor', {
        collectionid: coll.collectionid,
        color: color,
        orgid: coll.orgid,
        folderid: this.level == 5 ? this.selectedFolder.folderid : null
      })
      this.collBeingEdited = null
    },

    setEditColl (coll) {
      this.editingColl = !this.editingColl
      if (this.editingColl) this.collBeingEdited = coll.collectionid
      else this.collBeingEdited = null
    },

    setChooseColor(coll) {
      this.collBeingEdited = coll.collectionid
    },

    async updateColl (coll) {
      if (!this.newName) {
        this.setEditColl()
      } else {
        await this.$store.dispatch('users/updateCollName', {
          collectionid: coll.collectionid,
          newName: this.newName,
          orgid: coll.orgid,
          folderid: this.level == 5 ? this.selectedFolder.folderid : null
        })
        this.setEditColl()
      }
    },

    async loadFolders (org) {
      this.loading = true
      this.level++
      this.selectedOrg = org
      await this.$store.dispatch('users/getFolders', {
        orgid: org.orgid,
        userid: this.userData.userid
      })
      await this.$store.dispatch('users/collections', {
        orgid: org.orgid
      })
      this.loading = false
    },

    async loadFolderColls(folder) {
      this.loading = true
      this.level = 5
      this.selectedFolder = folder
      await this.$store.dispatch('users/folderColls', {
        folderid: folder.folderid
      })
      this.loading = false
    },

    async loadNotes (collection) {
      this.loading = true
      this.level == 5 ? this.level = 3 : this.level++
      this.selectedColl = collection
      await this.$store.dispatch('users/notes', {
        collectionid: collection.collectionid
      })
      this.loading = false
    },

    openNote (noteid) {
      this.noteBeingOpened = noteid
      this.loadingNote = true
      this.$store.dispatch('users/openNote', {
        noteid: noteid
      })
    },

    async createOrg () {
      if (this.newOrgName === "") {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'No field may be left empty'
        })
      } else {
        this.$store.dispatch('users/createOrg', {
          orgname: this.newOrgName,
          isPrivate: this.isPrivate
        })
        this.cancelNewOrg()
      }
    },

    async createFolder() {
      if (this.newFolderName == '') {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'No field may be left empty.'
        })
      } else {
        await this.$store.dispatch('users/createFolder', {
          foldername: this.newFolderName,
          orgid: this.selectedOrg.orgid
        })
        this.cancelNewFolder()
      }
    },

    async createCollection () {
      if (this.newCollName === "") {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'No field may be left empty.'
        })
      }
      else {
        await this.$store.dispatch('users/createCollection', {
          collectionname: this.newCollName,
          orgid: this.selectedOrg.orgid,
          folderid: this.level == 5 ? this.selectedFolder.folderid : null
        })
        this.cancelNewCollection()
      }
    },

    async createNote () {
      if (this.newNoteName === "") {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'No field may be left empty.'
        })
      }
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

    cancelNewFolder() {
      this.$store.commit('users/newFolder', false)
      this.newFolderName = ""
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
      if (confirm("Are you sure you want to delete this note? This will also delete all flashcards, files, whiteboards, and links inside this note.")) {
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
    supabaseUser () {
      return this.$store.state.users.supabaseUser
    },

    supabaseSession () {
      return this.$store.state.users.supabaseSession
    },

    userData () {
      return this.$store.state.users.userData
    },

    orgs () {
      return this.$store.state.users.orgs
    },

    collections () {
      return this.$store.state.users.collections
    },

    folders () {
      return this.$store.state.users.folders
    },
    
    folderColls () {
      return this.$store.state.users.folderColls
    },

    notes () {
      return this.$store.state.users.notes
    },

    makingNewOrg () {
      return this.$store.state.users.makingNewOrg
    },
    
    makingNewFolder () {
      return this.$store.state.users.makingNewFolder
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

.coll-card {
  position: relative;
  padding-top: 15px;
  margin: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.folder-card {
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 8px;
  box-shadow: 0px 0px 4px #2F2B28;
  height: 50px;
  width: auto;
}

.folder-card:hover {
  opacity: 0.7;
}

.note-card {
  margin: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.coll-card-title {
  word-break: break-all;
  margin: 15px;
  font-size: 18px;
}

.color-picker-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}

.color-picker {
  background-color: #eeeeee;
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 20px);
  grid-gap: 3px;
  height: 100px;
  width: 80px;
}

.color-choice {
  height: 20px;
  width: 20px;
  border: solid 1px #bbbbbb;
  border-radius: 4px;
}

.color-choice:hover {
  opacity: 0.6;
}

.joincode-popup {
  padding: 10px;
  background-color: #dddddd;
}

.joincode-1 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-decoration: underline;
}

.joincode-2 {
  font-size: 13px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

</style>
