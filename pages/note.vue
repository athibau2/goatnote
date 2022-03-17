<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-btn to="/">&lt; Back</v-btn>
            </v-col>
            <v-col cols="8">
                <h2>{{this.currentNote.notename}}</h2>
                <v-row>
                  <div>
                      {{this.currentNote.typednotes}}
                  </div>
                </v-row>
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
            <v-btn @click="showQuestions = true">Questions</v-btn>
            <Questions v-show="showQuestions" @close-modal="showQuestions = false" />
        </div>
        <div>
            <v-btn @click="showLinks = true">Links</v-btn>
            <Links v-show="showLinks" @close-modal="showLinks = false" />
        </div>

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
        notetext: ""
    }
  },

  methods: {
      
  },

  computed: {
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
