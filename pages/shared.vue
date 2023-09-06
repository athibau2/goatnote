<template>
    <v-app>
      <span>
        <v-tabs background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}} ({{item.tab === 'collections' ? collsSharedWithMe.length : notesSharedWithMe.length}})
            </v-tab>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item class="shared-list" v-for="item in items" :key="item.tab">
          <!-- List of shared collections -->
          <v-col v-if="tab === 0">
            <Loading v-if="collsSharedWithMe.length == 0" />
            <v-row v-if="selectedColl == null">
              <v-card class="shared-card"
                elevation="5"
                width="250"
                v-for="(coll, i) in collsSharedWithMe"
                :key="i"
                :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${coll.color})`}"
              >
                <v-card-title>
                  {{coll.collectionname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{coll.firstname}} {{coll.lastname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text class="flat-btn" @click="removeColl(coll)">Remove</v-btn>
                  <v-btn class="good-btn"
                    @click="loadNotes(coll)"
                  >
                    Open
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>

            <!-- header for notes in shared collection -->
            <span style="margin: 20px;" v-if="selectedColl != null">
              <span class="basic-header">Notes in {{ selectedColl.collectionname }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="add-btn"
                    @click="selectedColl = null"
                    icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                </template>
                <span>Collapse</span>
              </v-tooltip>
              <hr>
            </span>

            <!-- List of notes in collection -->
            <v-row v-if="selectedColl != null">
              <v-card class="shared-card"
                elevation="5"
                width="300"
                v-for="(note, i) in collNotes"
                :key="i"
                :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${note.color})`}"
              >
                <v-card-title>
                    {{note.notename}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{note.collectionname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="good-btn" @click="openNote(note.noteid)">Open</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>

          <!-- List of notes -->
          <v-col v-else-if="tab === 1">
            <v-row>
              <v-card class="shared-card"
                elevation="5"
                width="300"
                v-for="(note, i) in notesSharedWithMe"
                :key="i"
                :style="{'background-image': `linear-gradient(to top right, #f9f9f9, ${note.color})`}"
              >
                <v-card-title>
                    {{note.notename}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{note.firstname}} {{note.lastname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text class="flat-btn" @click="removeNote(note)">Remove</v-btn>
                  <v-btn class="good-btn" @click="openNote(note.noteid)">Go</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
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

  async mounted () {
    await this.$store.dispatch('users/loadSharedWithMe')
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'collections' },
        { tab: 'notes' },
      ],
      selectedColl: null,
    }
  },

  methods: {
    async removeColl (coll) {
      await this.$store.dispatch('users/unshareColl', {
        collection: coll,
        userid: this.userData.userid,
        type: "receiver"
      })
      this.selectedColl = null
    },

    async removeNote (note) {
      this.$store.dispatch('users/unshareNote', {
        note: note,
        userid: this.userData.userid,
        type: "receiver"
      })
    },

    loadNotes (collection) {
      this.selectedColl = collection
      this.$store.dispatch('users/notes', {
        collectionid: collection.collectionid
      })
    },

    openNote (noteid) {
      this.$store.dispatch('users/openNote', {
        noteid
      })
    },
  },

  computed: {
    userData () {
      return this.$store.state.users.userData
    },

    collsSharedWithMe () {
      return this.$store.state.users.collsSharedWithMe
    },

    notesSharedWithMe () {
      return this.$store.state.users.notesSharedWithMe
    },

    collNotes () {
      return this.$store.state.users.notes
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

</style>
