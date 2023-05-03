<template>
    <v-app>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4644384223616162" crossorigin="anonymous"></script>
      
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
            <v-row>
              <v-card class="list-card" color="light green lighten-3" elevation="5" width="250" v-for="(coll, i) in collsSharedWithMe" :key="i">
                <v-card-title>
                  {{coll.collectionname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{coll.firstname}} {{coll.lastname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="light red lighten-2" @click="removeColl(coll)">Remove</v-btn>
                  <v-btn color="primary" @click="loadNotes(coll.collectionid)">Go</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>

            <!-- List of notes in collection -->
            <v-row>
              <v-card class="list-card" color="purple lighten-3" elevation="5" width="300" v-for="(note, i) in collNotes" :key="i">
                <v-card-title>
                    {{note.notename}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{note.collectionname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" @click="openNote(note.noteid)">Go</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>

          <!-- List of notes -->
          <v-col v-else-if="tab === 1">
            <v-row>
              <v-card class="list-card" color="purple lighten-3" elevation="5" width="300" v-for="(note, i) in notesSharedWithMe" :key="i">
                <v-card-title>
                    {{note.notename}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{note.firstname}} {{note.lastname}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="light red lighten-2" @click="removeNote(note)">Remove</v-btn>
                  <v-btn color="primary" @click="openNote(note.noteid)">Go</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'SharedPage',
  middleware: "auth",

  async mounted () {
    await this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    await this.$store.dispatch('users/loadSharedWithMe')
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'collections' },
        { tab: 'notes' },
      ],
    }
  },

  methods: {
    async removeColl (coll) {
      await this.$store.dispatch('users/unshareColl', {
        collection: coll,
        userid: this.user.user_id,
        type: "receiver"
      })
    },

    async removeNote (note) {
      this.$store.dispatch('users/unshareNote', {
        note: note,
        userid: this.user.user_id,
        type: "receiver"
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
  },

  computed: {
    user () {
      return this.$store.state.users.user
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
  background-color: #F4F4F4;
  padding-bottom: 10px;
}

.list-card {
  margin-right: 10px;
  margin-top: 10px;
}

</style>
