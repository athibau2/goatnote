<template>
  <v-app>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/js/shepherd.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/css/shepherd.css"/>
      <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"></script>
      <script src="https://www.whiteboard.team/dist/api.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/simple-image@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/table@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/raw"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/text-variant-tune@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/underline@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/inline-code@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/code@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/warning@latest"></script>
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/marker@latest"></script>
    </head>

    <div>
        <v-row>
            <v-col>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    @click="back()"
                    icon
                  >
                    <v-icon size="30">mdi-arrow-left</v-icon>
                  </v-btn>
                </template>
                <span>Back</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="margin-left: 5px;"
                    v-bind="attrs"
                    v-on="on"
                    @click="newNote()"
                    icon
                  >
                    <v-icon size="28">mdi-note-plus</v-icon>
                  </v-btn>
                </template>
                <span>New Note</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="margin-left: 5px;"
                    v-on="on"
                    v-bind="attrs"
                    @click="runTutorial()"
                    icon
                  >
                    <v-icon size="26">mdi-help</v-icon>
                  </v-btn>
                </template>
                <span>Run Tutorial</span>
              </v-tooltip>
            </v-col>

            <v-col :cols="windowWidth < 600 ? '12' : '7'" v-if="userData.userid == currentNote.userid">
              <v-text-field v-if="editNote"
                class="noteselector"
                id="note-name"
                dense
                solo
                rounded
                color="#f9f9f9"
                append-icon="mdi-chevron-down"
                append-outer-icon="mdi-pencil"
                @click:append-outer="editNote = !editNote"
                :value="currentNote.notename"
                @input="nameChanged($event)"
                @keyup.enter="updateNoteName()"
              >
              </v-text-field>
              <v-menu
                v-if="!editNote"
                bottom
                transition="slide-y-transition"
                :offset-y="true"
                close-on-content-click
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field id="note-name"
                    class="noteselector"
                    dense
                    solo
                    rounded
                    readonly
                    color="#f9f9f9"
                    append-icon="mdi-chevron-down"
                    append-outer-icon="mdi-pencil"
                    @click:append-outer="editNote = !editNote"
                    v-bind="attrs"
                    v-on="on" 
                    :placeholder="currentNote.notename"
                  >
                  </v-text-field>
                </template>
                <v-list>
                  <v-list-item v-for="(n, i) in notes" :key="i" link>
                      <v-list-item-title
                        v-text="n.notename"
                        style='font-size: 10pt;'
                        @click="switchNote(n.noteid)"
                      >
                      </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>                
            </v-col>
            <v-col :cols="windowWidth < 600 ? '12' : '7'" v-else>
              <v-text-field id="note-name"
                class="noteselector"
                dense
                solo
                rounded
                readonly
                color="#f9f9f9"
                :placeholder="currentNote.notename"
              >
              </v-text-field>          
            </v-col>

            <v-col class="text-right">
              <span style="font-family: Times New Roman; font-size: 16px;"
              >
                {{ parent.type == 'org' ? parent.orgname : parent.foldername }}
              </span>
              <h5 class="pretty-date">{{prettyDate}}</h5>
            </v-col>
        </v-row>

        <!-- Notes area fullscreen -->
        <v-row v-if="windowWidth >= 1200">
          <v-col cols="9">
            <v-btn-toggle
              v-model="editorOrWhiteboard"
              style="margin-bottom: 5px;"
              class="small-header"
              rounded
              dense
            >
              <v-btn style="font-size: 13px !important;">Text Editor</v-btn>
              <v-btn id="whiteboard-btn" style="font-size: 13px !important;">Whiteboard</v-btn>
            </v-btn-toggle>
            <span class="small-header" v-if="editorOrWhiteboard == 0" style="float: right;">{{saving}}</span>
            <v-tooltip top v-if="editorOrWhiteboard == 1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                  @click="newWhiteboard(true)"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon size="30">mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>New Whiteboard</span>
            </v-tooltip>
            <v-tooltip top v-if="editorOrWhiteboard == 1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                  class="flat-btn"
                  style="border-radius: 50px;"
                  @click="showMyWhiteboards()"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon size="30">mdi-draw</v-icon> ({{whiteboards.length}})
                </v-btn>
              </template>
              <span>My Whiteboards</span>
            </v-tooltip>
            <!-- <v-btn @click="saveTheNotes()">Save</v-btn> -->
            <div class="editor-wrapper" id="editor" v-if="editorOrWhiteboard == 0" @keydown.ctrl.space="quickWord">
              <Loading v-if="!showEditor" style="align-items: start;" />
              <textarea id="sunEditor"
                hidden
                v-if="editorOrWhiteboard == 0"
                v-model="noteText"
                :disabled="(userData.userid == currentNote.userid) ? false : true"
              ></textarea>
              <!-- <div id="editorjs"></div> -->
              <!-- <div id="toolbar-container"></div>
              <div id="editor"></div> -->
              <!-- <RichEditor /> -->
              <!-- <div style="border: 1px solid #ccc;">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="noteText"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                />
              </div> -->
            </div>
            <div class="canvas-wrapper" v-if="editorOrWhiteboard == 1">
              <div style="width: 100%; height: 100%;" id="wt-container"></div>
            </div>
          </v-col>

          <!-- Buttons area large screen -->
          <v-col class="text-center" cols="3">
            <div v-if="userData.subscriptionstatus == 'active'">
              <span class="small-header">AI calls remaining today:&ensp;{{remainingAiCalls}} / 6</span>
            </div>
            <div>
              <v-btn class="tool-btn" id="ai-btn"
                @click="generateStudyTools()"
                :disabled="(userData.userid == currentNote.userid ? false : true) || isGeneratingTools"
              >
                <Loading v-if="isGeneratingTools" /> {{ !isGeneratingTools ? 'Generate Flashcards' : `&ensp;${generatingStatus}` }}
              </v-btn>
            </div>
            <div id="note-step-3">
              <v-btn class="tool-btn" id="tools-btn" @click="showStudyTools()">Study Tools</v-btn>
            </div>
            <div id="note-step-2">
              <v-btn class="tool-btn" id="share-btn"
                @click="getSharedNoteList(currentNote)"
                :disabled="userData.userid == currentNote.userid ? false : true"
              >
                Share Note
              </v-btn>
            </div>
            <v-divider style="margin: 20px 0;" />
            <div id="queue-area">
              <span>
                <span class="small-header">Flashcard Queue</span>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" @click="clearPreparedWords()" icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove All</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" @click="quickWord()" icon>
                      <v-icon size="28">mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add Word</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs">mdi-help</v-icon>
                  </template>
                  <span>Click 'Ctrl + Space' inside your text editor</span>
                </v-tooltip>
              </span><br>
              <span class="subtitle">
                Click to Remove
                &ndash;
                {{preparedWords.length}}
              </span>
              <div class="prepared-words-wrapper">
                <span v-for="(word, i) in preparedWords"
                  :key="i"
                >
                  <button class="prepared-word" @click="removePreparedWord(word)">
                    {{word.word}}
                  </button>
                </span>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Buttons area small screen -->
        <v-col cols="12" v-else-if="windowWidth < 1200">
          <div v-if="userData.subscriptionstatus == 'active'">
            <span class="small-header">AI calls remaining today:&ensp;{{remainingAiCalls}} / 6</span>
          </div>
          <v-btn class="tool-btn" id="ai-btn"
            :style="windowWidth < 936 ? 'font-size: 12px' : null"
            width="auto" 
            @click="generateStudyTools()"
            :disabled="(userData.userid == currentNote.userid ? false : true) || isGeneratingTools"
          >
            <Loading v-if="isGeneratingTools" /> {{ !isGeneratingTools ? 'Generate Flashcards' : `&ensp;${generatingStatus}` }}
          </v-btn>
          <v-btn class="tool-btn" id="tools-btn"
            :style="windowWidth < 936 ? 'font-size: 12px' : null"
            width="auto"
            @click="showStudyTools()"
          >
            Study Tools
          </v-btn>
          <v-btn class="tool-btn" id="share-btn"
            :style="windowWidth < 936 ? 'font-size: 12px' : null"
            width="auto"
            @click="getSharedNoteList(currentNote)"
            :disabled="userData.userid == currentNote.userid ? false : true"
          >
            Share Note
          </v-btn>
          <div id="queue-area">
            <span>
              <span class="small-header" style="vertical-align: bottom;">Flashcard Queue</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-on="on" v-bind="attrs" @click="clearPreparedWords()" style="align-items: flex-end;" icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Remove All</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-on="on" v-bind="attrs" @click="quickWord()" style="align-items: flex-end;" icon>
                    <v-icon size="28">mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add Word</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="align-items: flex-end;" v-on="on" v-bind="attrs" icon>
                    <v-icon>mdi-help</v-icon>
                  </v-btn>
                </template>
                <span>Click 'Ctrl + Space' inside your text editor</span>
              </v-tooltip>
            </span>
            <span class="subtitle" style="float: right; margin-top: 15px">
              Click to Remove
              &ndash;
              {{preparedWords.length}}
            </span>
            <div class="prepared-words-wrapper">
              <span v-for="(word, i) in preparedWords"
                :key="i"
              >
                <button class="prepared-word" @click="removePreparedWord(word)">
                  {{word.word}}
                </button>
              </span>
            </div>
          </div>

          <!-- Notes area small screen -->
          <v-btn-toggle
            v-model="editorOrWhiteboard"
            style="margin: 5px 0;"
            class="small-header"
            rounded
            dense
          >
            <v-btn style="font-size: 13px !important;">Text Editor</v-btn>
            <v-btn id="whiteboard-btn" style="font-size: 13px !important;">Whiteboard</v-btn>
          </v-btn-toggle>
          <span class="small-header" v-if="editorOrWhiteboard == 0" style="float: right;">{{saving}}</span>
          <v-tooltip right v-if="editorOrWhiteboard == 1">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon
                @click="newWhiteboard(true)"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon size="30">mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>New Whiteboard</span>
          </v-tooltip>
          <v-tooltip right v-if="editorOrWhiteboard == 1">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text
                class="flat-btn"
                style="border-radius: 50px;"
                @click="showMyWhiteboards()"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon size="30">mdi-draw</v-icon> ({{whiteboards.length}})
              </v-btn>
            </template>
            <span>My Whiteboards</span>
          </v-tooltip>
          <div class="editor-wrapper" id="editor" v-if="editorOrWhiteboard == 0" @keydown.ctrl.space="quickWord">
            <Loading v-if="!showEditor" style="align-items: start;" />
            <textarea id="sunEditor"
              hidden
              v-if="editorOrWhiteboard == 0"
              v-model="noteText"
              :disabled="(userData.userid == currentNote.userid) ? false : true"
            ></textarea>
          </div>
          <div class="canvas-wrapper" v-if="editorOrWhiteboard == 1">
            <div style="width: 100%; height: 100%;" id="wt-container"></div>
          </div>
        </v-col>

        <ShareNote style="margin: auto;" />
        <Tools style="margin: auto;" />
        <QuickWord style="margin: auto;" />
        <Whiteboards style="margin: auto;" @opened-board="openBoard()" />
    </div>
  </v-app>
</template>

<script>
import Tools from '~/components/Tools.vue'
import ShareNote from '~/components/ShareNote.vue'
import QuickWord from '~/components/QuickWord.vue'
import Whiteboards from '~/components/Whiteboards.vue'
import Shepherd from 'shepherd.js'
import { openaiGenerateStudyTools } from '~/store/openai'
import { debounce } from 'lodash'
import Loading from '~/components/Loading.vue'
import suneditor from 'suneditor'
import 'suneditor/dist/css/suneditor.min.css'
import plugins from '~/node_modules/suneditor/src/plugins'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import randomstring from 'randomstring'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { DomEditor } from '@wangeditor/editor'
// import RichEditor from '~/components/Editor.vue'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';

export default {
  name: 'NotePage',

  head() {
    return {
      title: 'Note - GOAT Notes',
      meta: [
        { hid: 'note-description', name: 'description', content: 'Use AI to take better notes and study more effectively in GOAT Notes.' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, whiteboard, flashcards, tools' }
      ]
    }
  },

  components: {
      Tools,
      ShareNote,
      QuickWord,
      Loading,
      Whiteboards,
      Editor,
      Toolbar,
      // RichEditor,
  },

  async mounted() {
    i18nChangeLanguage('en')
    this.parent = JSON.parse(localStorage.getItem('notes-parent'))
    await this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
    // parent.type == 'org' ? await this.$store.dispatch('users/getOrgNotes', {
    //   parent: null
    // }) : await this.$store.dispatch('users/getFolderNotes', {
    //   parent: parent.folderid
    // })
    await this.$store.dispatch('users/getFiles', {
      noteid: this.currentNote.noteid
    })
    await this.$store.dispatch('users/getPreparedWords', {
      noteid: this.currentNote.noteid
    })
    await this.$store.dispatch('users/getWhiteboards', {
      noteid: this.currentNote.noteid
    })
    this.$store.commit('users/flashcards', JSON.parse(localStorage.getItem('flashcards')))
    this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
    this.$store.commit('users/studyPlans', JSON.parse(localStorage.getItem('studyPlans')))
    this.$store.commit('users/setNotes', JSON.parse(localStorage.getItem('collNotes')))
    if (!this.userData.noteonboarded) {
      this.addSteps()
      this.noteTour.start()
      this.noteTour.on('complete', this.onboardingComplete)
    }
    // this.editorjs = new EditorJS({
    //   holder: 'editorjs',
    //   autofocus: true,
    //   data: JSON.parse(localStorage.getItem('editor-js-notes')),
    //   tools: {
    //     paragraph: {
    //       class: Paragraph,
    //       inlineToolbar: true,
    //     },
    //     image: {
    //       class: SimpleImage,
    //       inlineToolbar: true,
    //     },
    //     header: {
    //       class: Header,
    //       shortcut: 'CMD+SHIFT+H',
    //     },
    //     table: {
    //       class: Table,
    //       inlineToolbar: true,
    //       config: {
    //         rows: 2,
    //         cols: 3,
    //       },
    //     },
    //     list: {
    //       class: NestedList,
    //       inlineToolbar: true,
    //       config: {
    //         defaultStyle: 'unordered'
    //       },
    //     },
    //     checklist: {
    //       class: Checklist,
    //       inlineToolbar: true,
    //     },
    //     underline: {
    //       class: Underline,
    //       inlineToolbar: true,
    //     },
    //     Marker: {
    //       class: Marker,
    //       inlineToolbar: true,
    //     },
    //     inlineCode: {
    //       class: InlineCode,
    //       inlineToolbar: true,
    //     },
    //     code: CodeTool,
    //     textVariant: TextVariantTune,
    //     raw: RawTool,
    //     warning: {
    //       class: Warning,
    //       inlineToolbar: true,
    //       config: {
    //         titlePlaceholder: 'Title',
    //         messagePlaceholder: 'Message',
    //       },
    //     },
    //     quote: {
    //       class: Quote,
    //       inlineToolbar: true,
    //       shortcut: 'CMD+SHIFT+O',
    //       config: {
    //         quotePlaceholder: 'Enter a quote',
    //         captionPlaceholder: 'Quote\'s author',
    //       },
    //     },
    //     delimiter: Delimiter,
    //   },
    //   tunes: ['textVariant'],
    // });
    this.showEditor = true
    // ClassicEditor
    //   .create( document.querySelector( '#editor' ), {
    //       // plugins: [ Alignment,
    //       //   Autoformat,
    //       //   BlockQuote,
    //       //   Bold,
    //       //   CloudServices,
    //       //   Essentials,
    //       //   Heading,
    //       //   Image,
    //       //   ImageCaption,
    //       //   ImageStyle,
    //       //   ImageToolbar,
    //       //   ImageUpload,
    //       //   Indent,
    //       //   Italic,
    //       //   Link,
    //       //   List,
    //       //   MediaEmbed,
    //       //   Paragraph,
    //       //   PasteFromOffice,
    //       //   Table,
    //       //   TableToolbar,
    //       //   TextTransformation
    //       // ],
    //       // toolbar: [
    //       //   'alignment',
    //       //   'heading',
    //       //   '|',
    //       //   'bold',
    //       //   'italic',
    //       //   'link',
    //       //   'bulletedList',
    //       //   'numberedList',
    //       //   '|',
    //       //   'outdent',
    //       //   'indent',
    //       //   '|',
    //       //   'imageUpload',
    //       //   'blockQuote',
    //       //   'insertTable',
    //       //   'mediaEmbed',
    //       //   'undo',
    //       //   'redo'
    //       // ]
    //   } )
    //   .then( editor => {
    //       console.log( 'Editor was initialized', editor );
    //   } )
    //   .catch( error => {
    //       console.error( error.stack );
    //   } );
    this.$nextTick(() => {
      this.createSunEditor()
    })
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  data () {
    return {
        parent: {},
        showEditor: false,
        isGeneratingTools: false,
        generatingStatus: '',
        showLinks: false,
        showStudyPlans: false,
        editorOrWhiteboard: 0,
        noteText: JSON.parse(localStorage.getItem('note')).typednotes,
        prettyDate: localStorage.getItem('prettyDate'),
        editNote: false,
        newNoteName: JSON.parse(localStorage.getItem('note')).notename,
        windowWidth: window.innerWidth,
        noteTour: new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
          }
        }),
        whiteboard: null,
        wordsToRemove: [],
        editorjs: null,
        sunEditor: null,
        editor: null,
        html: '<p>hello</p>',
        toolbarConfig: {
          excludeKeys: [
            'fullScreen',
          ]
        },
        editorConfig: { 
          placeholder: 'Type here...',
          language: 'en',
        },
        mode: 'default',
    }
  },

  watch: {
    noteText(newValue) {
      this.saveNotes
    },

    async windowWidth(newValue, oldValue) {
      if ((newValue < 1200 && oldValue >= 1200) ||
      (newValue >= 1200 && oldValue < 1200)) {
        if (this.editorOrWhiteboard == 0) {
          await this.sunEditor.hide()
          await this.sunEditor.show()
        }
      }
    },

    async editorOrWhiteboard(newValue, oldValue) {
      if (newValue == 1) {
        this.sunEditor.hide()
        this.$nextTick(async () => {
          this.getCurrentWhiteboard()
        });
      } else if (newValue == 0 && oldValue == 1) {
        this.sunEditor.show()
      }
    }
  },

  methods: {
      back() {
        this.$router.go(-1)
      },

      saveTheNotes() {
        // this.editorjs.save().then(savedData => {
        //   localStorage.setItem('editor-js-notes', JSON.stringify(savedData, null, 4))
        // })
        const toolbar = DomEditor.getToolbar(this.editor)
        console.log(toolbar.getConfig().toolbarKeys)
      },

      onCreated(editor) {
        this.editor = Object.seal(editor) // Use `Object.seal`
      },

      async createSunEditor() {
        this.sunEditor = suneditor.create('sunEditor', {
          value: this.noteText,
          plugins: plugins,
          katex: katex,
          width: '100%',
          height: '80vh',
          callBackSave: this.saveNotes,
          buttonList: [
              ['undo', 'redo'],
              ['removeFormat'],
              ['font', 'fontSize', 'formatBlock'],
              ['paragraphStyle', 'blockquote'],
              ['bold', 'underline', 'italic'],
              ['strike', 'subscript', 'superscript'],
              ['fontColor', 'hiliteColor', 'textStyle'],
              ['outdent', 'indent'],
              ['align', 'horizontalRule', 'list', 'lineHeight'],
              ['table', 'link', 'image', 'video', 'audio', 'math'],
              ['fullScreen', 'preview', 'print', 'save'],
          ]
        })
        this.sunEditor.onChange = async (contents, core) => {
          if (this.saving != 'Unsaved') await this.markUnsaved()
          localStorage.setItem('note_text', JSON.stringify(contents))
        }
      },

      async markUnsaved() {
        await this.$store.commit('users/saving', "Unsaved")
      },

      async getCurrentWhiteboard() {
        let boardCode = ''
        let currentWhiteboard = localStorage.getItem('current_whiteboard')
        if (currentWhiteboard != null && currentWhiteboard != undefined && 
        currentWhiteboard != 'null' && currentWhiteboard != 'undefined') {
          let whiteboardObj = JSON.parse(currentWhiteboard)
          boardCode = whiteboardObj.uid
          await this.initWhiteboard(boardCode)
        } else {
          if (this.whiteboards.length > 0) {
            localStorage.setItem('current_whiteboard', JSON.stringify(this.whiteboards[this.whiteboards.length - 1]))
            boardCode = this.whiteboards[this.whiteboards.length - 1].uid
            await this.initWhiteboard(boardCode)
          } else await this.newWhiteboard(false)
        }
      },

      async initWhiteboard(code) {
        this.whiteboard = await new api.WhiteboardTeam('#wt-container', {
          clientId: process.env.NUXT_ENV_WHITEBOARD_CLIENT_ID,
          boardCode: code,
          board: {
            tool: 'pen',
          },
          participant: {
            name: this.userData.firstname,
            permissions : ["view_templates", "view_chat"]
          }
        })
      },

      async newWhiteboard(shouldDestroy) {
        const code = await this.$store.dispatch('users/addWhiteboard', {
          noteid: this.currentNote.noteid
        })
        if (shouldDestroy) this.whiteboard.destroy()
        await this.initWhiteboard(code)
      },

      async openBoard() {
        this.whiteboard.destroy()
        let whiteboard = JSON.parse(localStorage.getItem('current_whiteboard'))
        await this.initWhiteboard(whiteboard.uid)
      },

      blobToDataURL(blob, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
          callback(event.target.result);
        };
        reader.readAsDataURL(blob);
      },

      runTutorial() {
        this.addSteps()
        this.noteTour.start()
      },

      async quickWord() {
        await this.$store.commit('users/setShowQuickWord', true)
      },

      async showMyWhiteboards() {
        await this.$store.commit('users/setShowMyWhiteboards', true)
      },

      async removePreparedWord(word) {
        await this.$store.dispatch('users/removePreparedWord', {
          wordid: word.wordid,
          noteid: word.noteid
        })
      },

      async clearPreparedWords() {
        await this.$store.dispatch('users/clearPreparedWords', {
          noteid: this.currentNote.noteid
        })
      },

      showStudyTools() {
        this.$store.commit('users/setShowStudyTools', true)
      },

      showFiles() {
        this.$store.commit('users/showFiles', true)
      },

      showFlashcards() {
        this.$store.commit('users/showFlashcards', true)
      },

      async newNote() {
        if (this.saving == 'Unsaved') {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Save your notes before creating a new one.'
          })
        } else {
          await this.$store.dispatch('users/createNote', {
            notename: 'Untitled Note',
            parent: this.parent.type == 'org' ? null : this.parent.folderid,
            fromNote: true
          })
          this.editorOrWhiteboard = 0
          this.noteText = this.currentNote.typednotes
          this.prettyDate = localStorage.getItem('prettyDate')
          await this.sunEditor.destroy()
          await this.createSunEditor()
        }
      },

      async generateStudyTools() {
        if (this.userData.subscriptionstatus == 'inactive') {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'This feature is only available for the Premium plan. Please upgrade your account to access this feature.'
          })
        } else if (this.calledAiToday && this.userData.numaicalls == 6) {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'You have reached the maximum number of allowed AI parsing calls for today.'
          })
        } else if (this.preparedWords.length < 10) {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'You need at least 10 words in the queue before you can generate flashcards.'
          })
        } else if (confirm('Are you ready to generate flashcards? This will take the first 20 entries from your Flashcard Queue and automatically create flash cards for you. This may take a minute to complete. Please do not refresh your page.')) {
          this.isGeneratingTools = true
          let words = []

          if (this.preparedWords.length <= 20) {
            this.preparedWords.forEach(word => {
              words.push(word.word)
            })
          } else {
            for (let i = 0; i < 20; ++i) {
              let word = this.preparedWords[i]
              words.push(word.word)
              this.wordsToRemove.push(word)
            }
          }

          this.generatingStatus = 'Waiting for AI'
          const studyTools = await openaiGenerateStudyTools({
            input: words,
            notename: this.currentNote.notename
          })

          if (studyTools.length == 0) {
            this.isGeneratingTools = false
            this.generatingStatus = ''
            this.wordsToRemove = []
            await this.$store.commit('users/setAlert', {
              color: 'error',
              icon: '$error',
              text: 'Something went wrong and no study tools were generated. Please try again.'
            })
          } else {
            this.generatingStatus = 'Waiting for Database'
            await this.$store.dispatch('users/updateAiCalls', {
              date: this.getDate,
              num: this.calledAiToday ? this.userData.numaicalls + 1 : 1
            })

            for (let i = 0; i < studyTools.length; ++i) {
              await this.$store.dispatch('users/addFlashcard', {
                newPrompt: studyTools[i].cardprompt,
                newAnswer: studyTools[i].cardanswer,
                noteid: this.currentNote.noteid,
                deckid: null,
                isNote: true
              })
            }

            if (this.preparedWords.length <= 20) {
              await this.clearPreparedWords()
            } else {
              for (let i = 0; i < this.wordsToRemove.length; ++i) {
                await this.removePreparedWord(this.wordsToRemove[i])
              }
              this.wordsToRemove = []
            }

            this.isGeneratingTools = false
            this.generatingStatus = ''
            await this.$store.commit('users/setAlert', {
              color: 'success',
              icon: '$success',
              text: 'Your study tools have been successfully generated. You can review them by clicking the \"Study Tools\" button.'
            })
          }
        }
      },

      // async summarize() {
      //   const success = await summarizeText({
      //     input: this.noteText
      //   })
      //   if (!success) {
      //     await this.$store.commit('users/setAlert', {
      //       color: 'error',
      //       icon: '$error',
      //       text: 'Maximum text length for summary has been exceeded. Please highlight a portion of your notes to summarize.'
      //     })
      //   }
      // },
      
      addSteps() {
        this.noteTour.addSteps([
          {
            id: 'note-step-0',
            text: 'Welcome to the note page. Let me show you around a little bit!',
            buttons: [
              {
                text: 'Let\'s Go!',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-1',
            text: 'First and foremost, this area is where you can type out any notes you take.',
            attachTo: {
              element: '#editor',
              on: 'top'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-1.5',
            text: 'The whiteboard tab gives you a canvas to take notes however you want! You can draw and add text, images, or shapes, all to create whatever kind of notes you need!',
            attachTo: {
              element: '#whiteboard-btn',
              on: 'right'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-2',
            text: 'You can switch between different notes in the same collection here, or edit the name of your note by clicking the pencil icon on the right.',
            attachTo: {
              element: '#note-name',
              on: 'bottom'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-3',
            text: 'This button will use AI to create flashcards for you from your Flashcard Queue, taking 20 entries at a time. As a subscriber to the Premium membership, you can use this button 6 times every day.',
            attachTo: {
              element: '#ai-btn',
              on: 'bottom'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-4',
            text: 'All your study tools are in one place. Here you can see and edit flashcards, files, links, and study plans. Generating flashcards with AI will automatically upload them here. Take a look at Study Mode!',
            attachTo: {
              element: '#tools-btn',
              on: 'bottom'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-5',
            text: 'Here, you can share your notes with others in the same organization. They can\'t change your written notes, but they can collaborate on the study tools.',
            attachTo: {
              element: '#share-btn',
              on: 'bottom'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-step-6',
            text: 'As you take notes, add vocab words to the Flashcard Queue to prepare for AI flashcard generation. To do this, press \'Ctrl + Space\' while inside your text editor. When you click \'Generate Flashcards\', it will take the top 20 from here.',
            attachTo: {
              element: '#queue-area',
              on: 'bottom'
            },
            buttons: [
              {
                text: 'Next',
                action: this.noteTour.next
              }
            ]
          },
          {
            id: 'note-final-step',
            text: 'That concludes our tour! Now, get to it!',
            buttons: [
              {
                text: 'Finish',
                action: this.noteTour.complete
              }
            ]
          },
        ]);
      },

      onboardingComplete () {
        this.$store.dispatch('users/noteOnboardingComplete')
      },

      resizeHandler() {
        this.windowWidth = window.innerWidth
      },

      nameChanged (event) {
        this.newNoteName = event
      },

      async getSharedNoteList (note) {
        await this.$store.dispatch('users/getSharedNoteList', {
          note: note
        })
        await this.$store.commit('users/setShowShareNote', true)
      },

      async updateNoteName () {
        await this.$store.dispatch('users/updateNoteName', {
          newNoteName: this.newNoteName,
          noteid: this.currentNote.noteid
        })
        this.editNote = !this.editNote
      },

      saveNotes: debounce(async function() {
        this.$store.commit('users/saving', "Saving...")
        setTimeout(async () => {
          let notes = JSON.parse(localStorage.getItem('note_text'))
          await this.$store.dispatch('users/saveNotes', {
            noteText: notes,
            noteid: this.currentNote.noteid
          })
          localStorage.removeItem('note_text')
        }, 500);
      }, 500),

      async switchNote(noteid) {
        if (this.saving == 'Unsaved') {
          await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Save your notes before switching.'
          })
        } else {
          this.editorOrWhiteboard = 0
          await this.$store.dispatch('users/openNote', {
            noteid: noteid
          })
          this.noteText = this.currentNote.typednotes
          await this.sunEditor.destroy()
          await this.createSunEditor()
        }
      }
  },

  computed: {
    studyMode () {
      return this.$store.state.users.studyMode
    },

    getDate () {
      return new Date().toDateString()
    },

    calledAiToday () {
      return this.userData.lastaicall == this.getDate
    },

    listOfOrgNotes () {
      return this.$store.state.users.orgContentNotes
    },

    listOfFolderNotes () {
      return this.$store.state.users.folderContentNotes
    },

    preparedWords () {
      return this.$store.state.users.preparedWords
    },

    remainingAiCalls () {
      return this.calledAiToday ? 6 - this.userData.numaicalls : 6
    },

    saving () {
      return this.$store.state.users.saving
    },

    userData () {
      return this.$store.state.users.userData
    },

    currentNote () {
        return this.$store.state.users.currentNote
    },

    flashcards () {
      return this.$store.state.users.flashcards
    },

    links () {
      return this.$store.state.users.links
    },

    notes () {
      return this.$store.state.users.notes
    },

    premiumLink () {
      return this.$store.state.users.products[1].paymentLink
    },

    encodedEmail () {
      return encodeURIComponent(this.$store.state.users.userData.email)
    },

    whiteboards () {
      return this.$store.state.users.whiteboards
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
@import '~/assets/styles.css';

.pretty-date {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

#editorjs {
  box-shadow: 0px 0px 2px #2F2B28;
  max-height: 500px;
  overflow-y: scroll;
}
.editor-wrapper {
  height: auto;
}

#sunEditor {
  height: 100% !important;
  z-index: 1 !important;
}

.canvas-wrapper {
  height: 80vh;
  width: 100%;
}

.small-header {
  font-size: 18px !important;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.subtitle {
  font-size: 13px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.prepared-words-wrapper {
  margin: 4px 2px;
  border: solid grey 1px;
  border-radius: 6px;
  max-height: 200px;
  overflow: auto;
  padding: 5px;
}

.prepared-word {
  background-color: #cccccc;
  padding: 3px 5px;
  margin: 2px;
  border-radius: 4px;
}

.prepared-word:hover {
  opacity: 0.85;
}

.tool-btn {
  width: 100%;
  height: 50px !important;
  color: #2F2B28;
  margin: 4px 2px;
  background-image: linear-gradient(to top right, #f9f9f9, #85c59d);
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.noteselector {
  font-size: 20px;
  font-weight: 500;
}

h2 {
  border: solid 1px;
  border-radius: 6px;
  background-color: #ce93d8;
  box-shadow: 3px 3px 3px;
}

</style>
