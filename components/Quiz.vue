<template>
    <div>

        <!-- Quiz -->
        <div v-if="questions.length !== 0"
            style="display: flex; flex-direction: column;
            justify-content: center; margin: 20px 0;"
        >
            <span class="small-header" style="display: flex; justify-content: center;">Sample Quiz</span>
            <div class="quiz"
                :style="windowWidth < 600 ? {'width': '90%'} : null"
            >
                <div class="quiz-content">
                    <span class="quiz-text">
                        {{ questions[index]?.questiontext }}
                    </span>
                    <div class="answer-group">
                        <v-radio-group v-model="radioGroup">
                            <v-radio :label="answer.answer"
                                :value="i"
                                v-for="(answer, i) in questions[index]?.answers"
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
                    <v-btn icon
                        style="position: absolute; right: 15px; bottom: 15px;"
                        @click="deleteQuestion(questions[index]?.questionid)"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card-subtitle class="text-center">
                <v-btn icon @click="prevQuestion()">
                    <v-icon size="40">
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                {{index + 1}} / {{questions.length}}
                <v-btn @click="nextQuestion()" icon>
                    <v-icon size="40">
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </v-card-subtitle>
        </div>

        <!-- Quiz form -->
        <div style="display: flex; flex-direction: column;
            justify-content: center; align-items: center;"
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

            <v-btn-toggle
                v-model="numQuestions"
                style="margin-top: 15px;"
                dense
                shaped
            >
                <v-btn style="height: 34px;" small>10 Questions</v-btn>
                <v-btn style="height: 34px;" small>15 Questions</v-btn>
                <v-btn style="height: 34px;" small>20 Questions</v-btn>
            </v-btn-toggle>
            
            <div style="margin-top: 20px;">
                <v-btn class="good-btn"
                    @click="createAiQuiz()"
                    :disabled="quizTopic == '' || numQuestions == null || loading"
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

        <!-- Bottom buffer -->
        <div style="height: 20px;"></div>
    </div>
</template>

<script>
import { openaiTopicalQuiz } from '~/store/openai'
import Loading from '~/components/Loading.vue'
export default {
    name: 'QuizComponent',

    created () {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    },

    async mounted () {
        await this.$store.dispatch('users/getQuestions', {
            noteid: this.currentNote.noteid
        })
    },

    components: {
        Loading
    },

    data () {
        return {
            index: 0,
            radioGroup: null,
            currentAnswer: null,
            answerStatus: '',
            loading: false,
            loadingText: '',
            quizTopic: '',
            numQuestions: null,
            windowWidth: window.innerWidth
        }
    },

    methods: {
        async createAiQuiz() {
            if (this.userData.subscriptionstatus == 'inactive') {
                alert("You need an active subscription to use AI quiz generation. Go to your account settings to upgrade your plan.")
            } else if (this.calledAiToday && this.userData.numaicalls == 10) {
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'You have reached the maximum number of allowed AI parsing calls for today.'
                })
            } else {
                this.loadingText = 'Waiting for AI'
                this.loading = true
                const questions = await openaiTopicalQuiz({
                    topic: this.quizTopic,
                    numQuestions: this.numQuestions == 0 ? 10 : this.numQuestions == 1 ? 15 : 20
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
                    this.loadingText = 'Waiting for Database'
                    await this.$store.dispatch('users/updateAiCalls', {
                        date: this.getDate,
                        num: this.calledAiToday ? this.userData.numaicalls + 1 : 1
                    })

                    questions.forEach(async q => {
                        await this.$store.dispatch('users/addQuestion', {
                            noteid: this.currentNote.noteid,
                            questiontext: q.questiontext,
                            answers: q.answers
                        })
                    });

                    await this.$store.dispatch('users/getQuestions', {
                        noteid: this.currentNote.noteid
                    })

                    this.loading = false
                    this.loadingText = ''
                    this.quizTopic = ''
                    await this.$store.commit('users/setAlert', {
                        color: 'success',
                        icon: '$success',
                        text: 'Success! Your quiz has been created.'
                    })
                }
            }
        },

        checkAnswer(isCorrect) {
            this.answerStatus = isCorrect ? 'correct' : 'incorrect'
        },

        nextQuestion() {
            this.currentAnswer = null
            this.answerStatus = ''
            this.radioGroup = null
            if (this.index === this.questions.length - 1) this.index = 0
            else this.index++
        },
        
        prevQuestion() {
            this.currentAnswer = null
            this.answerStatus = ''
            this.radioGroup = null
            if (this.index === 0) this.index = this.questions.length - 1
            else this.index--
        },

        async deleteQuestion(questionid) {
            if (confirm('Do you want to delete this question?')) {
                await this.$store.dispatch('users/deleteQuestion', {
                    questionid: questionid,
                    noteid: this.currentNote.noteid
                })
                if (this.index > this.questions.length - 1) this.index = this.questions.length - 1
            }
        },
    },

    computed: {
        userData () {
            return this.$store.state.users.userData
        },

        currentNote () {
            return this.$store.state.users.currentNote
        },

        questions () {
            return this.$store.state.users.questions
        },

        getDate () {
            return new Date().toDateString()
        },

        calledAiToday () {
            return this.userData.lastaicall == this.getDate
        },
        
        remainingAiCalls () {
            return this.calledAiToday ? 10 - this.userData.numaicalls : 10
        },
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.quiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 15px auto 0 auto;
    border: solid #2F2B28 1px;
    border-radius: 8px;
    width: 75%;
    background-image: linear-gradient(to top right, #f9f9f9, #cccccc, #f9f9f9);
}

.quiz-content {
    position: relative;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.quiz-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin: auto;
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