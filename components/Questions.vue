<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" :class="windowWidth < '850' ? 'modal-sm' : 'modal'" @click.stop>
            <h6>Questions</h6>
            <v-divider />
            <div v-if="questions.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(q, i) in questions" :key="i">
                  <span class="modal-list-item" v-if="!editingQuestion || (editingQuestion && q.questionid !== questionBeingEdited)">
                      <strong>{{q.questiontext}}</strong>
                      &nbsp;{{q.answer}}&nbsp;
                      <v-btn 
                        :disabled="(editingQuestion && q.questionid !== questionBeingEdited) ? true : false" 
                        icon @click="setEditQuestion(q)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-icon @click="deleteQuestion(q.questionid)">mdi-delete</v-icon>
                      <v-divider />
                  </span>
                  <v-row align="center" justify="center" v-else>
                    <v-text-field
                      :value="q.questiontext"
                      counter
                      maxlength="350"
                      @input="questionChanged($event)"
                      @keyup.enter="updateQuestion(q)"
                    >
                    </v-text-field>
                    &nbsp;&nbsp;
                    <v-text-field
                      :value="q.answer"
                      counter
                      maxlength="350"
                      append-icon="mdi-pencil"
                      @click:append="editingQuestion = !editingQuestion"
                      @input="answerChanged($event)"
                      @keyup.enter="updateQuestion(q)"
                    >
                    </v-text-field>
                  </v-row>
                </v-list-item>
              </v-list>
            </div>
            <div class="modal-bottom-content-2">
              <v-row>
                <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
                  v-model="newQuestion"
                  counter
                  maxlength="350"
                  placeholder="Enter New Question"
                >
                </v-text-field>
                &nbsp;&nbsp;
                <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
                  v-model="newAnswer"
                  counter
                  maxlength="350"
                  placeholder="Enter Question Answer"
                >
                </v-text-field>
              </v-row>
              <div class="modal-bottom-content-3">
                <v-btn text @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn class="good-btn" @click="addQuestion()">Add</v-btn>
              </div>
            </div>
        </div>

        <!-- Study Mode ON -->
        <div v-else class="modal" @click.stop>
            <h6>Questions</h6>
            <v-divider />

            <v-col>
              <v-row justify="center" align="center">
                <div v-if="questions !== null && questions !== undefined && questions.length !== 0">
                  <v-btn icon @click="prev()">
                    <v-icon size="50">
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn elevation="10" @click="onQuestion = !onQuestion" :style="{
                    'background-color': onQuestion ? '#87CEFA' : '#FAFAD2',
                    'height': '250px',
                    'width': '375px',
                    'margin-top': '20px',
                  }"
                  >
                    <p class="text-wrap" v-if="onQuestion" :style="{
                      'width': '325px',
                    }">
                      {{questions[index].questiontext}}
                    </p>
                    <p class="text-wrap" v-else :style="{
                      'width': '325px',
                    }">
                      {{questions[index].answer}}
                    </p>
                  </v-btn>
                  <v-btn @click="next()" icon>
                    <v-icon size="50">
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </v-row>
            </v-col>
            <br>
            <v-btn class="modal-bottom-content" text @click="$emit('close-modal')">
                Exit
            </v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "QuestionsComponent",

      created () {
        window.addEventListener('resize', this.resizeHandler)
      },

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/questions', JSON.parse(localStorage.getItem('questions')))
        this.$store.commit('users/study', localStorage.getItem('studyMode'))
      },

      data () {
        return {
          newQuestion: "",
          newAnswer: "",
          onQuestion: true,
          index: 0,
          editingQuestion: false,
          questionBeingEdited: null,
          editQuestion: "",
          editAnswer: "",
          windowWidth: window.innerWidth,
        }
      },

      methods: {
        resizeHandler() {
          this.windowWidth = window.innerWidth
        },

        questionChanged (event) {
          this.editQuestion = event
        },

        answerChanged (event) {
          this.editAnswer = event
        },

        setEditQuestion (question) {
          this.editingQuestion = !this.editingQuestion
          if (this.editingQuestion) {
            this.questionBeingEdited = question.questionid
            this.questionChanged(question.questiontext)
            this.answerChanged(question.answer)
          }
          else this.questionBeingEdited = null
        },

        async updateQuestion (q) {
          await this.$store.dispatch('users/updateQuestion', {
            questionid: q.questionid,
            editQuestion: this.editQuestion,
            editAnswer: this.editAnswer,
            noteid: q.noteid
          })
          this.setEditQuestion()
        },

        deleteQuestion (questionid) {
          this.$store.dispatch('users/deleteQuestion', {
            questionid: questionid,
            noteid: this.currentNote.noteid
          })
        },

        addQuestion () {
          this.$store.dispatch('users/addQuestion', {
            newQuestion: this.newQuestion,
            newAnswer: this.newAnswer,
            noteid: this.currentNote.noteid
          })
          this.newQuestion = ""
          this.newAnswer = ""
        },

        next () {
          if (this.index === this.questions.length - 1) this.index = 0
          else this.index++
        },

        prev () {
          if (this.index === 0) this.index = this.questions.length - 1
          else this.index--
        }
      },

      computed: {
          studyMode () {
            return this.$store.state.users.studyMode
          },

          questions () {
              return this.$store.state.users.questions
          },

          currentNote () {
            return this.$store.state.users.currentNote
          },
      }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.modal-sm {
  text-align: center;
  background-color: white;
  height: 475px;
  width: 400px;
  margin-top: 15%;
  padding: 0px 0;
  border-radius: 20px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
}

p {
  font-size: 16px;
  margin: 10px 15px;
}

</style>