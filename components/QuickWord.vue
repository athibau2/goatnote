<template>
    <v-dialog class="dialog" v-model="showQuickWord"
        :width="windowWidth < 800 ? '90%' : '40%'"
    >
        <div class="dialog-card" elevation="5" @keydown.esc="close" @keydown.enter="saveWord">
            <label for="word">Press Enter when finished or Esc to exit</label>
            <v-text-field
                name="word"
                autofocus
                v-model="word"
                label="Enter flashcard front"
            ></v-text-field>
            <label for="answer">Leave this blank if you want to add to your AI Flashcard Queue</label>
            <v-text-field
                name="answer"
                v-model="answer"
                label="Enter flashcard back"
            ></v-text-field>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: 'QuickWordComponent',

    created () {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    },

    data () {
        return {
            windowWidth: window.innerWidth,
            word: '',
            answer: ''
        }
    },

    methods: {
        async saveWord(event) {
            if (this.word != '') {
                if (this.answer != '') {
                    await this.$store.dispatch('users/addFlashcard', {
                        newPrompt: this.word,
                        newAnswer: this.answer,
                        noteid: this.currentNote.noteid
                    })
                } else  {
                    await this.$store.dispatch('users/addPreparedWord', {
                        word: this.word,
                        noteid: this.currentNote.noteid
                    })
                }
            }
            await this.$store.commit('users/setShowQuickWord', false)
            event.preventDefault();
            this.word = ''
            this.answer = ''
        },

        async close() {
            this.word = ''
            this.answer = ''
            await this.$store.commit('users/setShowQuickWord', false)
        }
    },

    computed: {
        showQuickWord: {
            get () {
                return this.$store.state.users.showQuickWord
            },

            async set () {
                await this.$store.commit('users/setShowQuickWord', false)
            }
        },

        preparedWords () {
            return this.$store.state.users.preparedWords
        },

        currentNote () {
            return this.$store.state.users.currentNote
        }
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.dialog-card {
    background-color: #f9f9f9;
    padding: 5px 10px;
}

</style>