<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" class="modal" @click.stop>
            <h6>Words</h6>
            <v-divider />
            <div v-if="words !== null && words !== undefined && words.length !== 0">
              <span v-for="(word, i) in words" :key="i">
                  <strong>{{word.vocabword}}:</strong>
                  &nbsp;{{word.definition}}&nbsp;
                  <v-icon @click="deleteWord(word.wordid)">mdi-delete</v-icon>
                  <v-divider />
              </span>
            </div>
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

        <div v-else class="modal" @click.stop>
            <h6>Words</h6>
            <v-divider />

            <v-col>
              <v-row justify="center" align="center">
                <div v-if="words !== null && words !== undefined && words.length !== 0">
                  <v-btn icon @click="prev()">
                    <v-icon size="50">
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn elevation="10" @click="onWord = !onWord" :style="{
                    'background-color': onWord ? '#87CEFA' : '#FAFAD2',
                    'height': '250px',
                    'width': '375px',
                    'margin-top': '20px',
                  }"
                  >
                    <h1 v-if="onWord">{{words[index].vocabword}}</h1>
                    <p class="text-wrap" v-else :style="{
                      'width': '325px',
                    }">
                      {{words[index].definition}}
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
      name: "WordsComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/words', JSON.parse(localStorage.getItem('words')))
        this.$store.commit('users/study', localStorage.getItem('studyMode'))
      },

      data () {
        return {
          newWord: "",
          newDef: "",
          onWord: true,
          index: 0,
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
        },

        next () {
          if (this.index === this.words.length - 1) this.index = 0
          else this.index++
        },

        prev () {
          if (this.index === 0) this.index = this.words.length - 1
          else this.index--
        }
      },

      computed: {
          studyMode () {
            return this.$store.state.users.studyMode
          },

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