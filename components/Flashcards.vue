<template>
    <v-card v-if="!studyMode" class="dialog-card" elevation="5">
        <div v-if="flashcards.length !== 0">
          <v-list class="modal-list">
            <v-list-item v-for="(card, i) in flashcards" :key="i">
              <div class="modal-list-item" v-if="!editingCard || (editingCard && card.cardid !== cardBeingEdited)">
                <v-row style="padding: 15px 5px;">
                  <span style="max-width: 80%;">
                    <strong>{{card.cardprompt}}:</strong>
                    <br>{{card.cardanswer}}
                  </span>
                  <v-spacer />
                  <span>
                    <v-btn icon
                      :disabled="(editingCard && card.cardid !== cardBeingEdited) ? true : false" 
                      @click="setEditCard(card)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteFlashcard(card.cardid)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </span>
                </v-row>
                <v-divider style="margin-top: 15px;" />
              </div>
              <v-row align="center" justify="center" v-else>
                <v-text-field
                  :value="card.cardprompt"
                  counter
                  maxlength="50"
                  @input="promptChanged($event)"
                  @keyup.enter="updateFlashcard(card)"
                >
                </v-text-field>
                &ensp;
                <v-text-field
                  :value="card.cardanswer"
                  counter
                  maxlength="200"
                  append-icon="mdi-pencil"
                  @click:append="editingCard = !editingCard"
                  @input="answerChanged($event)"
                  @keyup.enter="updateFlashcard(card)"
                >
                </v-text-field>
              </v-row>
            </v-list-item>
          </v-list>
        </div>
        <div class="modal-bottom-content-2">
          <v-row>
            <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
              v-model="newPrompt"
              counter
              maxlength="200"
              placeholder="Flashcard Front"
            >
            </v-text-field>
            &ensp;
            <v-text-field :class="windowWidth < '850' ? 'modal-bottom-sm' : null"
              v-model="newAnswer"
              counter
              maxlength="200"
              placeholder="Flashcard Back"
              @keyup.enter="addFlashcard()"
            >
            </v-text-field>
          </v-row>
          <v-card-actions style="margin-top: 10px">
            <v-spacer />
            <v-btn class="flat-btn" @click="close()" text>
                Close
            </v-btn>
            <v-btn class="good-btn" @click="addFlashcard()">Add</v-btn>
            <v-spacer />
          </v-card-actions>
        </div>
    </v-card>

    <v-card v-else-if="studyMode">
        <v-row class="text-center" justify="center" align="center">
          <v-col>
            <button class="flashcard" :class="{ flipped: !onPrompt }"
              @click="flipCard()"
              v-if="flashcards !== null && flashcards !== undefined && flashcards.length !== 0"
            >
              <span class="flashcard-text">
                {{onPrompt ? flashcards[index].cardprompt : flashcards[index].cardanswer}}
              </span>
            </button>
            <v-card-subtitle>
              <v-btn icon @click="prev()">
                <v-icon size="40">
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              {{index + 1}} / {{flashcards.length}}
              <v-btn @click="next()" icon>
                <v-icon size="40">
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </v-card-subtitle>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer />
          <v-btn class="flat-btn" @click="close()" text>
              Close
          </v-btn>
          <v-spacer />
        </v-card-actions>
    </v-card>
</template>

<script>
  export default {
      name: "FlashcardsComponent",

      created () {
        window.addEventListener('resize', this.resizeHandler)
      },

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/flashcards', JSON.parse(localStorage.getItem('flashcards')))
      },

      data () {
        return {
          newPrompt: "",
          newAnswer: "",
          onPrompt: true,
          index: 0,
          editingCard: false,
          cardBeingEdited: null,
          editPrompt: "",
          editAnswer: "",
          windowWidth: window.innerWidth,
        }
      },

      methods: {
        flipCard() {
          this.onPrompt = !this.onPrompt
        },

        resizeHandler() {
          this.windowWidth = window.innerWidth
        },

        promptChanged (event) {
          this.editPrompt = event
        },

        answerChanged (event) {
          this.editAnswer = event
        },

        setEditCard (card) {
          this.editingCard = !this.editingCard
          if (this.editingCard) {
            this.cardBeingEdited = card.cardid
            this.promptChanged(card.cardprompt)
            this.answerChanged(card.cardanswer)
          }
          else this.cardBeingEdited = null
        },

        async updateFlashcard (card) {
          await this.$store.dispatch('users/updateFlashcard', {
            cardid: card.cardid,
            editPrompt: this.editPrompt,
            editAnswer: this.editAnswer,
            noteid: card.noteid
          })
          this.setEditCard()
        },

        deleteFlashcard (cardid) {
          this.$store.dispatch('users/deleteFlashcard', {
            cardid: cardid,
            noteid: this.currentNote.noteid
          })
        },

        async addFlashcard () {
          await this.$store.dispatch('users/addFlashcard', {
            newPrompt: this.newPrompt,
            newAnswer: this.newAnswer,
            noteid: this.currentNote.noteid
          })
          this.newPrompt = ""
          this.newAnswer = ""
        },

        next () {
          if (this.index === this.flashcards.length - 1) this.index = 0
          else this.index++
        },

        prev () {
          if (this.index === 0) this.index = this.flashcards.length - 1
          else this.index--
        },

        async close() {
          this.newPrompt = ""
          this.newAnswer = ""
          await this.$store.commit('users/setShowStudyTools', false)
        }
      },

      computed: {
        studyMode () {
          return this.$store.state.users.studyMode
        },

        flashcards () {
          return this.$store.state.users.flashcards
        },

        currentNote () {
          return this.$store.state.users.currentNote
        }
      }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.flashcard {
  display: flex;
  margin: 20px auto 0px;
  width: 50%;
  min-height: 200px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #2F2B28;
  background-image: linear-gradient(to top right, #f9f9f9, #B3E5FC, #f9f9f9);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.flashcard:hover {
  opacity: 0.85;
}

.flashcard.flipped {
  transform: scaleX(-1) scaleX(-1);
  background-image: linear-gradient(to top right, #f9f9f9, #85c59d, #f9f9f9);
}

.flashcard-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin: auto;
}

</style>