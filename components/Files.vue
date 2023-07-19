<template>
    <v-dialog
        v-model="showFiles"
        :width="windowWidth < 800 ? '90%' : openedFile ? '70%' : '50%'"
    >
        <v-btn class="close-btn" v-if="openedFile" @click="openedFile = null" icon>
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card class="dialog-card" v-if="!openedFile" elevation="5">
            <v-card-title class="basic-header justify-center">Files</v-card-title>
            <v-divider style="margin-bottom: 10px;" />
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
            <v-card-actions>
                <v-file-input
                    class="file-upload"
                    label="Upload File"
                    accept=".pdf, .docx"
                    multiple
                    chips
                    @change="handleFileInput"
                    v-model="files"
                ></v-file-input>
                <v-btn class="flat-btn" @click="uploadFiles" text>Upload</v-btn>
            </v-card-actions>
        </v-card>
        <iframe class="file-frame" v-if="openedFile && isDoc" :src="`https://docs.google.com/gview?url=${openedFile.url}&embedded=true`"></iframe>
        <iframe class="file-frame" v-if="openedFile && !isDoc" :src="openedFile?.url"></iframe>
    </v-dialog>
</template>

<script>
export default {
    name: 'Files',

    created () {
        window.addEventListener('resize', this.resizeHandler)
    },

    data () {
        return {
            files: [],
            openedFile: null,
            windowWidth: window.innerWidth
        }
    },

    methods: {
        openFile(file) {
            this.openedFile = file
        },

        handleFileInput(files) {
            this.files = files
        },

        resizeHandler() {
            this.windowWidth = window.innerWidth
        },

        uploadFiles() {
            this.$store.dispatch('users/uploadFiles', {
                files: this.files,
                noteid: this.$store.state.users.currentNote.noteid
            })
            this.files = []
        },

        deleteFile(file) {
            this.$store.dispatch('users/removeFile', {
                noteid: this.$store.state.users.currentNote.noteid,
                filename: file.name
            })
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

        allFiles () {
            return this.$store.state.users.noteFiles
        },

        isDoc() {
            console.log(this.openedFile.name.includes('docx'))
            return this.openedFile.name.includes('docx')
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

.dialog-card {
    margin: auto !important;
    height: auto;
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

.delete-icon {
    float: right;
}

.divider {
    margin: 10px 0;
}

</style>