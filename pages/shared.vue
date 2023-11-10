<template>
    <v-app>
      <span>
        <v-tabs background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}} ({{item.tab === 'folders' ? foldersSharedWithMe.length : notesSharedWithMe.length}})
            </v-tab>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item class="shared-list" v-for="item in items" :key="item.tab">
          <!-- List of shared collections -->
          <v-col>
            <Loading v-if="loading" />

            <!-- header for folder content section -->
            <span style="margin: 20px;" v-if="parent != null && level != 0 && tab == 0">
              <span class="basic-header">{{ parent.foldername }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="add-btn"
                    @click="levelBack()"
                    icon
                    v-on="on"
                    v-bind="attrs"
                    :disabled="level == 0"
                  >
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                </template>
                <span>Up One Level</span>
              </v-tooltip>
              <hr>
            </span>

            <div>
              <div class="folder-card"
                v-for="(item, i) in tab == 1 ? notesSharedWithMe : level == 0 ? foldersSharedWithMe : folderContent"
                :key="i"
                @click="level == 0 || item.type == 'folder' ? loadFolderContent(item) : item.type == 'note' ? openNote(item.noteid) : null"
              >
                <span class="basic-header" style="font-size: 18.5px;">
                  <v-icon :style="{'margin-top': '-4px', 'color': tab == 1 ? '#85c59d' : level == 0 ? '#96d0e8' : item.type == 'folder' ? '#96d0e8' : '#85c59d'}">
                    {{ tab == 1 ? 'mdi-note' : level == 0 ? 'mdi-folder' : item.type == 'folder' ? 'mdi-folder' : 'mdi-note'}}
                  </v-icon>&ensp;
                  {{ tab == 1 ? parseFolderName(item.notename) : level == 0 ? parseFolderName(item.foldername) : parseFolderName(item.name) }}
                  <Loading v-if="loadingNote && noteBeingOpened == item.noteid" />
                </span>
                <span>
                  <span class="basic-header"
                    :style="{'font-size': '16px', 'margin-right': windowWidth < 750 ? '40px' : '100px'}"
                    v-if="windowWidth > 600"
                  >
                    {{ level == 0 || tab == 1 ? `${item.firstname} ${item.lastname}` : upperType(item.type) }}
                  </span>
                  <span v-if="level == 0 || tab == 1">
                    <sl-tooltip content="Remove">
                      <v-btn icon small
                        @click.stop="tab == 0 ? removeFolder(item) : removeNote(item)"
                      >
                        <v-icon size="20">mdi-delete</v-icon>
                      </v-btn>
                    </sl-tooltip>
                  </span>
                </span>
              </div>
            </div>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-app>
</template>

<script>
import Loading from '~/components/Loading.vue'
export default {
  name: 'SharedPage',

  components: {
    Loading
  },

  head() {
    return {
      title: 'Shared Notes - GOAT Notes',
      meta: [
        { hid: 'shared-description', name: 'description', content: 'See collections and notes that have been shared with you in GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, share, collaborate' }
      ]
    }
  },

  async created () {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },

  async mounted () {
    this.loading = true
    await this.$store.dispatch('users/loadSharedWithMe')
    this.loading = false
  },

  data () {
    return {
      tab: null,
      loading: false,
      loadingNote: false,
      noteBeingOpened: null,
      selectedFolder: null,
      parent: null,
      parentList: [],
      level: 0,
      items: [
        { tab: 'folders' },
        { tab: 'notes' },
      ],
      windowWidth: window.innerWidth
    }
  },

  methods: {
    async removeFolder(folder) {
      await this.$store.dispatch('users/unshareFolder', {
        folder: folder,
        userid: this.userData.userid,
        type: "receiver"
      })
      this.selectedFolder = null
    },

    async removeNote(note) {
      this.$store.dispatch('users/unshareNote', {
        note: note,
        userid: this.userData.userid,
        type: "receiver"
      })
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

    async levelBack() {
      this.parentList.pop()
      this.level--
      if (this.level != 0) {
        let folder = this.parentList[this.parentList.length - 1]
        this.loadFolderContent(folder, false)
      }
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
      await this.$store.dispatch('users/getFolderContent', {
        parent: item.folderid,
      })
      forward ? this.level++ : null
      this.loading = false
    },

    async openNote(noteid) {
      this.noteBeingOpened = noteid
      this.loadingNote = true
      await this.$store.dispatch('users/openNote', {
        noteid
      })
      this.loadingNote = false
    },
  },

  computed: {
    userData () {
      return this.$store.state.users.userData
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

    folderContentFolders () {
      return this.$store.state.users.folderContentFolders;
    },

    folderContentNotes () {
      return this.$store.state.users.folderContentNotes;
    },

    foldersSharedWithMe () {
      return this.$store.state.users.foldersSharedWithMe
    },

    notesSharedWithMe () {
      let notes = this.$store.state.users.notesSharedWithMe
      notes.forEach(note => {
        note = {
          ...note,
          type: 'note'
        }
      });
      return notes
    },
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.shared-list {
  background-color: #f9f9f9;
  padding-bottom: 10px;
}

.shared-card {
  margin: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
