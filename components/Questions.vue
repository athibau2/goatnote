<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" class="modal" @click.stop>
            <h6>Questions</h6>
            <v-divider />
            <div v-if="questions.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(q, i) in questions" :key="i">
                  <span class="modal-list-item">
                      <strong>{{q.questiontext}}</strong>
                      &nbsp;{{q.answer}}&nbsp;
                      <v-icon @click="deleteQuestion(q.questionid)">mdi-delete</v-icon>
                      <v-divider />
                  </span>
                </v-list-item>
              </v-list>
            </div>
            <div class="modal-bottom-content-2">
              <v-row>
                <v-text-field 
                  v-model="newQuestion"
                  counter
                  maxlength="350"
                  placeholder="Enter New Question"
                >
                </v-text-field>
                <v-text-field
                  v-model="newAnswer"
                  counter
                  maxlength="350"
                  placeholder="Enter Question Answer"
                >
                </v-text-field>
              </v-row>
              <div class="modal-bottom-content-3">
                <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn color="primary" @click="addQuestion()">Add</v-btn>
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
            <v-btn class="modal-bottom-content" color="light red lighten-2" @click="$emit('close-modal')">
                Exit
            </v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "QuestionsComponent",

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
        }
      },

      methods: {
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

h6 {
  font-weight: 500;
  font-size: 28px;
}

p {
  font-size: 16px;
  margin: 10px 15px;
}

</style>