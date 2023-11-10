<template>
  <v-app>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <!-- Header buttons -->
    <span>
      <span class="basic-header">
        {{level == 1 ? 'Your Organizations' : parseOrgName(parent.name)}}
      </span>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="add-btn"
            @click="levelBack()"
            icon
            v-on="on"
            v-bind="attrs"
            :disabled="level == 1"
          >
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </template>
        <span>Up One Level</span>
      </v-tooltip>

      <span>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="add-btn" 
              @click="openNewItemDialog(level == 1 ? 1 : 2)"
              icon
              v-on="on"
              v-bind="attrs"
              >
              <v-icon :style="{'color': level == 1 ? '#2F2B28' : '#85c59d'}">
                {{ level == 1 ? 'mdi-plus' : 'mdi-note-plus' }}
              </v-icon>
            </v-btn>
          </template>
          <span>New {{level == 1 ? 'Organization' : 'Note'}}</span>
        </v-tooltip>
        
        <v-tooltip bottom v-if="level != 1">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="add-btn"
              @click="openNewItemDialog(3)"
              icon
              v-on="on"
              v-bind="attrs"
              >
              <v-icon style="color: #96d0e8">mdi-folder-plus</v-icon>
            </v-btn>
          </template>
          <span>New Folder</span>
        </v-tooltip>
      </span>
    </span>
    
    <hr>
    <Loading v-if="loading" />
  
    <!-- Creating a new item -->
    <sl-dialog class="dialog-overview"
      :label="`New ${creationType == 1 ? 'Organization' : creationType == 2 ? 'Note' : 'Folder'}`"
    >
      <v-text-field
        class="selector"
        dense
        solo
        rounded
        background-color="#f1f1f1"
        v-model="newItemName"
        @keyup.enter="createNewItem()"
        :placeholder="`Name (e.g. ${creationType == 1 ? 'Harvard University' : creationType == 2 ? 'World War II' : 'History 100'})`"
      >
      </v-text-field>
      <v-card-actions>
        <v-checkbox v-if="creationType == 1" v-model="isPrivate" label="Make Private"></v-checkbox>
        <v-spacer />
        <v-btn class="good-btn" nuxt @click="createNewItem()">
            Create
        </v-btn>
      </v-card-actions>
    </sl-dialog>

    <span class="notice text-center"
      v-if="(orgs === null || orgs === undefined || orgs.length === 0) && level == 1 && !loading"
    >
      You are currently not part of any organizations, such as your school. Create one above or 
      <nuxt-link to="/joinOrg">join an existing one</nuxt-link>!
    </span>

    <span class="notice text-center"
      v-if="(orgContent === null || orgContent === undefined || orgContent.length === 0) && level == 2 && !loading" 
    >
      No content here.
    </span>

    <span class="notice text-center"
      v-if="(folderContent === null || folderContent === undefined || folderContent.length === 0) && level == 3 && !loading"
    >
      No content here.
    </span>

    <!-- List of Orgs -->
    <v-row>
      <!-- <v-col cols="5">
        <FolderTree />
      </v-col> -->
      <v-col>
        <div v-if="level == 1">
          <div class="folder-card"
            @click="loadOrgContent(org)"
            v-for="(org, i) in orgs"
            :key="i"
          >
            <span class="basic-header" style="font-size: 18.5px; letter-spacing: 1px;">
              <v-icon style="margin-top: -4px; color: #2F2B28">mdi-domain</v-icon>&ensp;
              {{windowWidth < 600 ? parseOrgName(org.orgname) : org.orgname}}
            </span>
            <span>
              <span class="basic-header"
                :style="{'font-size': '16px', 'margin-right': windowWidth < 750 ? '40px' : '100px'}"
                v-if="windowWidth > 600"
              >
                Organization
              </span>
              <sl-tooltip content="Copy Join Code">
                <v-btn icon small @click.stop="copyCode(org.joincode)" style="margin-right: 4px;">
                  <v-icon size="20"
                    :style="isCodeCopied && copiedCode == org.joincode ? {'color': '#7bbb93'} : null"
                    >
                    {{isCodeCopied && copiedCode == org.joincode ? 'mdi-check-bold' : 'mdi-content-copy'}}
                  </v-icon>
                </v-btn>
              </sl-tooltip>
              <sl-tooltip content="Leave Organization">
                <v-btn icon small @click.stop="leaveOrg(org.orgid)">
                  <v-icon>mdi-close-octagon</v-icon>
                </v-btn>
              </sl-tooltip>
            </span>
          </div>
        </div>

        <!-- Listing Org / Folder Contents -->
        <div v-if="level != 1">
          <div class="folder-card"
            v-for="(item, i) in inOrgContent ? orgContent : folderContent"
            :key="i"
            @click="item.type == 'folder' ? loadFolderContent(item) : item.type == 'note' ? openNote(item.noteid) : null"
          >
            <span class="basic-header" style="font-size: 18.5px;">
              <v-icon :style="{'margin-top': '-4px', 'color': item.type == 'folder' ? '#96d0e8' : '#85c59d'}">
                {{item.type == 'folder' ? 'mdi-folder' : item.type == 'note' ? 'mdi-note' : 'mdi-rhombus-split'}}
              </v-icon>&ensp;
              {{!editingItem || item != itemBeingEdited ? parseFolderName(item.name) : null}}
              <input class="editing-input"
                autofocus
                v-if="editingItem && item == itemBeingEdited"
                @click.stop
                @keydown.enter="updateItemName()"
                v-model="newName"
              />
              <Loading v-if="loadingNote && noteBeingOpened == item.noteid" />
            </span>
            <span>
              <span class="basic-header"
                :style="{'font-size': '16px', 'margin-right': windowWidth < 750 ? '40px' : '100px'}"
                v-if="windowWidth > 600"
              >
                {{upperType(item.type)}}
              </span>
              <span v-if="windowWidth <= 450">
                <v-menu offset-y top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn small icon
                      v-on="on"
                      v-bind="attrs"
                      @click.stop
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense style="padding: 2px;">
                    <sl-tooltip content="Edit">
                      <v-btn icon small
                        style="margin-right: 5px;"
                        @click.stop="editItemName(item)"
                        :disabled="editingItem && item != itemBeingEdited"
                      >
                        <v-icon size="20">mdi-pencil</v-icon>
                      </v-btn>
                    </sl-tooltip>
                    <sl-tooltip content="Share">
                      <v-btn icon small
                        style="margin-right: 5px;"
                        @click.stop="getItemSharedList(item)"
                      >
                        <v-icon size="20">mdi-share-variant</v-icon>
                      </v-btn>
                    </sl-tooltip>
                    <sl-tooltip content="Delete">
                      <v-btn icon small
                      @click.stop="deleteItem(item)"
                      >
                        <v-icon size="20">mdi-delete</v-icon>
                      </v-btn>
                    </sl-tooltip>
                  </v-list>
                </v-menu>
              </span>
              <span v-if="windowWidth > 450">
                <sl-tooltip content="Edit">
                  <v-btn icon small
                    style="margin-right: 5px;"
                    @click.stop="editItemName(item)"
                    :disabled="editingItem && item != itemBeingEdited"
                  >
                    <v-icon size="20">mdi-pencil</v-icon>
                  </v-btn>
                </sl-tooltip>
                <sl-tooltip content="Share">
                  <v-btn icon small
                    style="margin-right: 5px;"
                    @click.stop="getItemSharedList(item)"
                  >
                    <v-icon size="20">mdi-share-variant</v-icon>
                  </v-btn>
                </sl-tooltip>
                <sl-tooltip content="Delete">
                  <v-btn icon small
                  @click.stop="deleteItem(item)"
                  >
                    <v-icon size="20">mdi-delete</v-icon>
                  </v-btn>
                </sl-tooltip>
              </span>
            </span>
          </div>
        </div>
      </v-col>
    </v-row>

    <ShareFolder style="margin: auto" />
    <ShareNote style="margin: auto" />
  </v-app>
</template>

<script>
import ShareFolder from "~/components/ShareFolder.vue"
import ShareNote from "~/components/ShareNote.vue"
import Loading from '~/components/Loading.vue'
import FolderTree from '~/components/FolderTree.vue'

export default {
  name: 'IndexPage',

  head() {
    return {
      title: 'Home - GOAT Notes',
      meta: [
        { hid: 'home-description', name: 'description', content: 'GOAT Notes home page; view your organizations, folders, and notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, home page, organization' }
      ]
    }
  },

  async created () {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },

  async mounted () {
    if (this.userData != null) {
      this.loading = true
      await this.$store.dispatch('users/orgs')
      this.loading = false
    }
  },

  components: {
    ShareFolder,
    ShareNote,
    Loading,
    FolderTree,
  },

  data () {
    return {
      isCodeCopied: false,
      copiedCode: '',
      loadingNote: false,
      loading: false,
      noteBeingOpened: null,
      newItemName: '',
      itemBeingEdited: null,
      editingItem: false,
      newName: null,
      showShareNote: false,
      isPrivate: false,
      selectedOrg: null,
      selectedFolder: null,
      inOrgContent: false,
      parent: null,
      parentList: [],
      level: 1,
      creating: false,
      creationType: null,
      windowWidth: window.innerWidth,
    }
  },

  watch: {
  },

  methods: {
    copyCode(code) {
      this.copiedCode = code
      navigator.clipboard.writeText(code)
      .then(() => {
        this.isCodeCopied = true
      })
      .catch(function(err) {
        console.error('Unable to copy text to clipboard', err);
      });
      setTimeout(() => {
        this.isCodeCopied = false
      }, 2000);
    },

    editItemName(item) {
      this.newName = item.name
      this.itemBeingEdited = item
      this.editingItem = !this.editingItem
    },

    async updateItemName() {
      if (this.newName === '') {
        await this.$store.commit('users/setAlert', {
          color: 'error',
          icon: '$error',
          text: 'Name field may not be left empty.'
        })
      } else {
        switch(this.itemBeingEdited.type) {
          case 'folder':
            await this.$store.dispatch('users/updateFolder', {
              foldername: this.newName,
              folderid: this.itemBeingEdited.folderid,
              parent: this.itemBeingEdited.parent,
              orgid: this.itemBeingEdited.orgid
            })
            break;
          case 'note':
            await this.$store.dispatch('users/updateNoteName', {
              newNoteName: this.newName,
              noteid: this.itemBeingEdited.noteid,
              parent: this.itemBeingEdited.parent,
            })
            break;
          default:
            break;
        }
        this.editingItem = !this.editingItem
        this.itemBeingEdited = {}
      }
    },

    parseOrgName(name) {
      let max = this.windowWidth < 500 ? 16 : 30
      if (name.length >= max) {
        let short = name.substring(0, max) + '...'
        return short
      } else return name
    },
    
    parseFolderName(name) {
      if (name.length >= 30) {
        let short = name.substring(0, 30) + '...'
        return short
      } else return name
    },

    upperType(type) {
      let first = type[0].toUpperCase()
      return first + type.slice(1)
    },

    async getSharedNoteList(note) {
      await this.$store.dispatch('users/getSharedNoteList', {
         note: note
      })
      await this.$store.commit('users/setShowShareNote', true)
    },

    async getItemSharedList(item) {
      switch(item.type) {
        case 'folder':
          await this.$store.dispatch('users/getFolderSharedList', {
            folder: item
          })
          await this.$store.commit('users/setShowShareFolder', true)
          break;
        case 'note':
          await this.$store.dispatch('users/getSharedNoteList', {
            note: {
              ...item,
              orgid: this.selectedOrg.orgid
            }
          })
          await this.$store.commit('users/setShowShareNote', true)
          break;
        default:
          break;
      }
    },

    async deleteItem(item) {
      switch(item.type) {
        case 'folder':
          if (confirm('Are you sure you want to delete this folder and everything in it?')) {
            await this.$store.dispatch('users/deleteFolder', {
              folder: item
            })
          }
          break;
        case 'note':
          if (confirm('Are you sure you want to delete this note?')) {
            await this.$store.dispatch('users/deleteNote', {
              note: item,
              orgid: this.selectedOrg.orgid,
            })
          }
          break;
        default:
          break;
      }
    },

    async levelBack() {
      if (typeof this.parent.parent == 'number') {
        this.level = 3
        this.parentList.pop()
        let folder = this.parentList[this.parentList.length - 1]
        this.loadFolderContent(folder, false)
      } else {
        switch(this.parent.parent) {
          case undefined:
            this.level = 1
            break;
          case null:
            this.level = 2
            let org = this.orgs.find(org => org.orgid == this.parent.orgid)
            this.loadOrgContent(org)
            break;
          default:
            break;
        }
      }
    },

    openNewItemDialog(type) {
      this.creating = true
      this.creationType = type
      this.isPrivate = false
      this.newItemName = ''
      const dialog = document.querySelector('.dialog-overview');
      dialog.show()
    },

    textChanged(event) {
      console.log(event)
      this.newName = event
    },

    async loadOrgContent(org) {
      this.loading = true
      org.name = org.orgname
      this.selectedOrg = org
      this.parentList.push({...org, type: 'org'})
      this.parent = {
        ...org,
        type: 'org'
      }
      localStorage.setItem('files-parent', JSON.stringify(this.parent))
      this.inOrgContent = true
      await this.$store.dispatch('users/getOrgContent', {
        orgid: org.orgid,
      })
      this.level = 2
      this.loading = false
    },

    async loadFolderContent(item, forward = true) {
      this.loading = true
      this.selectedFolder = item
      if (forward) {
        this.parentList.push({...item, type: 'folder'})
        this.parent = {
          ...item,
          type: 'folder'
        }
      } else this.parent = item
      localStorage.setItem('files-parent', JSON.stringify(this.parent))
      this.inOrgContent = false
      await this.$store.dispatch('users/getFolderContent', {
        parent: item.folderid,
      })
      this.level = 3
      this.loading = false
    },

    async openNote(noteid) {
      localStorage.setItem('notes-parent', JSON.stringify(this.parent))
      this.noteBeingOpened = noteid
      this.loadingNote = true
      await this.$store.dispatch('users/openNote', {
        noteid: noteid
      })
    },

    async createNewItem() {
      if (this.newItemName === '') {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Name field may not be left empty.'
        })
      } else {
        switch (this.creationType) {
          case 1:
            await this.$store.dispatch('users/createOrg', {
              orgname: this.newItemName,
              isPrivate: this.isPrivate
            })
            break;
          case 2:
            await this.$store.dispatch('users/createNote', {
              notename: this.newItemName,
              parent: this.parent.type == 'org' ? null : this.parent.folderid
            })
            break;
          case 3:
            await this.$store.dispatch('users/createFolder', {
              foldername: this.newItemName,
              orgid: this.selectedOrg.orgid,
              parent: this.parent.type == 'org' ? null : this.parent.folderid
            })
            break;
          default:
            break;
        }
        const dialog = document.querySelector('.dialog-overview');
        dialog.hide()
      }
    },

    async createNote () {
      if (this.newItemName === "") {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Name field may not be left empty.'
        })
      }
      else {
        
        const dialog = document.querySelector('.dialog-overview');
        dialog.hide()
      }
    },

    leaveOrg(orgid) {
      if (confirm("Are you sure you want to leave this organization? You will lose access to all folders and notes inside this organization.")) {
        this.$store.dispatch('users/leaveOrg', {
        orgid: orgid
        })
      }
    },

    deleteNote(note) {
      if (confirm("Are you sure you want to delete this note?")) {
        this.$store.dispatch('users/deleteNote', {
          note: note,
          orgid: this.selectedOrg.orgid
        })
      }
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

    orgContent () {
      const combinedContent = [
        ...this.orgContentFolders.map(item => ({ ...item, name: item.foldername, type: 'folder' })),
        ...this.orgContentNotes.map(item => ({ ...item, name: item.notename, type: 'note' })),
      ];

      combinedContent.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      return combinedContent;
    },
    
    folderContent () {
      const combinedContent = [
        ...this.folderContentFolders.map(item => ({ ...item, name: item.foldername, type: 'folder' })),
        ...this.folderContentNotes.map(item => ({ ...item, name: item.notename, type: 'note' })),
      ];

      combinedContent.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      return combinedContent;
    },

    orgContentFolders () {
      return this.$store.state.users.orgContentFolders;
    },

    orgContentNotes () {
      return this.$store.state.users.orgContentNotes;
    },
    
    folderContentFolders () {
      return this.$store.state.users.folderContentFolders;
    },

    folderContentNotes () {
      return this.$store.state.users.folderContentNotes;
    },
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.add-btn {
  vertical-align: baseline;
}

#dialog-overview__content {
  z-index: 9999 !important;
}

.editing-input {
  border: solid 1px #2F2B28;
  border-radius: 4px;
  padding: 2px 4px;
}

.folder-card {
  margin: 3px auto;
  padding: 3px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid 1px;
  border-radius: 4px;
  box-shadow: 0px 0px 2px #2F2B28;
  width: 90%;
}

.folder-card:hover {
  opacity: 0.65;
  cursor: pointer;
}

</style>
