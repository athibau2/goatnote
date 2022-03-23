<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" class="modal" @click.stop>
            <h6>Questions</h6>
            <v-divider />
            <div v-if="questions !== null && questions !== undefined && questions.length !== 0">
              <span v-for="(q, i) in questions" :key="i">
                  <strong>{{q.questiontext}}</strong>
                  &nbsp;{{q.answer}}&nbsp;
                  <v-icon @click="deleteQuestion(q.questionid)">mdi-delete</v-icon>
                  <v-divider />
              </span>
            </div>
            <br>
            <p>
              <v-row>
                <v-text-field 
                  v-model="newQuestion" 
                  placeholder="Enter New Question"
                >
                </v-text-field>
                <v-text-field 
                  v-model="newAnswer" 
                  placeholder="Enter Question Answer"
                >
                </v-text-field>
              </v-row>
            </p>
            <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                Exit
            </v-btn>
            <v-btn color="primary" @click="addQuestion()">Add</v-btn>
        </div>

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
            <v-btn color="light red lighten-2" @click="$emit('close-modal')">
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

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 400px;
  width: 500px;
  margin-top: 10%;
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