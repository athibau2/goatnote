<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Words</h6>
            <v-divider />
            <span v-for="(word, i) in words" :key="i">
                <strong>{{word.vocabword}}:</strong>
                &nbsp;{{word.definition}}&nbsp;
                <v-icon @click="deleteWord(word.wordid)">mdi-delete</v-icon>
                <v-divider />
            </span>
            <br>
            <p>
              <v-row>
                <v-text-field 
                  v-model="newWord" 
                  placeholder="Enter New Word"
                >
                </v-text-field>
                <v-text-field 
                  v-model="newDef" 
                  placeholder="Enter Word Definition"
                >
                </v-text-field>
              </v-row>
            </p>
            <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                Exit
            </v-btn>
            <v-btn color="primary" @click="addWord()">Add</v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "WordsComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/words', JSON.parse(localStorage.getItem('words')))
      },

      data () {
        return {
          newWord: "",
          newDef: ""
        }
      },

      methods: {
        deleteWord (wordid) {
          this.$store.dispatch('users/deleteWord', {
            wordid: wordid,
            noteid: this.currentNote.noteid
          })
        },

        addWord () {
          this.$store.dispatch('users/addWord', {
            newWord: this.newWord,
            newDef: this.newDef,
            noteid: this.currentNote.noteid
          })
          this.newWord = ""
          this.newDef = ""
        }
      },

      computed: {
          words () {
              return this.$store.state.users.words
          },

          currentNote () {
            return this.$store.state.users.currentNote
          }
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