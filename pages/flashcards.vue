<template>
  <v-app>

    <!-- Header tabs and buttons -->
    <span>
      <v-tabs background-color="transparent" left v-model="tab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="item in items" :key="item.tab">
          {{item.tab}} {{ item.tab == 'personal' ? `(${allFlashcardDecks.length})` : `(${allPublicDecks.length})` }}
        </v-tab>
        <sl-tooltip
          placement="right"
          content="New Deck"
          style="align-items: center; display: flex;"
        >
          <v-btn icon
            v-if="tab == 0"
            @click="initNewDeck()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </sl-tooltip>
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
    </span>
    
    <Loading v-if="loading" />

    <!-- List of decks -->
    <div class="deck-row">
      <v-card class="deck-card"
        v-for="(deck, i) in tab == 0 ? allFlashcardDecks : searchingPublic ? filteredPublicArr : allPublicDecks"
        :key="i"
        @click="openFlashcardDeck(deck)"
      >
        <span class="info-col">
          <span class="small-header" v-if="tab == 1" style="font-size: 14px !important;">
            {{ deck.orgname }}
          </span>
          <span class="basic-header"
            id="deck-name"
            style="margin: 5px 0;"
          >
            <sl-tooltip :content="tab == 0 ? 'Edit' : deck.deckname">
              <button v-if="tab == 0 && (!editingDeck || deck.deckid != deckBeingEdited?.deckid)"
                @click.stop="setEditDeckname(deck)"
                :disabled="editingDeck"
              >
                {{ deck.deckname }}
              </button>
              <span v-if="tab == 1">{{ shorten(deck.deckname) }}</span>
            </sl-tooltip>
            <input
              class="edit-deck-input"
              v-if="editingDeck && deck.deckid == deckBeingEdited?.deckid"
              :value="deckBeingEdited.deckname"
              @input="nameChanged($event)"
              @keyup.enter="editDeckname()"
              @click.stop
              autofocus
            />
          </span>
          <span class="small-header" v-if="tab == 1" style="font-size: 14px !important;">
            {{ deck.firstname }} {{ deck.lastname }}
          </span>
        </span>
        <span>
          <sl-checkbox
            v-if="tab == 0"
            id="public-checkbox"
            @click.stop="togglePublic(deck)"
            :checked="deck.ispublic"
          >
            Publish Deck
          </sl-checkbox>
          <sl-tooltip content="Delete Deck">
            <v-btn small icon
              v-if="tab == 0"
              style="position: absolute; right: 10px; bottom: 10px;"
              @click.stop="deleteDeck(deck)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </sl-tooltip>
        </span>
      </v-card>
    </div>

    <!-- Flashcards deck dialog -->
    <DeckDialog :deck="openedDeck" :tab="tab" />

    <!-- Creating a new deck -->
    <sl-dialog class="dialog-overview"
      label="New Flashcard Deck"
    >
      <v-text-field
        class="selector"
        dense
        solo
        rounded
        background-color="#f1f1f1"
        v-model="newDeckName"
        @keyup.enter="!selectedOrg ? null : createNewDeck()"
        placeholder="Name (e.g. History 100 Final)"
        maxlength="50"
      >
      </v-text-field>
      <v-select
        v-model="selectedOrg"
        style="z-index: 9999;"
        :items="orgs"
        item-text="orgname"
        label="Select Organization"
        density="compact"
        return-object
      ></v-select>
      <v-card-actions>
        <v-spacer />
        <v-btn class="good-btn"
          @click="createNewDeck()"
          :disabled="!selectedOrg || newDeckName == ''"
          nuxt
        >
            Create
        </v-btn>
      </v-card-actions>
    </sl-dialog>

  </v-app>
</template>

<script>
import Loading from '~/components/Loading.vue'
import DeckDialog from '~/components/DeckDialog.vue'
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
    await this.$store.dispatch('users/orgs')
    await this.$store.dispatch('users/getAllFlashcardDecks')
    await this.$store.dispatch('users/getAllPublicDecks')
    this.loading = false
  },
    
  components: {
    Loading,
    DeckDialog
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
      newDeckName: '',
      editedName: '',
      editingDeck: false,
      deckBeingEdited: null,
      selectedOrg: null,
      openedDeck: {},
      searchText: '',
      searchingPublic: false,
      filteredPublicArr: [],
      windowWidth: window.innerWidth
    }
  },
  
  methods: {
    nameChanged (event) {
      this.editedName = event.target.value
    },

    shorten(name) {
      let max = this.windowWidth < 500 ? 16 : 25
      if (name.length >= max) {
        let short = name.substring(0, max) + '...'
        return short
      } else return name
    },

    async createNewDeck() {
      if (this.newDeckName === '') {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Name field may not be left empty.'
        })
      } else {
        await this.$store.dispatch('users/createDeck', {
          deckname: this.newDeckName,
          orgid: this.selectedOrg.orgid
        })
        this.selectedOrg = null
        this.newDeckName = ''
        const dialog = document.querySelector('.dialog-overview');
        dialog.hide()
      }
    },

    initNewDeck() {
      this.newDeckName = ''
      const dialog = document.querySelector('.dialog-overview');
      dialog.show()
    },

    setEditDeckname(deck) {
      this.editingDeck = true
      this.deckBeingEdited = deck
      this.editedName = deck.deckname
    },

    async editDeckname() {
      if (this.editedName == '') {
        await this.$store.commit('users/setAlert', {
          color: 'error',
          icon: '$error',
          text: 'Name field may not be left empty.'
        })
      } else {
        await this.$store.dispatch('users/updateDeckname', {
          deckid: this.deckBeingEdited.deckid,
          newname: this.editedName
        })
        this.editingDeck = false
        this.deckBeingEdited = null
        this.editedName = ''
      }
    },

    async deleteDeck(deck) {
      if (confirm('Are you sure you want to delete this deck? Flashcards from your notes will not be deleted, but flashcards made with AI will.')) {
        await this.$store.dispatch('users/deleteDeck', {
          deck: deck
        })
      }
    },

    async togglePublic(deck) {
      await this.$store.dispatch('users/toggleDeckPublic', {
        deckid: deck.deckid,
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
      this.openedDeck = deck
      await this.$store.commit('users/setShowDeckDialog', true)
      this.loadingDeck = true
      await this.$store.dispatch('users/openFlashcardDeck', {
        deckid: deck.deckid
      })
      this.loadingDeck = false
    },
  },

  computed: {
    orgs () {
      return this.$store.state.users.orgs
    },

    allFlashcardDecks () {
      return this.$store.state.users.allFlashcardDecks
    },

    allPublicDecks () {
      return this.$store.state.users.allPublicDecks
    },

    showDeckDialog () {
      return this.$store.state.users.showDeckDialog
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
  margin: 10px 0;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.deck-card {
  text-align: center;
  padding: 20px 15px;
  margin: 8px;
  background-image: linear-gradient(to top right, #f9f9f9, #c1c1c1);
  border: solid 1px;
  border-color: #85c59d !important;
  box-shadow: 0px 0px 6px #85c59d !important;
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

@media (width > 801px) {
  .deck-card {
    width: 31%;
  }
}

.info-col {
  display: flex;
  flex-direction: column;
}

#deck-name {
  border-radius: 4px;
  padding: 4px 15px;
  margin: 5px 0 !important;
}

.edit-deck-input {
  border: solid #2F2B28 1px;
  padding: 2px 6px;
  border-radius: 6px;
  max-width: 100%;
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
