<template>
    <div class="modal-overlay" @click="close()">
        <div class="modal" @click.stop>
            <h3>Share Collection</h3>
            <v-divider />
            <div>
            <v-menu
                bottom
                :offset-y="true"
                :close-on-content-click="false"
            >
                <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    class="name-search"
                    v-on="on"
                    v-bind="attrs"
                    v-model="searchText"
                    placeholder="Search by email..."
                    @input="search()"
                >
                </v-text-field>
                </template>
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
            </v-menu>
            </div>
            <div class="share-list">
            <span class="shared-items" v-for="(s, i) in sharedCollList" :key="i">
                {{s.email}}&nbsp;<v-icon size="20" @click="unshareColl(s)">mdi-close</v-icon>
            </span>
            <span class="share-item" v-for="(s, i) in newShareList" :key="i">
                {{s.email}}&nbsp;<v-icon size="20" @click="newShareList.splice(i, 1)">mdi-close</v-icon>
            </span>
            </div>
            <v-btn color="#cccccc" @click="close()">Exit</v-btn>
            <v-btn color="#abddd0" @click="shareColl()">Share</v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ShareColl',

  mounted () {
    this.$store.commit('users/results', [])
  },

  data () {
    return {
        searchText: "",
        newShareList: [],
    }
  },

  methods: {
    async search () {
      await this.$store.dispatch('users/search', {
          searchText: this.searchText,
          orgid: this.collBeingShared.orgid
      })
    },

    pushToList (r) {
        let counter1 = 0
        let counter2 = 0
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

    close () {
      this.searchText = ""
      this.newShareList = []
      this.$emit('close-modal')
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    results () {
      return this.$store.state.users.results
    },

    sharedCollList () {
      return this.$store.state.users.sharedCollList
    },

    collBeingShared () {
      return this.$store.state.users.collBeingShared
    },
  },
}
</script>

<style scoped>
@import '~/assets/styles.css';

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 475px;
  width: 500px;
  margin-top: 6%;
  padding: 0px 0;
  border-radius: 20px;
}

.result-list {
  max-height: 150px;
  position: relative;
}

.share-list {
  background-color: #eeeeee;
  position: inherit;
  margin-top: 35%;
  height: 150px;
  overflow: auto;
  text-align: left;
  width: 100%;
  bottom: 30px;
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
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 3px;
  margin-top: 5px;
  border-radius: 10px;
}

.name-search {
  padding: 5px;
}

</style>
