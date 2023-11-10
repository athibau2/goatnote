<template>
  <v-dialog
      v-model="showShareFolder"
      :width="windowWidth < 800 ? '90%' : '50%'"
      style="z-index: 9999;"
  >
    <v-card class="dialog-card" elevation="5">
      <v-card-title class="basic-header justify-center">Share Folder</v-card-title>
      <v-card-subtitle class="text-center">
        You can share this folder with anyone in the same organization
      </v-card-subtitle>
      <v-divider style="margin-bottom: 10px;" />
      <v-card-text class="search-wrapper">
        <v-text-field
            class="name-search"
            v-model="searchText"
            placeholder="Search by email..."
            @input="search()"
        >
        </v-text-field>
        <v-list class="result-list">
          <v-list-item
              v-for="(r, i) in results" :key="i" link 
              @click="pushToList(r)"
          >
              <v-list-item-subtitle>
                  {{r.firstname}} {{r.lastname}}<v-spacer />{{r.email}}
              </v-list-item-subtitle>
              <v-divider />
          </v-list-item>
        </v-list>
        <div class="share-list">
          <span class="shared-items" v-for="(s, i) in sharedFolderList" :key="i">
              {{s.email}}&nbsp;<v-icon size="20" @click="unshareFolder(s)">mdi-close</v-icon>
          </span>
          <span class="share-item" v-for="(s, i) in newShareList" :key="i">
              {{s.email}}&nbsp;<v-icon size="20" @click="newShareList.splice(i, 1)">mdi-close</v-icon>
          </span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text class="flat-btn" @click="close()">Close</v-btn>
        <v-btn class="good-btn" @click="shareFolder()">Share</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ShareFolder',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  mounted () {
    this.$store.commit('users/results', [])
  },

  data () {
    return {
        searchText: '',
        newShareList: [],
        windowWidth: window.innerWidth,
    }
  },

  methods: {
    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    async search () {
      if (this.searchText != '') {
        await this.$store.dispatch('users/search', {
            searchText: this.searchText,
            orgid: this.folderBeingShared.orgid
        })
      }
    },

    async pushToList (r) {
        let counter1 = 0
        let counter2 = 0

        if ((this.sharedFolderList.length + this.newShareList.length == 3) && this.userData.subscriptionstatus == 'inactive') {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'The maximum sharing limit for this collection on your current plan has been reached. Please upgrade your account to receive unlimited sharing.'
          })
          return
        }

        for (let i = 0; i < this.sharedFolderList.length; ++i) {
          if (this.sharedFolderList[i].userid === r.userid) {
            await this.$store.commit('users/setAlert', {
                color: 'error',
                icon: '$error',
                text: `${r.email} has already been added`
            })
            break;
          }
          else counter1++
        }

        if (counter1 === this.sharedFolderList.length) {
          for (let i = 0; i < this.newShareList.length; ++i) {
            if (this.newShareList[i].userid === r.userid) {
              await this.$store.commit('users/setAlert', {
                color: 'error',
                icon: '$error',
                text: `${r.email} has already been added`
              })
              break;
            }
            else counter2++
          }
          if (counter2 === this.newShareList.length) this.newShareList.push(r)
        }

    },

    async shareFolder() {
        for (let i = 0; i < this.newShareList.length; ++i) {
            this.newShareList[i] = this.newShareList[i].userid
        }
        await this.$store.dispatch('users/shareFolder', {
            folder: this.folderBeingShared,
            users: this.newShareList
        })
        this.newShareList = []
    },

    unshareFolder (s) {
      this.$store.dispatch('users/unshareFolder', {
        folder: this.folderBeingShared,
        userid: s.userid,
        type: "owner"
      })
    },

    async close () {
      this.searchText = ""
      this.newShareList = []
      await this.$store.commit('users/setShowShareFolder', false)
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    userData () {
      return this.$store.state.users.userData
    },

    results () {
      return this.$store.state.users.results
    },

    showShareFolder: {
      get () {
        return this.$store.state.users.showShareFolder
      },

      async set () {
        await this.$store.commit('users/setShowShareFolder', false)
      }
    },

    sharedFolderList () {
      return this.$store.state.users.sharedFolderList
    },

    folderBeingShared () {
      return this.$store.state.users.folderBeingShared
    },

    premiumLink () {
      return this.$store.state.users.products[1].paymentLink
    },

    encodedEmail () {
      return encodeURIComponent(this.$store.state.users.user.email)
    },
  },
}
</script>

<style scoped>
@import '~/assets/styles.css';

.search-wrapper {
  height: auto !important;
}

.result-list {
  max-height: 200px;
  overflow-y: scroll;
}

.share-list {
  background-color: #eeeeee;
  height: 100px;
  overflow: auto;
  text-align: left;
  width: 100%;
  border-radius: 10px;
}

.shared-items {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  background-color: #bdd0e7;
  font-size: 12px;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 3px;
  margin-top: 5px;
  border-radius: 10px;
}

.share-item {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  background-color: #cccccc;
  font-size: 12px;
  padding: 3px;
  margin: 3px;
  border-radius: 10px;
}

.name-search {
  padding: 5px;
}

</style>
