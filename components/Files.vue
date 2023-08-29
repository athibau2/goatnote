<template>
    <div>
        <v-btn class="close-btn" v-if="openedFile" @click="openedFile = null" icon>
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card class="dialog-card" v-if="!openedFile" elevation="5">
            <v-card-text class="card-text">
                <div v-for="(file, i) in allFiles" :key="i">
                    <a href="#" @click="openFile(file)">
                        <span class="file-name">{{file.name}}</span>
                    </a>
                    <v-btn class="delete-icon" @click="deleteFile(file)" icon>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-divider class="divider" />
                </div>
            </v-card-text>
            <v-card-text>
                <v-file-input
                    class="file-upload"
                    label="Upload File (pdf, docx - 2 MB max)"
                    accept=".pdf, .docx"
                    multiple
                    chips
                    @change="handleFileInput"
                    :error-messages="errorMessages"
                    v-model="files"
                ></v-file-input>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn class="flat-btn" @click="close()" text>
                    Close
                </v-btn>
                <v-btn class="good-btn" @click="uploadFiles">Upload</v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
        <FileView style="margin: auto" />
    </div>
</template>

<script>
import FileView from '~/components/FileView.vue'
export default {
    name: 'Files',

    components: {
        FileView
    },

    created () {
        window.addEventListener('resize', this.resizeHandler)
    },

    mounted () {
        this.maxFiles = this.userData.subscriptionstatus == 'active' ? 5 : 2
    },

    data () {
        return {
            files: [],
            maxFiles: null,
            errorMessages: '',
            openedFile: null,
            windowWidth: window.innerWidth
        }
    },

    methods: {
        async openFile(file) {
            await this.$store.commit('users/setOpenedFile', file)
            await this.$store.commit('users/setShowFileView', true)
        },

        validateFileInput() {
            if (this.files.length + this.allFiles.length > this.maxFiles) {
                this.errorMessages = `You can only upload a maximum of ${this.maxFiles} files.`;
                this.files = []; 
            } else {
                this.errorMessages = '';
            }
        },

        handleFileInput(files) {
            this.files = files
            this.validateFileInput()
        },

        resizeHandler() {
            this.windowWidth = window.innerWidth
        },

        uploadFiles() {
            this.$store.dispatch('users/uploadFiles', {
                files: this.files,
                noteid: this.currentNote.noteid,
                userid: this.currentNote.userid
            })
            this.files = []
        },

        deleteFile(file) {
            this.$store.dispatch('users/removeFile', {
                noteid: this.currentNote.noteid,
                filename: file.name,
                userid: this.currentNote.userid
            })
        },

        async close() {
          this.files = []
          await this.$store.commit('users/setShowStudyTools', false)
        }
    },

    computed: {
        showFiles: {
            get () {
                return this.$store.state.users.showFiles
            },

            set () {
                this.$store.commit('users/showFiles', false)
            }
        },

        currentNote () {
            return this.$store.state.users.currentNote
        },

        allFiles () {
            return this.$store.state.users.noteFiles
        },

        isDoc() {
            console.log(this.openedFile.name.includes('docx'))
            return this.openedFile.name.includes('docx')
        },

        userData () {
            return this.$store.state.users.userData
        }
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.basic-header {
    font-size: 30px !important;
}

.close-btn {
    margin: auto !important;
    display: grid;
}

.file-frame {
    margin: auto !important;
    height: 600px;
}

.card-text {
    max-height: 300px !important;
    overflow-y: scroll;
}

.file-name {
    margin: 15px !important;
    font-size: 18px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.file-upload {
    width: 90%;
    display: flex;
    margin: auto;
}

.delete-icon {
    float: right;
}

.divider {
    margin: 10px 0;
}

</style>