<template>
  <v-col>
    <v-tabs background-color="transparent" left v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="item in items" :key="item.tab">
        {{item.tab}} {{ item.tab == 'personal' ? `(${allFlashcardDecks.length})` : `(${allPublicDecks.length})` }}
      </v-tab>
      <v-text-field v-if="tab == 1"
        class="search-bar"
        dense
        solo
        rounded
        background-color="#f9f9f9"
        v-model="searchText"
        placeholder="Find by class name"
        append-icon="mdi-magnify"
        @input="searchPublicDecks()"
      >
      </v-text-field>
    </v-tabs>

    <v-row class="deck-row">
      <Loading v-if="loading" />

      <v-card class="deck-card"
        v-for="(deck, i) in tab == 0 ? allFlashcardDecks : searchingPublic ? filteredPublicArr : allPublicDecks"
        :key="i"
        @click="openFlashcardDeck(deck)"
        :style="{ 'background-color': deck.color }"
      >
        <span class="basic-header">{{ deck.collectionname }}</span><br>
        <span class="small-header" v-if="tab == 1" style="font-size: 15px !important;">
          {{ deck.firstname }} {{ deck.lastname }}
        </span>
        <sl-checkbox
          v-if="tab == 0"
          id="public-checkbox"
          @input="togglePublic(deck)"
          :checked="deck.ispublic"
        >
          Publish Deck
        </sl-checkbox>
      </v-card>
    </v-row>

    <v-dialog v-model="showDialog" :width="windowWidth < 800 ? '90%' : windowWidth < 1000 ? '70%' : '50%'">
      <v-card class="dialog-card" elevation="5">
        <v-card-title class="basic-header justify-center">{{ deckName }}</v-card-title>
        <Loading v-if="loadingDeck" />
        <v-col v-if="flashcards.length !== 0">
          <button class="flashcard"
            :class="{ flipped: !onPrompt }"
            :style="windowWidth < 600 ? {'width': '80%'} : null"
            @click="flipCard()"
          >
            <span class="flashcard-text">
              {{onPrompt ? flashcards[index].cardprompt : flashcards[index].cardanswer}}
            </span>
          </button>
          <v-card-subtitle class="text-center">
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
        <v-card-actions>
          <v-spacer />
          <v-btn class="flat-btn" @click="close()" text>
              Close
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-col>
</template>

<script>
import Loading from '~/components/Loading.vue'
export default {
  name: 'Flashcards',

  head() {
    return {
      title: 'Flashcards - GOAT Notes',
      meta: [
        { hid: 'flashcards-description', name: 'description', content: 'Study and publish flashcard decks in GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'flashcards, goat, notes, study, collections, class, deck, share' }
      ]
    }
  },

  async created () {
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth)
  },

  async mounted () {
    this.loading = true
    await this.$store.dispatch('users/getAllFlashcardDecks')
    await this.$store.dispatch('users/getAllPublicDecks')
    this.loading = false
  },
    
  components: {
    Loading
  },
    
  data () {
    return {
      tab: 0,
      items: [
        { tab: 'personal' },
        { tab: 'public' },
      ],
      loading: false,
      showDialog: false,
      loadingDeck: false,
      onPrompt: true,
      index: 0,
      deckName: '',
      searchText: '',
      searchingPublic: false,
      filteredPublicArr: [],
      windowWidth: window.innerWidth
    }
  },
    
  methods: {
    async togglePublic(deck) {
      await this.$store.dispatch('users/toggleDeckPublic', {
        collectionid: deck.collectionid,
        ispublic: !deck.ispublic
      })
    },

    async searchPublicDecks() {
      if (this.searchText != '') {
        this.searchingPublic = true
        this.filteredPublicArr = this.allPublicDecks.filter(deck => deck.collectionname.toLowerCase().includes(this.searchText))
      } else if (this.searchText == '') this.searchingPublic = false
    },
    
    async openFlashcardDeck(deck) {
      this.index = 0
      this.showDialog = true
      this.loadingDeck = true
      this.deckName = deck.collectionname
      await this.$store.dispatch('users/openFlashcardDeck', {
        collectionid: deck.collectionid
      })
      this.loadingDeck = false
    },

    flipCard() {
      this.onPrompt = !this.onPrompt
    },

    next () {
      this.onPrompt = true
      if (this.index === this.flashcards.length - 1) this.index = 0
      else this.index++
    },

    prev () {
      this.onPrompt = true
      if (this.index === 0) this.index = this.flashcards.length - 1
      else this.index--
    },

    close() {
      this.showDialog = false
      this.index = 0
    }
  },

  computed: {
    allFlashcardDecks () {
      return this.$store.state.users.allFlashcardDecks
    },

    allPublicDecks () {
      return this.$store.state.users.allPublicDecks
    },

    flashcards () {
      return this.$store.state.users.flashcardDeck
    }
  }
}
</script>



<style>
@import '~/assets/styles.css';

.search-bar {
  max-width: 40%;
  margin-top: 5px !important;
  margin-left: 20px !important;
}

.deck-row {
  margin: 2px 0;
  align-items: center;
  justify-content: center;
}

.deck-card {
  text-align: center;
  padding: 20px 15px;
  margin: 8px;
  z-index: 1;
}

.deck-card:hover {
  opacity: 0.6;
  cursor: pointer;
}

@media (max-width: 450px) {
  .deck-card {
    width: 100%;
  }
}

@media (width > 450px) and (width <= 800px) {
  .deck-card {
    width: 46%;
  }
}

@media (min-width: 801px) {
  .deck-card {
    width: 31%;
  }
}

.basic-header {
  font-size: 20px;
}

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
