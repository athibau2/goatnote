<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-btn to="/">&lt; Back</v-btn>
            </v-col>
            <v-col cols="8">
                <h2>{{this.currentNote.notename}}</h2>
            </v-col>
            <v-col>
                <h3>&nbsp;{{this.currentNote.collectionname}}</h3>
            </v-col>
        </v-row>

        <div>
            <v-btn @click="showWords = true">Words</v-btn>
            <Words v-show="showWords" @close-modal="showWords = false" />
        </div>
        <div>
            <v-btn>Questions</v-btn>
        </div>
        <div>
            <v-btn>Links</v-btn>
        </div>
        <div>
            {{this.currentNote.typednotes}}
        </div>

    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import Words from '~/components/Words.vue'
export default {
  name: 'NotePage',
  middleware: "auth",

  components: {
      Words
  },

  mounted() {
    this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
  },

  data () {
    return {
        showWords: false,
        notetext: ""
    }
  },

  methods: {
      
  },

  computed: {
    currentNote () {
        return this.$store.state.users.currentNote
    },

    user () {
      return this.$store.state.users.user
    },

    notes () {
      return this.$store.state.users.notes
    },

  }
}
</script>
