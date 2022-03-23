<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-btn color="light red lighten-2" to="/">&lt; Back</v-btn>
                <v-btn color="primary" @click="toggleStudy()">Study!</v-btn>
            </v-col>
            <v-col cols="7">
                <h2>{{this.currentNote.notename}}</h2>
                
            </v-col>
            <v-col>
                <h3>&nbsp;{{this.currentNote.collectionname}}</h3>
                <h5>{{prettyDate}} &nbsp;--&nbsp; {{this.saving}}</h5>
            </v-col>
        </v-row>

        <v-divider />
        <br>

        <v-row>
            <v-col cols="10">
              <vue-editor class="editor"
                @text-change="saveNotes()"
                v-model="noteText"
              >
              </vue-editor>
            </v-col>
            <v-col class="text-center">
                <div>
                    <v-btn color="light grey lighten-1" @click="showWords = true">Words</v-btn>
                    <Words v-show="showWords" @close-modal="showWords = false" />
                </div>
                <br>
                <div>
                    <v-btn color="light grey lighten-1" @click="showQuestions = true">Questions</v-btn>
                    <Questions v-show="showQuestions" @close-modal="showQuestions = false" />
                </div>
                <br>
                <div>
                    <v-btn color="light grey lighten-1" @click="showLinks = true">Links</v-btn>
                    <Links v-show="showLinks" @close-modal="showLinks = false" />
                </div>
                <br>
                <div>
                    <v-btn color="light grey lighten-1">Study Plan</v-btn>
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
import { VueEditor } from "vue2-editor"

export default {
  name: 'NotePage',
  middleware: "auth",

  components: {
      Words,
      Questions,
      Links,
      VueEditor
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
        prettyDate: localStorage.getItem('prettyDate'),
        studyMode: false
    }
  },

  methods: {
      async saveNotes () {
        this.$store.commit('users/saving', "Saving...")
        await this.$store.dispatch('users/saveNotes', {
          noteText: this.noteText,
          noteid: this.currentNote.noteid
        })
        let hour = new Date().getHours()
        if (hour > 12) hour -= 12
        if (hour < 10) hour = '0' + hour.toString()
        let minute = new Date().getMinutes()
        if (minute < 10) minute = '0' + minute.toString()
        let second = new Date().getSeconds()
        if (second < 10) second = '0' + second.toString()

        const time = hour + ':' + minute + ':' + second
        this.$store.commit('users/saving', 'Saved at ' + time)
      },

      async toggleStudy () {
        this.studyMode = !this.studyMode
        if (!this.studyMode) {
          alert('Study mode has been turned off.')
        }
        else {
          alert('Study mode has been turned on.')
        }
      }
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

<style scoped>
.editor {
  background-color: lightyellow;
}

h2 {
  border: solid 1px;
  border-radius: 6px;
  background-color: #ce93d8;
}
</style>
