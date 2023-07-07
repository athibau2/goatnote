<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" :class="windowWidth < '850' ? 'modal-sm' : 'modal'" @click.stop>
            <h6>Words</h6>
            <v-divider />
            <div v-if="words.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(word, i) in words" :key="i">
                  <div class="modal-list-item" v-if="!editingWord || (editingWord && word.wordid !== wordBeingEdited)">
                    <v-row style="padding: 15px 5px;">
                      <span style="max-width: 80%;">
                        <strong>{{word.vocabword}}:</strong>
                        <br>{{word.definition}}
                      </span>
                      <v-spacer />
                      <span>
                        <v-btn icon
                          :disabled="(editingWord && word.wordid !== wordBeingEdited) ? true : false" 
                          @click="setEditWord(word)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteWord(word.wordid)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </span>
                    </v-row>
                    <v-divider style="margin-top: 15px;" />
                  </div>
                  <v-row align="center" justify="center" v-else>
                    <v-text-field
                      :value="word.vocabword"
                      counter
                      maxlength="50"
                      @input="wordChanged($event)"
                      @keyup.enter="updateWord(word)"
                    >
                    </v-text-field>
                    &ensp;
                    <v-text-field
                      :value="word.definition"
                      counter
                      maxlength="200"
                      append-icon="mdi-pencil"
                      @click:append="editingWord = !editingWord"
                      @input="defChanged($event)"
                      @keyup.enter="updateWord(word)"
                    >
                    </v-text-field>
                  </v-row>
                </v-list-item>
              </v-list>
            </div>
            <div class="modal-bottom-content-2">
              <v-row>
                <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
                  v-model="newWord"
                  counter
                  maxlength="50"
                  placeholder="Enter New Word"
                >
                </v-text-field>
                &ensp;
                <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
                  v-model="newDef"
                  counter
                  maxlength="200"
                  placeholder="Enter Word Definition"
                  @keyup.enter="addWord()"
                >
                </v-text-field>
              </v-row>
              <div class="modal-bottom-content-3">
                <v-btn text @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn class="good-btn" @click="addWord()">Add</v-btn>
              </div>
            </div>
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
            <v-btn text @click="$emit('close-modal')">
                Exit
            </v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "WordsComponent",

      created () {
        window.addEventListener('resize', this.resizeHandler)
      },

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
          editingWord: false,
          wordBeingEdited: null,
          editWord: "",
          editDef: "",
          windowWidth: window.innerWidth,
        }
      },

      methods: {
        resizeHandler() {
          this.windowWidth = window.innerWidth
        },

        wordChanged (event) {
          this.editWord = event
        },

        defChanged (event) {
          this.editDef = event
        },

        setEditWord (word) {
          this.editingWord = !this.editingWord
          if (this.editingWord) {
            this.wordBeingEdited = word.wordid
            this.wordChanged(word.vocabword)
            this.defChanged(word.definiton)
          }
          else this.wordBeingEdited = null
        },

        async updateWord (word) {
          await this.$store.dispatch('users/updateWord', {
            wordid: word.wordid,
            editWord: this.editWord,
            editDef: this.editDef,
            noteid: word.noteid
          })
          this.setEditWord()
        },

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