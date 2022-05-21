<template>
  <v-app>
    <v-container>
        <v-row class="text-center">
            <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="light red lighten-2" 
                      to="/"
                    >
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                  </template>
                  <span>Back</span>
                </v-tooltip>
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
            <v-col cols="7" v-if="user.user_id == currentNote.userid">
                <v-text-field v-if="editNote"
                  class="noteselector"
                  dense
                  solo
                  rounded
                  background-color="light purple lighten-3"
                  append-icon="mdi-chevron-down"
                  append-outer-icon="mdi-pencil"
                  @click:append-outer="editNote = !editNote"
                  v-model="newNoteName"
                  @keyup.enter="updateNoteName()"
                >
                </v-text-field>
                <v-menu
                  v-if="!editNote"
                  bottom
                  transition="slide-y-transition"
                  :offset-y="true"
                  :close-on-content-click="true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="noteselector"
                      dense
                      solo
                      rounded
                      readonly
                      background-color="light purple lighten-3"
                      append-icon="mdi-chevron-down"
                      append-outer-icon="mdi-pencil"
                      @click:append-outer="editNote = !editNote"
                      v-bind="attrs"
                      v-on="on" 
                      :placeholder="currentNote.notename"
                    >
                    </v-text-field>
                  </template>
                  <v-list>
                    <v-list-item v-for="(n, i) in notes" :key="i" link>
                        <v-list-item-title
                          v-text="n.notename"
                          style='font-size: 10pt;'
                          @click="switchNote(n.noteid)"
                        >
                        </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>                
            </v-col>
            <v-col cols="7" v-else>
              <v-text-field
                class="noteselector"
                dense
                solo
                rounded
                readonly
                background-color="light purple lighten-3"
                v-bind="attrs"
                v-on="on"
                :placeholder="currentNote.notename"
              >
              </v-text-field>          
            </v-col>
            <v-col>
                <span style="font-family: Georgia; font-size: 16px;"
                >
                  {{this.currentNote.collectionname}}
                </span>
                <h5>{{prettyDate}} &nbsp;--&nbsp; {{this.saving}}</h5>
            </v-col>
        </v-row>

        <v-divider />
        <br>

        <!-- Notes area fullscreen -->
        <v-row v-if="windowWidth >= 1271">
          <v-col cols="10">
            <vue-editor class="editor"
              :disabled="(user.user_id == currentNote.userid) ? false : true"
              @text-change="saveNotes()"
              v-model="noteText"
            >
            </vue-editor>
          </v-col>
          <v-col class="text-center">
            <div>
              <v-btn width="100%" color="light grey lighten-1" 
                @click="getSharedNoteList(currentNote)"
                :disabled="user.user_id == currentNote.userid ? false : true"
              >
                Share Note
              </v-btn>
            </div>
            <br>
            <div>
              <v-btn width="100%" color="light grey lighten-1" @click="showWords = true">Words</v-btn>
            </div>
            <br>
            <div>
              <v-btn width="100%" color="light grey lighten-1" @click="showQuestions = true">Questions</v-btn>
            </div>
            <br>
            <div>
              <v-btn width="100%" color="light grey lighten-1" @click="showLinks = true">Links</v-btn>
            </div>
            <br>
            <div>
              <v-btn width="100%" color="light grey lighten-1" 
                @click="openPlans()"
                :disabled="user.user_id == currentNote.userid ? false : true"
              >
                Study Plans
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Notes area small screen -->
        <v-col cols="12" v-else-if="windowWidth < 1271">
          <v-btn 
            :style="windowWidth < 936 ? 'font-size: 10px' : null"
            :width="windowWidth < 936 ? '15%' : '20%'" 
            color="light grey lighten-1" 
            @click="getSharedNoteList(currentNote)"
            :disabled="user.user_id == currentNote.userid ? false : true"
          >
            Share Note
          </v-btn>
          <v-btn 
            :style="windowWidth < 936 ? 'font-size: 10px' : null"
            :width="windowWidth < 936 ? '15%' : '20%'" 
            color="light grey lighten-1" 
            @click="showWords = true"
          >
            Words
          </v-btn>
          <v-btn 
            :style="windowWidth < 936 ? 'font-size: 10px' : null"
            :width="windowWidth < 936 ? '15%' : '20%'" 
            color="light grey lighten-1" 
            @click="showQuestions = true"
          >
            Questions
          </v-btn>
          <v-btn 
            :style="windowWidth < 936 ? 'font-size: 10px' : null"
            :width="windowWidth < 936 ? '15%' : '19%'" 
            color="light grey lighten-1" 
            @click="showLinks = true"
          >
            Links
          </v-btn>
          <v-btn 
            :style="windowWidth < 936 ? 'font-size: 10px' : null"
            :width="windowWidth < 936 ? '15%' : '19%'" 
            color="light grey lighten-1" 
            @click="openPlans()"
            :disabled="user.user_id == currentNote.userid ? false : true"
          >
            Study Plans
          </v-btn>
          <vue-editor class="editor"
            :disabled="(user.user_id == currentNote.userid) ? false : true"
            @text-change="saveNotes()"
            v-model="noteText"
          >
          </vue-editor>
        </v-col>

        <ShareNote v-show="showShareNote" @close-modal="showShareNote = false" />
        <Words v-show="showWords" @close-modal="showWords = false" />
        <Questions v-show="showQuestions" @close-modal="showQuestions = false" />
        <Links v-show="showLinks" @close-modal="showLinks = false" />
        <StudyPlans v-show="showStudyPlans" @close-modal="showStudyPlans = false" />
    </v-container>
  </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
import Words from '~/components/Words.vue'
import Questions from '~/components/Questions.vue'
import Links from '~/components/Links.vue'
import StudyPlans from '~/components/StudyPlans.vue'
import ShareNote from '~/components/ShareNote.vue'
import { VueEditor } from "vue2-editor"

export default {
  name: 'NotePage',
  middleware: "auth",

  components: {
      Words,
      Questions,
      Links,
      StudyPlans,
      ShareNote,
      VueEditor
  },

  mounted() {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/orgs')
    this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
    this.$store.commit('users/words', JSON.parse(localStorage.getItem('words')))
    this.$store.commit('users/questions', JSON.parse(localStorage.getItem('questions')))
    this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
    this.$store.commit('users/studyPlans', JSON.parse(localStorage.getItem('studyPlans')))
    this.$store.commit('users/setNotes', JSON.parse(localStorage.getItem('collNotes')))
    this.$store.commit('users/study', false)
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  data () {
    return {
        showQuestions: false,
        showLinks: false,
        showWords: false,
        showStudyPlans: false,
        noteText: JSON.parse(localStorage.getItem('note')).typednotes,
        prettyDate: localStorage.getItem('prettyDate'),
        editNote: false,
        newNoteName: JSON.parse(localStorage.getItem('note')).notename,
        showShareNote: false,
        windowWidth: window.innerWidth,
        os: navigator.platform
    }
  },

  methods: {
      resizeHandler() {
        this.windowWidth = window.innerWidth
      },

      getSharedNoteList (note) {
        this.showShareNote = true
        this.$store.dispatch('users/getSharedNoteList', {
          note: note
        })
      },

      openPlans () {
        this.showStudyPlans = true
        this.$store.dispatch('users/getStudyPlans', {
          noteid: this.currentNote.noteid
        })
      },

      async updateNoteName () {
        await this.$store.dispatch('users/updateNoteName', {
          newNoteName: this.newNoteName,
          noteid: this.currentNote.noteid
        })
        this.editNote = !this.editNote
      },

      async saveNotes () {
        this.$store.commit('users/saving', "Saving...")
        await this.$store.dispatch('users/saveNotes', {
          noteText: this.noteText,
          noteid: this.currentNote.noteid
        })
        this.$store.commit('users/saving', 'Saved')
      },

      async toggleStudy () {
        await this.$store.commit('users/study', !this.studyMode)
        if (!this.studyMode) {
          alert('Study mode has been turned off.')
        }
        else {
          alert('Study mode has been turned on.')
        }
      },

      async switchNote(noteid) {
        await this.$store.dispatch('users/openNote', {
          noteid: noteid
        })
        this.noteText = this.currentNote.typednotes
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
    },

    notes () {
      return this.$store.state.users.notes
    },
  }
}
</script>

<style scoped>
.editor {
  background-color: lightyellow;
  margin-top: 5px;
}

.noteselector {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}

h2 {
  border: solid 1px;
  border-radius: 6px;
  background-color: #ce93d8;
  box-shadow: 3px 3px 3px;
}

</style>
