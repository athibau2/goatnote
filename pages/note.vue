<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-btn color="light red lighten-2" to="/">&lt; Back</v-btn>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleStudy()"
                    >
                      Study!
                    </v-btn>
                  </template>
                  <span v-if="studyMode">Turn off study mode</span>
                  <span v-else>Begin study</span>
                </v-tooltip>
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
                    <v-btn color="light grey lighten-1" @click="showStudyPlan = true">Study Plan</v-btn>
                    <StudyPlan v-show="showStudyPlan" @close-modal="showStudyPlan = false" />
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
import StudyPlan from '~/components/StudyPlan.vue'
import { VueEditor } from "vue2-editor"

export default {
  name: 'NotePage',
  middleware: "auth",

  components: {
      Words,
      Questions,
      Links,
      StudyPlan,
      VueEditor
  },

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
    this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
    this.$store.commit('users/words', JSON.parse(localStorage.getItem('words')))
    this.$store.commit('users/questions', JSON.parse(localStorage.getItem('questions')))
    this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
    this.$store.commit('users/study', localStorage.getItem('studyMode'))
  },

  data () {
    return {
        showQuestions: false,
        showLinks: false,
        showWords: false,
        showStudyPlan: false,
        noteText: JSON.parse(localStorage.getItem('note')).typednotes,
        prettyDate: localStorage.getItem('prettyDate'),
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
        localStorage.setItem('studyMode', !this.studyMode)
        await this.$store.commit('users/study', !this.studyMode)
        if (!this.studyMode) {
          alert('Study mode has been turned off.')
        }
        else {
          alert('Study mode has been turned on.')
        }
      }
  },

  computed: {
    studyMode () {
      return this.$store.state.users.studyMode
    },

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
  box-shadow: 3px 3px 3px;
}
</style>
