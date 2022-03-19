<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-btn color="light red lighten-2" to="/">&lt; Back</v-btn>
            </v-col>
            <v-col cols="8">
                <h2>{{this.currentNote.notename}}</h2>
                <h6>{{this.currentNote.notedate}}</h6>
            </v-col>
            <v-col>
                <h3>&nbsp;{{this.currentNote.collectionname}}</h3>
                <span>{{this.saving}}</span>
            </v-col>
        </v-row>

        <v-divider />
        <br>

        <v-row>
            <v-col cols="10">
                <v-textarea
                  background-color="light yellow lighten-5"
                  rows="18"
                  auto-grow
                  outlined
                  v-model="noteText"
                  @input="saveNotes()"
                >
                </v-textarea>
            </v-col>
            <v-col class="text-center">
                <div>
                    <v-btn color="light grey" @click="showWords = true">Words</v-btn>
                    <Words v-show="showWords" @close-modal="showWords = false" />
                </div>
                <br>
                <div>
                    <v-btn color="light grey" @click="showQuestions = true">Questions</v-btn>
                    <Questions v-show="showQuestions" @close-modal="showQuestions = false" />
                </div>
                <br>
                <div>
                    <v-btn color="light grey" @click="showLinks = true">Links</v-btn>
                    <Links v-show="showLinks" @close-modal="showLinks = false" />
                </div>
            </v-col>
        </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import Words from '~/components/Words.vue'
import Questions from '~/components/Questions.vue'
import Links from '~/components/Links.vue'

export default {
  name: 'NotePage',
  middleware: "auth",

  components: {
      Words,
      Questions,
      Links
  },

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
    this.$store.commit('users/words', JSON.parse(localStorage.getItem('words')))
    this.$store.commit('users/questions', JSON.parse(localStorage.getItem('questions')))
    this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
  },

  data () {
    return {
        showQuestions: false,
        showLinks: false,
        showWords: false,
        noteText: JSON.parse(localStorage.getItem('note')).typednotes,
    }
  },

  methods: {
      async saveNotes () {
        this.$store.commit('users/saving', "Saving...")
        await this.$store.dispatch('users/saveNotes', {
          noteText: this.noteText,
          noteid: this.currentNote.noteid
        })
        this.$store.commit('users/saving', "Saved")
      },
  },

  computed: {
    saving () {
      return this.$store.state.users.saving
    },

    user () {
      return this.$store.state.users.user
    },

    currentNote () {
        return this.$store.state.users.currentNote
    },

    words () {
      return this.$store.state.users.words
    },

    questions () {
      return this.$store.state.users.questions
    },

    links () {
      return this.$store.state.users.links
    }
  }
}
</script>
