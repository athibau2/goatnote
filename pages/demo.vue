<template>
    <div>
        <span class="basic-header"
            style="display: flex; justify-content: center; font-size: 18px; margin: 20px 0;"
        >
            Try a demo of our AI features by creating a flashcard deck or a quiz below!
        </span>

        <div style="display: flex; justify-content: center; margin: 30px 0;">
            <v-btn class="good-btn demo-btn"
                @click="setTryCards()"
                :disabled="flashcards.length != 0"
            >
                Try Cards
            </v-btn>
            <v-btn class="good-btn demo-btn"
                @click="setTryQuiz()"
                :disabled="quizQuestions.length != 0"
            >
                Try Quiz
            </v-btn>
        </div>

        <!-- Flashcards form -->
        <div v-if="tryCards && flashcards.length == 0"
            style="display: flex; flex-direction: column;
            justify-content: center; align-items: center; margin-top: 20px;"
            data-aos="fade-down"
        >
            <span class="small-header text-center"
                style="max-width: 75%; margin-bottom: 10px;
                font-size: 16px !important; letter-spacing: 1px;"
            >
                Topical flashcards creation with AI.
            </span>

            <v-text-field
                class="note-select"
                v-model="flashcardTopic"
                rounded
                dense
                append-icon="mdi-robot"
                hide-details
                outlined
                label="Enter flashcards topic"
            ></v-text-field>
            
            <div style="margin-top: 20px;">
                <v-btn class="good-btn"
                    @click="createAiFlashcards()"
                    :disabled="flashcardTopic == '' || loading"
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

        <!-- Quiz form -->
        <div v-if="tryQuiz && quizQuestions.length == 0"
            style="display: flex; flex-direction: column;
            justify-content: center; align-items: center; margin-top: 20px;"
            data-aos="fade-down"
        >
            <span class="small-header text-center"
                style="max-width: 75%; margin-bottom: 10px;
                font-size: 16px !important; letter-spacing: 1px;"
            >
                Topical quiz creation with AI.
            </span>

            <v-text-field
                class="note-select"
                v-model="quizTopic"
                rounded
                dense
                append-icon="mdi-robot"
                hide-details
                outlined
                label="Enter quiz topic"
            ></v-text-field>
            
            <div style="margin-top: 20px;">
                <v-btn class="good-btn"
                    @click="createAiQuiz()"
                    :disabled="quizTopic == '' || loading"
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

        <!-- Flashcard deck sample -->
        <div v-if="flashcards.length !== 0"
            style="display: flex; flex-direction: column;
            justify-content: center; margin: 40px 0;"
        >
            <span class="small-header" style="display: flex; justify-content: center;">Sample Flashcard Deck</span>
            <button class="flashcard"
                :class="{ flipped: !onPrompt }"
                :style="windowWidth < 600 ? {'width': '75%'} : null"
                @click="flipCard()"
                >
                <span class="flashcard-text">
                    {{onPrompt ? flashcards[flashcardIndex].cardprompt : flashcards[flashcardIndex].cardanswer}}
                </span>
            </button>
            <v-card-subtitle class="text-center">
                <v-btn icon @click="prevFlashcard()">
                    <v-icon size="40">
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                {{flashcardIndex + 1}} / {{flashcards.length}}
                <v-btn @click="nextFlashcard()" icon>
                    <v-icon size="40">
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </v-card-subtitle>
            <span style="display: flex; flex-direction: row; margin: 0 auto;">
                <v-btn class="flat-btn"
                    @click="testFront = !testFront"
                    text
                >
                    {{ testFront ? 'Test Back ' : 'Test Front' }}
                </v-btn>
            </span>
        </div>

        <v-divider />

        <!-- Quiz sample -->
        <div v-if="quizQuestions.length !== 0"
            style="display: flex; flex-direction: column;
            justify-content: center; margin: 40px 0 60px 0;"
        >
            <span class="small-header" style="display: flex; justify-content: center;">Sample Quiz</span>
            <div class="quiz"
                :style="windowWidth < 600 ? {'width': '75%'} : null"
            >
                <div class="quiz-content">
                    <span class="quiz-text">
                        {{ quizQuestions[quizIndex]?.question }}
                    </span>
                    <div class="answer-group">
                        <v-radio-group v-model="radioGroup">
                            <v-radio :label="answer.answer"
                                :value="i"
                                v-for="(answer, i) in quizQuestions[quizIndex]?.answers"
                                :key="i"
                                @click="currentAnswer = answer.correct"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <span class="correct-answer basic-header"
                        v-if="answerStatus == 'correct'"
                    >
                        Correct <v-icon style="color: #49a06c;">mdi-emoticon-happy-outline</v-icon>
                    </span>
                    <span class="incorrect-answer basic-header"
                        v-if="answerStatus == 'incorrect'"
                    >
                        Incorrect <v-icon style="color: #c44f4f;">mdi-emoticon-sad-outline</v-icon>
                    </span>

                    <span style="display: flex; flex-direction: row; margin: auto;">
                        <v-btn class="flat-btn"
                            @click="checkAnswer(currentAnswer)"
                            :disabled="currentAnswer == null"
                            text
                        >
                            Check
                        </v-btn>
                    </span>
                </div>
            </div>
            <v-card-subtitle class="text-center">
                <v-btn icon @click="prevQuestion()">
                    <v-icon size="40">
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                {{quizIndex + 1}} / {{quizQuestions.length}}
                <v-btn @click="nextQuestion()" icon>
                    <v-icon size="40">
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </v-card-subtitle>
        </div>

        <!-- Bottom buffer -->
        <div style="height: 50px;"></div>
    </div>
</template>

<script>
import { openaiTopicalFlashcards, openaiTopicalQuiz } from '~/store/openai'
import Loading from '~/components/Loading.vue'
import aosMixin from '~/mixins/aos'
export default {
    name: 'DemoPage',
    layout: 'noauth',
    mixins: [aosMixin],

    head() {
        return {
        title: 'Demo - GOAT Notes',
        meta: [
            { hid: 'demo-description', name: 'description', content: 'GOAT Notes demo page; test out the AI features like flashcards and quiz questions' },
            { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, flashcards, quiz, multiple choice, test, demo' }
        ]
        }
    },

    async created () {
        window.addEventListener('resize', () => this.windowWidth = window.innerWidth)
    },

    mounted () {
        let flashcards = JSON.parse(localStorage.getItem('flashcards'))
        let quiz = JSON.parse(localStorage.getItem('quiz'))
        if (flashcards) this.flashcards = flashcards
        if (quiz) this.quizQuestions = quiz
    },

    data () {
        return {
            flashcardIndex: 0,
            quizIndex: 0,
            onPrompt: true,
            loading: false,
            loadingText: '',
            testFront: true,
            flashcardTopic: '',
            quizTopic: '',
            tryCards: false,
            tryQuiz: false,
            flashcards: [],
            radioGroup: null,
            currentAnswer: null,
            answerStatus: '',
            quizQuestions: [],
            windowWidth: window.innerWidth
        }
    },

    components: {
        Loading
    },

    watch: {
        testFront(newValue) {
            if (newValue) {
                this.onPrompt = true
            } else this.onPrompt = false
        }
    },

    methods: {
        checkAnswer(isCorrect) {
            this.answerStatus = isCorrect ? 'correct' : 'incorrect'
        },

        async setTryCards() {
            if (localStorage.getItem('flashcards_done')) {
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Only one test of the flashcard creation is allowed.'
                })
            } else {
                this.tryQuiz = false
                this.tryCards = true
            }
        },

        async setTryQuiz() {
            if (localStorage.getItem('quiz_done')) {
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Only one test of the quiz creation is allowed.'
                })
            } else {
                this.tryCards = false
                this.tryQuiz = true
            }
        },

        async createAiFlashcards() {
            this.loadingText = 'Waiting for AI'
            this.loading = true
            const cards = await openaiTopicalFlashcards({
                topic: this.flashcardTopic,
                numCards: 5
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
                this.flashcards = cards
                localStorage.setItem('flashcards', JSON.stringify(cards))
                localStorage.setItem('flashcards_done', true)

                this.loading = false
                this.loadingText = ''
                this.flashcardsTopic = ''
                await this.$store.commit('users/setAlert', {
                    color: 'success',
                    icon: '$success',
                    text: 'Success! Your flashcards have been created.'
                })
            }
        },
        
        async createAiQuiz() {
            this.loadingText = 'Waiting for AI'
            this.loading = true
            const questions = await openaiTopicalQuiz({
                topic: this.quizTopic,
                numQuestions: 5
            })

            if (questions.length == 0) {
                this.loading = false
                this.loadingText = ''
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong and no quiz was generated. Please try again.'
                })
            } else {
                this.quizQuestions = questions
                localStorage.setItem('quiz', JSON.stringify(questions))
                localStorage.setItem('quiz_done', true)

                this.loading = false
                this.loadingText = ''
                this.quizTopic = ''
                await this.$store.commit('users/setAlert', {
                    color: 'success',
                    icon: '$success',
                    text: 'Success! Your quiz has been created.'
                })
            }
        },

        flipCard() {
            this.onPrompt = !this.onPrompt
        },

        nextFlashcard() {
            this.onPrompt = this.testFront
            if (this.flashcardIndex === this.flashcards.length - 1) this.flashcardIndex = 0
            else this.flashcardIndex++
        },

        prevFlashcard() {
            this.onPrompt = this.testFront
            if (this.flashcardIndex === 0) this.flashcardIndex = this.flashcards.length - 1
            else this.flashcardIndex--
        },
        
        nextQuestion() {
            this.currentAnswer = null
            this.answerStatus = ''
            this.radioGroup = null
            if (this.quizIndex === this.quizQuestions.length - 1) this.quizIndex = 0
            else this.quizIndex++
        },
        
        prevQuestion() {
            this.currentAnswer = null
            this.answerStatus = ''
            this.radioGroup = null
            if (this.quizIndex === 0) this.quizIndex = this.quizQuestions.length - 1
            else this.quizIndex--
        },
    },

    computed: {
        getDate () {
            return new Date().toDateString()
        },
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';
.demo-btn {
    margin: 10px;
    padding: 50px !important;
}
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

.flashcard-text, .quiz-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin: auto;
}

.quiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 15px auto 0 auto;
    border: solid #2F2B28 1px;
    border-radius: 8px;
    width: 50%;
    background-image: linear-gradient(to top right, #f9f9f9, #cccccc, #f9f9f9);
}

.quiz-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.answer-group {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    padding: 5px 15px;
}

.correct-answer {
    margin: -10px auto 0 auto;
    color: #49a06c;
    animation: fadeIn 2s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.incorrect-answer {
    margin: -10px auto 0 auto;
    color: #c44f4f;
    animation: fadeIn 2s;
}

</style>