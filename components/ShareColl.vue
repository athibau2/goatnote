<template>
  <v-dialog
      v-model="showShareColl"
      :width="windowWidth < 800 ? '90%' : '50%'"
  >
    <v-card class="dialog-card" elevation="5">
      <v-card-title class="basic-header justify-center">Share Collection</v-card-title>
      <v-card-subtitle class="text-center">
        You can share this collection with anyone in the same organization
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
          <span class="shared-items" v-for="(s, i) in sharedCollList" :key="i">
              {{s.email}}&nbsp;<v-icon size="20" @click="unshareColl(s)">mdi-close</v-icon>
          </span>
          <span class="share-item" v-for="(s, i) in newShareList" :key="i">
              {{s.email}}&nbsp;<v-icon size="20" @click="newShareList.splice(i, 1)">mdi-close</v-icon>
          </span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text class="flat-btn" @click="close()">Close</v-btn>
        <v-btn class="good-btn" @click="shareColl()">Share</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ShareColl',

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
            orgid: this.collBeingShared.orgid
        })
      }
    },

    pushToList (r) {
        let counter1 = 0
        let counter2 = 0

        if ((this.sharedCollList.length + this.newShareList.length == 3) && this.userData.subscriptionstatus == 'inactive') {
          if (confirm('The maximum sharing limit for this collection on your current plan has been reached. Click \'OK\' to be redirected to upgrade your account.')) {
            window.location.href = `${this.premiumLink}?prefilled_email=${this.encodedEmail}`
          }
          return
        }

        for (let i = 0; i < this.sharedCollList.length; ++i) {
          if (this.sharedCollList[i].userid === r.userid) {
            alert(`${r.email} has already been added`)
            break
          }
          else counter1++
        }

        if (counter1 === this.sharedCollList.length) {
          for (let i = 0; i < this.newShareList.length; ++i) {
            if (this.newShareList[i].userid === r.userid) {
              alert(`${r.email} has already been added`)
              break
            }
            else counter2++
          }
          if (counter2 === this.newShareList.length) this.newShareList.push(r)
        }

    },

    async shareColl() {
        for (let i = 0; i < this.newShareList.length; ++i) {
            this.newShareList[i] = this.newShareList[i].userid
        }
        await this.$store.dispatch('users/shareColl', {
            collection: this.collBeingShared,
            users: this.newShareList
        })
        this.newShareList = []
    },

    unshareColl (s) {
      this.$store.dispatch('users/unshareColl', {
        collection: this.collBeingShared,
        userid: s.userid,
        type: "owner"
      })
    },

    async close () {
      this.searchText = ""
      this.newShareList = []
      await this.$store.commit('users/setShowShareColl', false)
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

    showShareColl: {
      get () {
        return this.$store.state.users.showShareColl
      },

      async set () {
        await this.$store.commit('users/setShowShareColl', false)
      }
    },

    sharedCollList () {
      return this.$store.state.users.sharedCollList
    },

    collBeingShared () {
      return this.$store.state.users.collBeingShared
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
