<template>
    <div>
        <script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-element-bundle.min.js"></script>
        <v-dialog
             v-model="showDeckDialog"
            :width="windowWidth < 800 ? '100%' : windowWidth < 1000 ? '70%' : '50%'"
            style="z-index: 9999;"
        >
            <v-card class="dialog-card" elevation="5">
                <span class="basic-header" style="display: flex; justify-content: center; padding-top: 15px;">{{ deck?.deckname }}</span>
                <v-divider />
                <swiper-container navigation="true" scrollbar="true">

                    <swiper-slide>
                        <span class="basic-header"
                            v-if="flashcards.length == 0"
                            style="display: flex; justify-content: center; font-size: 18px; margin: 15px 0;"
                        >
                            No flashcards have been added to this deck yet.
                        </span>
                        <div v-if="flashcards.length !== 0"
                            style="display: flex; flex-direction: column; justify-content: center;"
                        >
                            <button class="flashcard"
                                :class="{ flipped: !onPrompt }"
                                :style="windowWidth < 600 ? {'width': '75%'} : null"
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
                            <span style="display: flex; flex-direction: row; margin: 0 auto 15px auto;">
                                <v-btn class="flat-btn"
                                    @click="close()"
                                    text
                                >
                                    Close
                                </v-btn>
                                <v-btn class="flat-btn"
                                    @click="testFront = !testFront"
                                    text
                                >
                                    {{ testFront ? 'Test Back ' : 'Test Front' }}
                                </v-btn>
                            </span>
                        </div>
                    </swiper-slide>

                    <swiper-slide v-if="tab == 0">
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            <span class="small-header text-center" style="max-width: 75%; margin-bottom: 10px; font-size: 16px !important; letter-spacing: 1px;">
                                Add flashcards from selected notes.
                            </span>

                            <v-menu
                                transition="slide-y-transition"
                                offset-y
                                bottom
                                :close-on-content-click="false"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        class="note-select"
                                        v-on="on"
                                        v-bind="attrs"
                                        rounded
                                        dense
                                        append-icon="mdi-chevron-down"
                                        readonly
                                        hide-details
                                        outlined
                                        label="Select Notes to Add"
                                    ></v-text-field>
                                </template>
                                <v-list class="notes-list">
                                    <v-list-item class="list-item"
                                        v-for="(note, i) in userNotes"
                                        :key="i"
                                    >
                                        <v-btn icon @click="toggleNoteAdded(note)">
                                            <v-icon
                                                :style="checkIsAdded(note) ? {
                                                    color: '#85c59d'
                                                } : null"
                                            >
                                                {{checkIsAdded(note) ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline' }}
                                            </v-icon>
                                        </v-btn>
                                        <span class="small-header"
                                            style="font-size: 16px !important; max-width: 300px;"
                                        >
                                            {{ note.notename }}
                                        </span>
                                        <v-spacer />
                                        <span class="small-header"
                                            style="font-size: 14px !important; font-style: italic;"
                                        >
                                            {{ note.foldername }}
                                        </span>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                            <div style="margin-top: 20px;">
                                <v-btn class="flat-btn" @click="close()" text>
                                    Close
                                </v-btn>
                            </div>
                        </div>
                    </swiper-slide>

                    <swiper-slide v-if="tab == 0">
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            <span class="small-header text-center" style="max-width: 75%; margin-bottom: 10px; font-size: 16px !important; letter-spacing: 1px;">
                                Topical flashcards creation with AI.
                            </span>

                            <v-text-field
                                class="note-select"
                                v-model="aiTopic"
                                rounded
                                dense
                                append-icon="mdi-robot"
                                hide-details
                                outlined
                                label="Enter flashcards topic"
                            ></v-text-field>

                            <v-btn-toggle
                                v-model="numCards"
                                style="margin-top: 15px;"
                                dense
                                shaped
                            >
                                <v-btn style="height: 34px;" small>10 Cards</v-btn>
                                <v-btn style="height: 34px;" small>15 Cards</v-btn>
                                <v-btn style="height: 34px;" small>20 Cards</v-btn>
                            </v-btn-toggle>
                            
                            <div style="margin-top: 20px;">
                                <v-btn class="flat-btn" @click="close()" text>
                                    Close
                                </v-btn>
                                <v-btn class="good-btn"
                                    @click="createAiFlashcards()"
                                    :disabled="numCards == null || aiTopic == '' || loading"
                                    text
                                >
                                    Submit
                                </v-btn>
                            </div>
                            <span v-if="loading">
                                <Loading style="margin-top: 20px;" />
                                {{ loadingText }}
                            </span>
                        </div>
                    </swiper-slide>
                </swiper-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openaiTopicalFlashcards } from '~/store/openai'
import Loading from '~/components/Loading.vue'
export default {
    name: 'DeckDialogComponent',

    async created () {
        window.addEventListener('resize', () => this.windowWidth = window.innerWidth)
    },
    
    data () {
        return {
            index: 0,
            onPrompt: true,
            loadingDeck: false,
            loading: false,
            loadingText: '',
            testFront: true,
            aiTopic: '',
            numCards: null,
            windowWidth: window.innerWidth
        }
    },

    components: {
        Loading
    },
    
    props: {
        deck: {
            type: Object
        },
        tab: {
            type: Number
        }
    },
    
    watch: {
        async showDeckDialog(newValue) {
            if (newValue) {
                await this.$store.dispatch('users/getUserNotes', { 
                    orgid: this.deck?.orgid,
                    deckid: this.deck?.deckid
                })
            }
        },

        testFront(newValue) {
            if (newValue) {
                this.onPrompt = true
            } else this.onPrompt = false
        }
    },

    methods: {
        checkIsAdded(note) {
            return note.is_in_deck
        },

        async toggleNoteAdded(note) {
            await this.$store.dispatch('users/toggleNoteAdded', {
                noteid: note.noteid,
                deckid: this.deck.deckid,
                isInDeck: note.is_in_deck,
                orgid: this.deck.orgid
            })
        },

        async createAiFlashcards() {
            this.loadingText = 'Waiting for AI'
            this.loading = true
            const cards = await openaiTopicalFlashcards({
                topic: this.aiTopic,
                numCards: this.numCards == 0 ? 10 : this.numCards == 1 ? 15 : 20
            })

            if (cards.length == 0) {
                this.loading = false
                this.loadingText = ''
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong and no flashcards were generated. Please try again.'
                })
            } else {
                this.loadingText = 'Waiting for Database'
                await this.$store.dispatch('users/updateAiCalls', {
                    date: this.getDate,
                    num: this.calledAiToday ? this.userData.numaicalls + 1 : 1
                })

                for (let i = 0; i < cards.length; ++i) {
                    await this.$store.dispatch('users/addFlashcard', {
                        newPrompt: cards[i].cardprompt,
                        newAnswer: cards[i].cardanswer,
                        noteid: null,
                        deckid: this.deck.deckid,
                        isNote: false
                    })
                }

                this.loading = false
                this.loadingText = ''
                this.aiTopic = ''
                this.numCards = null
                await this.$store.commit('users/setAlert', {
                    color: 'success',
                    icon: '$success',
                    text: 'Success! Your flashcards have been created. You can view them back on the first slide.'
                })
            }
        },

        flipCard() {
            this.onPrompt = !this.onPrompt
        },

        next () {
            this.onPrompt = this.testFront
            if (this.index === this.flashcards.length - 1) this.index = 0
            else this.index++
        },

        prev () {
            this.onPrompt = this.testFront
            if (this.index === 0) this.index = this.flashcards.length - 1
            else this.index--
        },

        async close() {
            await this.$store.commit('users/setShowDeckDialog', false)
            this.index = 0
        },

        itemProps (item) {
            return {
                title: item.notename,
                subtitle: item.foldername,
            }
        },
    },

    computed: {
        userData () {
            return this.$store.state.users.userData
        },
        
        flashcards () {
            return this.$store.state.users.flashcardDeck
        },

        showDeckDialog: {
            get () {
                return this.$store.state.users.showDeckDialog
            },

            async set () {
                await this.$store.commit('users/setShowDeckDialog', false)
            }
        },

        getDate () {
            return new Date().toDateString()
        },

        calledAiToday () {
            return this.userData.lastaicall == this.getDate
        },

        userNotes () {
            return this.$store.state.users.userNotes
        },
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.note-select {
    width: 70%;
    margin-right: 40px;
}

.notes-list {
    max-height: 300px !important;
    background-color: #f9f9f9;
}

.list-item {
    background-color: #f9f9f9;
}

</style>