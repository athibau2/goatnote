<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Questions</h6>
            <v-divider />
            <span v-for="(q, i) in questions" :key="i">
                <strong>{{q.questiontext}}</strong>
                &nbsp;{{q.answer}}&nbsp;
                <v-icon @click="deleteQuestion(q.questionid)">mdi-delete</v-icon>
                <v-divider />
            </span>
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
            <v-btn @click="$emit('close-modal')">
                Cancel
            </v-btn>
            <v-btn @click="addQuestion()">Add</v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "QuestionsComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/questions', JSON.parse(localStorage.getItem('questions')))
      },

      data () {
        return {
          newQuestion: "",
          newAnswer: ""
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
        }
      },

      computed: {
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