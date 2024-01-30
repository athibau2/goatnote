import { supabase, supabaseService } from "./auth";
const short = require('short-uuid');
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')

export const state = () => ({
    userData: null,
    supabaseUser: null,
    supabaseSession: null,
    alert: null,
    orgs: [],
    userNotes: [],
    allColls: [],
    collections: [],
    quizzes: [],
    questions: [],
    allFlashcardDecks: [],
    allPublicDecks: [],
    flashcardDeck: [],
    folderColls: [],
    orgContentCollections: [],
    orgContentFolders: [],
    orgContentNotes: [],
    folderContentCollections: [],
    folderContentFolders: [],
    folderContentNotes: [],
    folders: [],
    todoList: [],
    tasksDueToday: [],
    taskFolders: [],
    taskColls: [],
    taskFolderColls: [],
    showTaskList: false,
    todoOrg: null,
    todoFolder: null,
    todoColl: null,
    notes: [],
    currentNote: {},
    flashcards: [],
    links: [],
    studyPlans: [],
    allPlans: [],
    makingNewOrg: false,
    makingNewFolder: false,
    makingNewCollection: false,
    makingNewNote: false,
    saving: "Saved",
    studyMode: false,
    adminUsers: [],
    adminOrgs: [],
    adminColls: [],
    adminNotes: [],
    adminUserData: {},
    adminUserOrgs: [],
    adminUserColls: [],
    adminUserNotes: [],
    orgUsers: [],
    collNotes: [],
    collBeingShared: null,
    folderBeingShared: null,
    noteBeingShared: null,
    results: [],
    sharedCollList: [],
    sharedFolderList: [],
    sharedNoteList: [],
    foldersSharedWithMe: [],
    notesSharedWithMe: [],
    publicOrgs: [],
    foundOrg: null,
    showSignupDialog: false,
    showLoginDialog: false,
    signUpWithGoogle: false,
    googleSuccess: false,
    consented: false,
    verifiedAge: false,
    signupInfo: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    },
    products: [
        {
            name: 'Basic',
            price: 'Free',
            paymentLink: null,
            features: [
                'Unlimited collections and notes',
                'Unlimited flashcards',
                'Unlimited links',
                'Unlimited whiteboards',
                'Up to 2 file uploads per note',
                'Share notes and collections with up to 3 people',
            ]
        },
        {
            name: 'Premium',
            price: '$2.99 / month',
            paymentLink: process.env.NUXT_ENV_STRIPE_PAYMENT_LINK,
            features: [
                'Everything in Basic, plus...',
                'Create flashcards with AI',
                'Up to 5 file uploads per note',
                'Unlimited notes and collections sharing',
            ]
        },
    ],
    resetCode: null,
    dataToExport: null,
    emailList: [],
    showFiles: false,
    showFlashcards: false,
    showShareNote: false,
    showShareColl: false,
    showShareFolder: false,
    showStudyTools: false,
    showFileView: false,
    showQuickWord: false,
    showMyWhiteboards: false,
    showDeckDialog: false,
    preparedWords: [],
    openedFile: null,
    noteFiles: [],
    whiteboards: []
  })
  
// mutations should update state
export const mutations = {
    setResetCode(state, data) {
        state.resetCode = data
    },

    study(state, data) {
        state.studyMode = data
    },

    saving(state, data) {
        state.saving = data
    },

    setAlert(state, data) {
        state.alert = data
    },

    newOrg(state, data) {
        state.makingNewOrg = data
    },

    newFolder(state, data) {
        state.makingNewFolder = data
    },

    newCollection(state, data) {
        state.makingNewCollection = data
    },

    newNote(state, data) {
        state.makingNewNote = data
    },

    setExportData(state, data) {
        state.dataToExport = data
    },

    setUserData(state, data) {
        state.userData = data
    },

    setSupabaseUser(state, data) {
        state.supabaseUser = data
    },

    setSupabaseSession(state, data) {
        state.supabaseSession = data
    },

    setOrgs(state, data) {
        state.orgs = data
    },

    allColls(state, data) {
        state.allColls = data
    },

    setCollections(state, data) {
        state.collections = data
    },

    setUserNotes(state, data) {
        state.userNotes = data
    },

    setOrgContentCollections(state, data) {
        state.orgContentCollections = data
    },

    setOrgContentFolders(state, data) {
        state.orgContentFolders = data
    },

    setOrgContentNotes(state, data) {
        state.orgContentNotes = data
    },

    setFolderContentCollections(state, data) {
        state.folderContentCollections = data
    },

    setFolderContentFolders(state, data) {
        state.folderContentFolders = data
    },

    setFolderContentNotes(state, data) {
        state.folderContentNotes = data
    },

    setQuizzes(state, data) {
        state.quizzes = data
    },

    setQuestions(state, data) {
        state.questions = data
    },

    setAllFlashcardDecks(state, data) {
        state.allFlashcardDecks = data
    },

    setAllPublicDecks(state, data) {
        state.allPublicDecks = data
    },

    setFlashcardDeck(state, data) {
        state.flashcardDeck = data
    },

    setTaskFolders(state, data) {
        state.taskFolders = data
    },

    setTaskColls(state, data) {
        state.taskColls = data
    },

    setTaskFolderColls(state, data) {
        state.taskFolderColls = data
    },

    setFolderColls(state, data) {
        state.folderColls = data
    },

    setFolders(state, data) {
        state.folders = data
    },

    setShowTaskList(state, data) {
        state.showTaskList = data
    },

    setShowDeckDialog(state, data) {
        state.showDeckDialog = data
    },

    setTodoList(state, data) {
        state.todoList = data
    },

    setTasksDueToday(state, data) {
        state.tasksDueToday = data
    },

    setTodoOrg(state, data) {
        state.todoOrg = data
    },

    setTodoFolder(state, data) {
        state.todoFolder = data
    },

    setTodoColl(state, data) {
        state.todoColl = data
    },

    setNotes(state, data) {
        state.notes = data
    },

    currentNote(state, data) {
        state.currentNote = data
    },

    flashcards(state, data) {
        state.flashcards = data
    },

    links(state, data) {
        state.links = data
    },

    studyPlans(state, data) {
        state.studyPlans = data
    },

    allPlans(state, data) {
        state.allPlans = data
    },

    adminUsers(state, data) {
        state.adminUsers = data
    },

    adminOrgs(state, data) {
        state.adminOrgs = data
    },

    adminColls(state, data) {
        state.adminColls = data
    },

    adminNotes(state, data) {
        state.adminNotes = data
    },

    adminUserData(state, data) {
        state.adminUserData = data
    },

    adminUserOrgs(state, data) {
        state.adminUserOrgs = data
    },

    adminUserColls(state, data) {
        state.adminUserColls = data
    },

    adminUserNotes(state, data) {
        state.adminUserNotes = data
    },

    orgUsers(state, data) {
        state.orgUsers = data
    },

    collNotes(state, data) {
        state.collNotes = data
    },

    collBeingShared(state, data) {
        state.collBeingShared = data
    },
    
    folderBeingShared(state, data) {
        state.folderBeingShared = data
    },

    noteBeingShared(state, data) {
        state.noteBeingShared = data
    },

    results(state, data) {
        state.results = data
    },

    sharedCollList(state, data) {
        state.sharedCollList = data
    },

    sharedFolderList(state, data) {
        state.sharedFolderList = data
    },

    sharedNoteList(state, data) {
        state.sharedNoteList = data
    },

    foldersSharedWithMe(state, data) {
        state.foldersSharedWithMe = data
    },

    notesSharedWithMe(state, data) {
        state.notesSharedWithMe = data
    },

    publicOrgs(state, data) {
        state.publicOrgs = data
    },

    foundOrg(state, data) {
        state.foundOrg = data
    },

    toggleSignupDialog(state, data) {
        state.showSignupDialog = data
    },

    toggleLoginDialog(state, data) {
        state.showLoginDialog = data
    },

    googleSuccess(state, data) {
        state.googleSuccess = data
    },

    toggleSignUpWithGoogle(state) {
        state.signUpWithGoogle = !state.signUpWithGoogle
    },

    toggleConsented(state) {
        state.consented = !state.consented
    },

    toggleVerifiedAge(state) {
        state.verifiedAge = !state.verifiedAge
    },

    setSignupInfo(state, data) {
        state.signupInfo = data
    },

    setEmailList(state, data) {
        state.emailList = data
    },

    showFiles(state, data) {
        state.showFiles = data
    },

    showFlashcards(state, data) {
        state.showFlashcards = data
    },

    setShowShareNote(state, data) {
        state.showShareNote = data
    },

    setShowShareColl(state, data) {
        state.showShareColl = data
    },

    setShowShareFolder(state, data) {
        state.showShareFolder = data
    },

    setShowStudyTools(state, data) {
        state.showStudyTools = data
    },

    setFiles(state, data) {
        state.noteFiles = data
    },

    setOpenedFile(state, data) {
        state.openedFile = data
    },

    setShowFileView(state, data) {
        state.showFileView = data
    },

    setShowQuickWord(state, data) {
        state.showQuickWord = data
    },

    setShowMyWhiteboards(state, data) {
        state.showMyWhiteboards = data
    },

    setPreparedWords(state, data) {
        state.preparedWords = data
    },

    setWhiteboards(state, data) {
        state.whiteboards = data
    },
}

// actions should call mutations
export const actions = {    
    async sendMagicLink({ dispatch, commit }, { email }) {
        const res = await dispatch('getUser', { email: email })
        if (res != null) {
            const { data, error } = await supabaseService.auth.admin.generateLink({
                type: 'magiclink',
                email: email
            })
            if (!error) {
                try {
                    const params = {
                        'name': res[0].firstname,
                        'email': email,
                        'link': data.properties.action_link
                    }
                    await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Type': 'magic-link'
                        },
                        body: JSON.stringify(params)
                    }).then(async function(response) {
                        if (response) {
                            await commit('setAlert', {
                                color: 'info',
                                icon: '$info',
                                text: `Follow the link sent to your email to recover your account. You can then reset your password in your account settings.`,
                            })
                        } else {
                            console.error('Failed to send email');
                        }
                    })
                } catch(err) {
                    console.error(err)
                    await commit('setAlert', {
                        color: 'error',
                        icon: '$error',
                        text: 'Something went wrong, please try again.'
                    })
                }
            }
        } else if (res == null) {
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'No account found with that email.'
            })
        }
    },

    async resetPass({ commit }, { email, password }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                password: await encryptPassword(password)
            })
            .eq('email', email)
        if (!error) {
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: 'Password reset successful.'
            })
            await commit('setResetCode', null)
            this.$router.push('/login')
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'No user found with that email.'
                })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async toggleAdmin({ dispatch, commit }, { userid, isadmin }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                isadmin: isadmin
            })
            .eq('userid', userid)
        if (!error) {
            dispatch('adminLoadUsers')
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'User is not found.'
                })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async adminLoadUsers({ commit }) {
        getUsers()
        getOrgs()
        getColls()
        getNotes()

        async function getUsers() {
            const { data, error, status } = await supabase.from('admin_see_all_users')
                .select()
            if (!error) {
                await commit('adminUsers', data)
            } else if (error) {
                console.error(error)
                await commit('adminUsers', [])
            }
        }
        
        async function getOrgs() {
            const { data, error, status } = await supabase.from('admin_see_all_orgs')
                .select()
            if (!error) {
                await commit('adminOrgs', data)
            } else if (error) {
                console.error(error)
                await commit('adminOrgs', [])
            }
        }

        async function getColls() {
            const { data, error, status } = await supabase.from('admin_see_all_colls')
                .select()
            if (!error) {
                await commit('adminColls', data)
            } else if (error) {
                console.error(error)
                await commit('adminColls', [])
            }
        }

        async function getNotes() {
            const { data, error, status } = await supabase.from('admin_see_all_notes')
                .select()
            if (!error) {
                await commit('adminNotes', data)
            } else if (error) {
                console.error(error)
                await commit('adminNotes', [])
            }
        }
    },

    async adminLoadOneUser({ commit }, { userid }) {
        getOneUser()
        getOneUserOrgs()
        getOneUserColls()
        getOneUserNotes()

        async function getOneUser() {
            const { data, error, status } = await supabase.from('see_personal_data')
                .select()
                .eq('userid', userid)
            if (!error) {
                await commit('adminUserData', data)
            } else if (error) {
                console.error(error)
                await commit('adminUserData', [])
            }
        }

        async function getOneUserOrgs() {
            const { data, error, status } = await supabase.from('admin_see_user_orgs')
                .select()
                .eq('userid', userid)
            if (!error) {
                await commit('adminUserOrgs', data)
            } else if (error) {
                console.error(error)
                await commit('adminUserOrgs', [])
            }
        }

        async function getOneUserColls() {
            const { data, error, status } = await supabase.from('admin_see_user_colls')
                .select()
                .eq('userid', userid)
            if (!error) {
                await commit('adminUserColls', data)
            } else if (error) {
                console.error(error)
                await commit('adminUserColls', [])
            }
        }

        async function getOneUserNotes() {
            const { data, error, status } = await supabase.from('admin_see_user_notes')
                .select()
                .eq('userid', userid)
            if (!error) {
                await commit('adminUserNotes', data)
            } else if (error) {
                console.error(error)
                await commit('adminUserNotes', [])
            }
        }
    },

    async deleteUser({ dispatch, commit }, { userid }) {
        const { data, error, status } = await supabase.from('user')
            .delete()
            .eq('userid', userid)
        if (!error) {
            await dispatch('adminLoadUsers')
            this.$router.push('/admin')
        } else if (error) {
            console.error(error)
            if (status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async deleteOrg({ dispatch, commit }, { orgid }) {
        const { data, error, status } = await supabase.from('organization')
            .delete()
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('adminLoadUsers')
            this.$router.push('/admin')
        } else if (error) {
            console.error(error)
            if (status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async removeFromOrg({ dispatch, commit }, { userid, orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .delete()
            .eq('userid', userid)
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('loadOrgUsers', { orgid })
            await dispatch('adminLoadOneUser', { userid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async loadOrgUsers({ commit }, { orgid }) {
        const { data, error, status } = await supabase.from('admin_see_org_users')
            .select()
            .eq('orgid', orgid)
        if (!error) {
            await commit('orgUsers', data)
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('orgUsers', [])
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async loadCollNotes({ commit }, { collectionid }) {
        const { data, error, status } = await supabase.from('admin_see_coll_notes')
            .select()
            .eq('collectionid', collectionid)
        if (!error) {
            await commit('collNotes', data)
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('collNotes', [])
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async userData({ commit, state }, { email }) {
        const { data, error, status } = await supabase.from('see_personal_data')
            .select()
            .eq('email', email)
        if (!error) {
            await commit('setUserData', data[0])
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async basicOnboardingComplete({ dispatch, state, commit }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                onboarded: true
            })
            .eq('userid', state.userData.userid)
        if (!error) {
            await dispatch('userData', { email: state.userData.email })
            this.$router.push({ name: 'join', params: { new: true }})
        } else if (error) {
            console.error(error)
            if (status === 404 || status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async noteOnboardingComplete({ dispatch, state, commit }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                noteonboarded: true
            })
            .eq('userid', state.userData.userid)
        if (!error) {
            await dispatch('userData', { email: state.userData.email })
        } else if (error) {
            console.error(error)
            if (status === 404 || status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async loadPublicOrgs({ commit }) {
        await commit('foundOrg', null)
        const { data, error, status } = await supabase.from('see_public_orgs')
            .select()
        if (!error) {
            await commit('publicOrgs', data)
        } else if (error) {
            console.error(error)
            await commit('publicOrgs', [])
        }
    },

    async searchOrg({ commit }, { searchText }) {
        const { data, error, status } = await supabase.from('search_org_by_code')
            .select()
            .eq('joincode', searchText)
        if (!error) {
            if (data.length == 0) await commit('foundOrg', null)
            else await commit('foundOrg', data[0])
        } else if (error) {
            console.error(error)
            await commit('foundOrg', null)
        }
    },

    async joinOrg({ dispatch, state, commit }, { orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .insert({
                userid: state.userData.userid,
                orgid: orgid
            })
        if (!error) {
            await dispatch('orgs')
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: 'You have been successfully added to the organization.'
            })
        } else if (error) {
            console.error(error)
            if (status === 409) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'You are already a member of this organization.'
                })
            } else if (status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async toggleOrg({ dispatch, commit }, { orgid, isPrivate }) {
        const { data, error, status } = await supabase.from('organization')
            .update({
                isprivate: isPrivate
            })
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('adminLoadUsers')
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Organization not found.'
                })
            } else if (status === 400) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async createOrg({ dispatch, commit }, { orgname, isPrivate }) {
        const { data, error, status } = await supabase.from('organization')
            .insert({
                orgname: orgname,
                isprivate: isPrivate,
                joincode: short.generate()
            })
            .select()
        if (!error) {
            await dispatch('joinOrg', { orgid: data[0].orgid })
        } else if (error) {
            console.error(error)
            if (status === 409) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'An organization with this name already exists.'
                })
            } else await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getOrgFolders({ commit, state }, { orgid }) {
        const { data, status, error } = await supabase.from('folder')
            .select()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
            .is('parent', null)
        if (!error) {
            await commit('setOrgContentFolders', data)
        } else if (error) {
            console.error(error)
            await commit('setOrgContentFolders', [])
        }
    },

    async getOrgNotes({ commit, state }, { parent }) {
        const { data, status, error } = await supabase.from('see_content_notes')
            .select()
            .eq('userid', state.userData.userid)
            .is('parent', parent)
        if (!error) {
            await commit('setOrgContentNotes', data)
        } else if (error) {
            console.error(error)
            await commit('setOrgContentNotes', [])
        }
    },

    async getOrgCollections({ commit, state }, { orgid }) {
        const { data, status, error } = await supabase.from('collection')
            .select()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setOrgContentCollections', data)
        } else if (error) {
            await commit('setOrgContentCollections', [])
        }
    },

    async getOrgContent({ dispatch }, { orgid }) {
        await dispatch('getOrgFolders', { orgid: orgid })
        await dispatch('getOrgNotes', { parent: null })
        await dispatch('getOrgCollections', { orgid: orgid })
    },

    async getFolderFolders({ commit, state }, { parent }) {
        const { data, status, error } = await supabase.from('folder')
            .select()
            .eq('parent', parent)
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setFolderContentFolders', data)
        } else if (error) {
            console.error(error)
            await commit('setFolderContentFolders', [])
        }
    },

    async getFolderNotes({ commit, state }, { parent }) {
        const { data, status, error } = await supabase.from('see_content_notes')
            .select()
            .eq('userid', state.userData.userid)
            .eq('parent', parent)
        if (!error) {
            await commit('setFolderContentNotes', data)
        } else if (error) {
            console.error(error)
            await commit('setFolderContentNotes', [])
        }
    },

    async getFolderCollections({ commit, state }, { parent }) {
        const { data, status, error } = await supabase.from('collection')
            .select()
            .eq('parent', parent)
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setFolderContentCollections', data)
        } else if (error) {
            await commit('setFolderContentCollections', [])
        }
    },

    async getFolderContent({ dispatch }, { parent }) {
        await dispatch('getFolderFolders', { parent: parent })
        await dispatch('getFolderNotes', { parent: parent })
        await dispatch('getFolderCollections', { parent: parent })
    },

    async moveItem({ dispatch, commit }, { itemId, type, parent }) {
        const { data, error, status } = await supabase.from(type)
            .update({
                parent: parent
            })
            .eq(`${type}id`, itemId)
        if (!error) {
            await dispatch('getFolderContent', { parent: parent })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getFolders({ commit, state }, { orgid }) {
        const { data, error, status } = await supabase.from('see_folders')
            .select()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setFolders', data)
        } else if (error) {
            console.error(error)
            await commit('setFolders', [])
        }
    },

    async createFolder({ commit, dispatch, state }, { foldername, orgid, parent }) {
        const { data, error, status } = await supabase.from('folder')
            .insert({
                foldername: foldername,
                parent: parent,
                orgid: orgid,
                userid: state.userData.userid
            })
        if (!error) {
            parent ? await dispatch('getFolderFolders', { parent: parent })
            : await dispatch('getOrgFolders', { orgid: orgid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateFolder({ dispatch, commit }, { foldername, folderid, parent, orgid }) {
        const { data, error, status } = await supabase.from('folder')
            .update({
                foldername: foldername
            })
            .eq('folderid', folderid)
        if (!error) {
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: 'Your folder has successfully been updated.'
            })
            parent ? await dispatch('getFolderFolders', { parent: parent })
            : await dispatch('getOrgFolders', { orgid: orgid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteFolder({ dispatch, state }, { folder }) {
        const { data, error, status } = await supabase.from('folder')
            .delete()
            .eq('folderid', folder.folderid)
        if (!error) {
            if (folder.type) {
                if (folder.parent == null) {
                    await dispatch('getOrgFolders', { orgid: folder.orgid })
                } else if (typeof folder.parent == 'number') {
                    await dispatch('getFolderFolders', { parent: folder.parent })
                }
            } else {
                await dispatch('getFolders', { orgid: folder.orgid })
            }
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async moveCollToFolder({ dispatch, commit }, { collectionid, folderid, currentFolderid, orgid, level }) {
        const { data, error, status } = await supabase.from('collection')
            .update({
                folderid: folderid
            })
            .eq('collectionid', collectionid)
        if (!error) {
            level == 5 ? await dispatch('folderColls', { folderid: currentFolderid })
            : await dispatch('collections', { orgid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateCollName({ dispatch, commit }, { collectionid, newName, orgid, folderid }) {
        const { data, error, status } = await supabase.from('collection')
            .update({
                collectionname: newName
            })
            .eq('collectionid', collectionid)
        if (!error) {
            folderid ? await dispatch('folderColls', { folderid: folderid })
            : await dispatch('collections', { orgid })
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Collection not found.'
                })
            } else await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async loadSharedFolders({ commit, state }) {
        const { data, error, status } = await supabase.from('see_folders_shared_with_me')
            .select()
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('foldersSharedWithMe', data)
        } else if (error) {
            console.error(error)
            await commit('foldersSharedWithMe', [])
        }
    },

    async loadSharedNotes({ commit, state }) {
        const { data, error, status } = await supabase.from('see_notes_shared_with_me')
            .select()
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('notesSharedWithMe', data)
        } else if (error) {
            console.error(error)
            await commit('notesSharedWithMe', [])
        }
    },

    async loadSharedWithMe({ dispatch }) {
        await dispatch('loadSharedFolders')
        await dispatch('loadSharedNotes')
    },

    async search({ commit }, { searchText, orgid }) {
        searchText = searchText.toLowerCase()
        const { data, error, status } = await supabase.from('search_users')
            .select()
            .eq('orgid', orgid)
            .like('email', `%${searchText}%`)
        if (!error) {
            await commit('results', data)
        } else if (error) {
            console.error(error)
            await commit('results', [])
        }
    },

    async getSharedCollList({ commit }, { collection }) {
        await commit('collBeingShared', collection)
        const { data, error, status } = await supabase.from('see_shared_colls')
            .select()
            .eq('collectionid', collection.collectionid)
        if (!error) {
            await commit('sharedCollList', data)
        } else if (error) {
            console.error(error)
            await commit('sharedCollList', [])
        }
    },
    
    async getFolderSharedList({ commit }, { folder }) {
        await commit('folderBeingShared', folder)
        const { data, error, status } = await supabase.from('see_shared_folders')
            .select()
            .eq('folderid', folder.folderid)
        if (!error) {
            await commit('sharedFolderList', data)
        } else if (error) {
            console.error(error)
            await commit('sharedFolderList', [])
        }
    },

    async getSharedNoteList({ commit }, { note }) {
        await commit('noteBeingShared', note)
        const { data, error, status } = await supabase.from('see_shared_notes')
            .select()
            .eq('noteid', note.noteid)
        if (!error) {
            await commit('sharedNoteList', data)
        } else if (error) {
            console.error(error)
            await commit('sharedNoteList', [])
        }
    },

    async shareColl({ dispatch, state, commit }, { collection, users }) {
        let success = true
        for (let i = 0; i < users.length; ++i) {
            const { data, error, status } = await supabase.from('shared_collection')
                .insert({
                    collectionid: collection.collectionid,
                    ownerid: state.userData.userid,
                    userid: users[i]
                })
            if (!error) continue
            else if (error) {
                console.error(error)
                success = false
            }
        }
        await dispatch('getSharedCollList', { collection })
        if (success) {
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: 'Your collection has successfully been shared'
            })
        } else if (!success) {
            await commit('setAlert', {
                color: 'warning',
                icon: '$warning',
                text: 'Sharing has completed, but an error has occurred.'
            })
        }
    },

    async shareFolder({ commit, dispatch, state }, { folder, users }) {
        let success = true
        for (let i = 0; i < users.length; ++i) {
            const { data, error, status } = await supabase.from('shared_folder')
                .insert({
                    folderid: folder.folderid,
                    ownerid: state.userData.userid,
                    userid: users[i]
                })
            if (!error) continue
            else if (error) {
                console.error(error)
                success = false
            }
        }
        await dispatch('getFolderSharedList', { folder: folder })
        if (success) {
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: 'Your folder has successfully been shared'
            })
        } else if (!success) {
            await commit('setAlert', {
                color: 'warning',
                icon: '$warning',
                text: 'Sharing has completed, but an error has occurred.'
            })
        }
    },

    async shareNote({ dispatch, state, commit }, { note, users }) {
        let success = true
        for (let i = 0; i < users.length; ++i) {
            const { data, error, status } = await supabase.from('shared_note')
                .insert({
                    noteid: note.noteid,
                    ownerid: state.userData.userid,
                    userid: users[i]
                })
            if (!error) continue
            else if (error) {
                console.error(error)
                success = false
            }
        }
        await dispatch('getSharedNoteList', { note })
        if (success) {
            await commit('setAlert', {
                color: 'success',
                icon: 'success',
                text: 'Your note has successfully been shared'
            })
        } else if (!success) {
            await commit('setAlert', {
                color: 'warning',
                icon: '$warning',
                text: 'Sharing has completed, but an error has occurred.'
            })
        }
    },

    async unshareColl({ dispatch, commit }, { collection, userid, type }) {
        const { data, error, status } = await supabase.from('shared_collection')
            .delete()
            .eq('collectionid', collection.collectionid)
            .eq('userid', userid)
        if (!error) {
            (type === "owner")
                ? await dispatch('getSharedCollList', { collection })
                : await dispatch('loadSharedWithMe')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async unshareFolder({ dispatch, commit }, { folder, userid, type }) {
        const { data, error, status } = await supabase.from('shared_folder')
            .delete()
            .eq('folderid', folder.folderid)
            .eq('userid', userid)
        if (!error) {
            (type === "owner")
                ? await dispatch('getFolderSharedList', { folder: folder })
                : await dispatch('loadSharedWithMe')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async unshareNote({ dispatch, commit }, { note, userid, type }) {
        const { data, error, status } = await supabase.from('shared_note')
            .delete()
            .eq('noteid', note.noteid)
            .eq('userid', userid)
        if (!error) {
            (type === "owner")
                ? await dispatch('getSharedNoteList', { note })
                : await dispatch('loadSharedWithMe')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again'
            })
        }
    },

    async createCollection({ dispatch, state, commit }, { collectionname, orgid, folderid }) {
        const { data, error, status } = await supabase.from('collection')
            .insert({
                collectionname: collectionname,
                orgid: orgid,
                userid: state.userData.userid,
                folderid: folderid
            })
        if (!error) {
            folderid ? await dispatch('folderColls', { folderid: folderid })
            : await dispatch('collections', { orgid })
            await dispatch('allColls')
        } else if (error) {
            console.error(error)
            if (status === 404) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Organization or user not found, unable to create collection.'
                })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async createNote({ dispatch, commit, state }, { notename, parent, fromNote = false }) {
        const { data, error, status } = await supabase.from('note')
            .insert({
                notename: notename,
                parent: parent,
                collectionid: null,
                userid: state.userData.userid
            })
            .select()
        if (!error) {
            parent ? await dispatch('getFolderNotes', { parent: parent })
            : await dispatch('getOrgNotes', { parent: null })
            fromNote ? await dispatch('openNote', { noteid: data[0].noteid }) : null
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async orgs({ commit, state }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_orgs')
            .select()
            .eq('email', state.userData.email)
        if (!error) {
            await commit('setOrgs', data)
        } else if (error) {
            console.error(error)
            await commit('setOrgs', [])
        }
    },

    async updateCollColor({ dispatch }, { collectionid, color, orgid, folderid }) {
        const { data, error, status } = await supabase.from('collection')
            .update({
                color: color
            })
            .eq('collectionid', collectionid)
        if (!error) {
            folderid ? await dispatch('folderColls', { folderid: folderid })
            : await dispatch('collections', { orgid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async allColls({ commit, state }) {
        const { data, error, status } = await supabase.from('see_collections')
            .select()
            .eq('email', state.userData.email)
        if (!error) {
            await commit('allColls', data)
        } else if (error) {
            console.error(error)
            await commit('allColls', [])
        }
    },

    async folderColls({ commit, state }, { folderid }) {
        await commit('setFolderColls', [])
        const { data, error, status } = await supabase.from('see_folder_colls')
            .select()
            .eq('folderid', folderid)
        if (!error) {
            await commit('setFolderColls', data)
        } else if (error) {
            console.error(error)
        }
    },

    async collections({ commit, state }, { orgid }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_collections')
            .select()
            .eq('email', state.userData.email)
            .eq('orgid', orgid)
            .is('folderid', null)
        if (!error) {
            await commit('setCollections', data)
        } else if (error) {
            console.error(error)
            await commit('setCollections', [])
        }
    },

    async getQuizzes({ commit, state }) {

    },

    async getQuestions({ commit }, { noteid = null }) {
        const { data, error, status } = await supabase.from('see_note_quiz_questions')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            data.forEach(question => {
                question.answers = JSON.parse(question.answers)
                question.answers.forEach(answer => {
                    answer.answer = answer.answer.toString()
                });
            });
            await commit('setQuestions', data)
        } else if (error) {
            console.error(error)
            await commit('setQuestions', [])
        }
    },

    async addQuestion({}, { quizid = null, noteid = null, questiontext, answers }) {
        const { data, error, status } = await supabase.from('question')
            .insert({
                quizid: quizid,
                noteid: noteid,
                questiontext: questiontext,
                answers: JSON.stringify(answers)
            })
        if (!error) {
            // succeeded
        } else if (error) {
            console.error(error)
        }
    },

    async deleteQuestion({ dispatch, commit }, { questionid, noteid }) {
        const { data, error, status } = await supabase.from('question')
            .delete()
            .eq('questionid', questionid)
        if (!error) {
            await dispatch('getQuestions', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getAllFlashcardDecks({ commit, state }) {
        const { data, error, status } = await supabase.from('see_all_flashcard_decks')
            .select()
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setAllFlashcardDecks', data)
        } else if (error) {
            console.error(error)
            await commit('setAllFlashcardDecks', [])
        }
    },
    
    async getAllPublicDecks({ commit }) {
        // const { data, error, status } = await supabase.from('decks')
        const { data, error, status } = await supabase.from('see_all_public_decks')
            .select()
            .eq('ispublic', true)
        if (!error) {
            await commit('setAllPublicDecks', data)
        } else if (error) {
            console.error(error)
            await commit('setAllPublicDecks', [])
        }
    },

    async createDeck({ dispatch, commit, state }, { deckname, orgid }) {
        const { data, error, status } = await supabase.from('decks')
            .insert({
                deckname: deckname,
                orgid: orgid,
                userid: state.userData.userid
            })
        if (!error) {
            await dispatch('getAllFlashcardDecks')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateDeckname({ dispatch }, { deckid, newname }) {
        const { data, error, status } = await supabase.from('decks')
            .update({
                deckname: newname
            })
            .eq('deckid', deckid)
        if (!error) {
            await dispatch('getAllFlashcardDecks')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteDeck({ dispatch }, { deck }) {
        const { data, error, status } = await supabase.from('decks')
            .delete()
            .eq('deckid', deck.deckid)
        if (!error) {
            await dispatch('getAllFlashcardDecks')
            deck.ispublic ? await dispatch('getAllPublicDecks') : null
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async toggleDeckPublic({ commit, dispatch }, { deckid, ispublic }) {
        const { data, error, status } = await supabase.from('decks')
            .update({
                ispublic: ispublic
            })
            .eq('deckid', deckid)
        if (!error) {
            await dispatch('getAllFlashcardDecks')
            await dispatch('getAllPublicDecks')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async openFlashcardDeck({ commit }, { deckid }) {
        const { data, error, status } = await supabase.from('see_flashcard_deck')
            .select()
            .eq('deckid', deckid)
        if (!error) {
            await commit('setFlashcardDeck', data)
        } else if (error) {
            console.error(error)
            await commit('setFlashcardDeck', [])
        }
    },

    async getTaskFolders({ commit, dispatch, state }, { orgid }) {
        const { data, error, status } = await supabase.from('see_task_folders')
            .select()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('setTaskFolders', data)
            await dispatch('getTaskColls', { orgid: orgid })
        } else if (error) {
            console.error(error)
            await commit('setTaskFolders', [])
            await dispatch('getTaskColls', { orgid: orgid })
        }
    },
    
    async getTaskColls({ commit, state }, { orgid }) {
        const { data, error, status } = await supabase.from('see_task_colls')
            .select()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
            .is('folderid', null)
        if (!error) {
            await commit('setTaskColls', data)
        } else if (error) {
            console.error(error)
            await commit('setTaskColls', [])
        }
    },
    
    async getTaskFolderColls({ commit, state }, { folderid }) {
        const { data, error, status } = await supabase.from('see_task_folder_colls')
            .select()
            .eq('folderid', folderid)
        if (!error) {
            await commit('setTaskFolderColls', data)
        } else if (error) {
            console.error(error)
            await commit('setTaskFolderColls', [])
        }
    },

    async loadTodoList({ commit, state }) {
        const { data, error, status } = await supabase.from('see_todo_list')
            .select()
            .eq('userid', state.userData.userid)
        if (!error) {
            data.forEach(element => {
                element.title = element.todotext
                element.date = element.deadline
            });
            await commit('setTodoList', data)
        } else if (error) {
            console.error(error)
            await commit('setTodoList', [])
        }
    },

    async getTasksDueToday({ commit, state }) {
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        if (month < 10) month = `0${month}`
        let date = new Date().getDate()
        if (date < 10) date = `0${date}`
        const fullDate = `${year}-${month}-${date}`

        const { data, error, status } = await supabase.from('see_todo_due_today')
            .select()
            .eq('userid', state.userData.userid)
            .eq('deadline', fullDate)
        if (!error) {
            await commit('setTasksDueToday', data)
        } else if (error) {
            console.error(error)
        }
    },

    async createTodo({ dispatch, commit, state }, { text, topic, deadline }) {
        const { data, error, status } = await supabase.from('todo')
            .insert({
                todotext: text,
                topic: topic,
                deadline: deadline,
                userid: state.userData.userid
            })
        if (!error) {
            await dispatch('loadTodoList')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateTodo({ dispatch, state }, { text, topic, completed, todoid, deadline, seeTasksDueToday }) {
        let body = {}
        if (text) {
            body = {
                todotext: text
            }
        } else if (completed != null) {
            body = {
                completed: completed
            }
        } else if (deadline) {
            body = {
                deadline: deadline
            }
        }
        const { data, error, status } = await supabase.from('todo')
            .update(body)
            .eq('todoid', todoid)
            .select()
        if (!error) {
            seeTasksDueToday ? await dispatch('getTasksDueToday')
            : await dispatch('loadTodoList')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteTodo({ dispatch, commit }, { todoid, seeTasksDueToday }) {
        const { data, error, status } = await supabase.from('todo')
            .delete()
            .eq('todoid', todoid)
        if (!error) {
            seeTasksDueToday ? await dispatch('getTasksDueToday')
            : await dispatch('loadTodoList')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async notes({ commit }, { collectionid }) {
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_notes')
            .select()
            .eq('collectionid', collectionid)
        if (!error) {
            await commit('setNotes', data)
            localStorage.setItem('collNotes', JSON.stringify(data))
        } else if (error) {
            console.error(error)
            await commit('setNotes', [])
        }
    },

    async openNote({ dispatch, commit, state }, { noteid }) {
        localStorage.removeItem('prettyDate')
        await commit('currentNote', {})
        const { data, error, status } = await supabase.from('see_note_with_data')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            let prettyDate = await parseDate(data[0].notedate)
            localStorage.removeItem('current_whiteboard')
            localStorage.setItem('prettyDate', prettyDate)
            await commit('currentNote', data[0])
            localStorage.setItem('note', JSON.stringify(state.currentNote))
            await dispatch('getPreparedWords', { noteid: noteid })
            await dispatch('getFlashcards', { noteid: noteid })
            await dispatch('getLinks', { noteid: noteid })
            await dispatch('getFiles', { noteid: noteid })
            await dispatch('getStudyPlans', { noteid: noteid })
            await dispatch('getWhiteboards', { noteid: noteid })
            this.$router.push('/note')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateAiCalls({ commit, state }, { date, num }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                numaicalls: num,
                lastaicall: date
            })
            .eq('userid', state.userData.userid)
            .select()
        if (!error) {
            await commit('setUserData', data[0])
        } else if (error) {
            console.error(error)
        }
    },

    async saveNotes({ commit }, { noteText, noteid }) {
        const { data, error, status } = await supabase.from('note')
            .update({
                typednotes: noteText
            })
            .eq('noteid', noteid)
        if (!error) {
            let temp = JSON.parse(localStorage.getItem('note'))
            temp.typednotes = noteText
            await commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
            await commit('saving', 'Saved')
        } else if (error) {
            console.error(error)
            await commit('saving', 'Unsaved')
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Notes failed to save, check your connection and try again.'
            })
        }
    },

    async updateNoteName({ commit, dispatch }, { newNoteName, noteid, parent }) {
        const { data, error, status } = await supabase.from('note')
            .update({
                notename: newNoteName
            })
            .eq('noteid', noteid)
        if (!error) {
            // let temp = { ...data[0], 
            //     "collectionname": state.currentNote.collectionname,
            //     "orgid": state.currentNote.orgid,
            //     "userid": state.userData.userid }
            // await commit('currentNote', temp)
            // localStorage.setItem('note', JSON.stringify(temp))
            parent ? await dispatch('getFolderNotes', { parent: parent })
            : await dispatch('getOrgNotes', { parent: null })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getLinks({ commit, state }, { noteid }) {
        const { data, error, status } = await supabase.from('see_links')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('links', data)
            localStorage.setItem('links', JSON.stringify(state.links))
        } else if (error) {
            console.error(error)
            await commit('links', [])
        }
    },

    async addLink({ dispatch, commit }, { url, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .insert({
                url: url,
                noteid: noteid
            })
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateLink({ dispatch, commit }, { linkid, editLink, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .update({
                url: editLink
            })
            .eq('linkid', linkid)
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteLink({ dispatch, commit }, { linkid, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .delete()
            .eq('linkid', linkid)
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getPreparedWords({ commit }, { noteid }) {
        const { data, error, status } = await supabase.from('see_prepared_words')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('setPreparedWords', data)
        } else if (error) {
            console.error(error)
            await commit('setPreparedWords', [])
        }
    },

    async addPreparedWord({ dispatch, commit }, { word, noteid }) {
        const { data, error, status } = await supabase.from('prepared_words')
            .insert({
                word: word,
                noteid: noteid
            })
        if (!error) {
            await dispatch('getPreparedWords', { noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async removePreparedWord({ dispatch, commit }, { wordid, noteid }) {
        const { data, error, status } = await supabase.from('prepared_words')
            .delete()
            .eq('wordid', wordid)
        if (!error) {
            await dispatch('getPreparedWords', { noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async clearPreparedWords({ commit }, { noteid }) {
        const { data, error, status } = await supabase.from('prepared_words')
            .delete()
            .eq('noteid', noteid)
        if (!error) {
            await commit('setPreparedWords', [])
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async fetchBoards({ commit }, { boards }) {
        boards.forEach(async board => {
          await fetch(`${process.env.NUXT_ENV_WHITEBOARD_ENDPOINT}/${board.uid}`, {
            method: 'GET',
            headers: {
                'Api-Key': process.env.NUXT_ENV_WHITEBOARD_CLIENT_SECRET
            }
          }).then(async function(response) {
            const data = await response.json()
            board.name = data.name
          })
        });
        await commit('setWhiteboards', boards)
    },

    async getWhiteboards({ commit, dispatch }, { noteid }) {
        const { data, error, status } = await supabase.from('whiteboards')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('setWhiteboards', data)
            await dispatch('fetchBoards', { boards: data })
        } else if (error) {
            console.error(error)
            await commit('setWhiteboards', [])
        }
    },

    async addWhiteboard({ dispatch, commit }, { noteid }) {
        const uid = randomstring.generate(18)
        const { data, error, status } = await supabase.from('whiteboards')
            .insert({
                uid: uid,
                noteid: noteid
            }).select()
        if (!error) {
            localStorage.setItem('current_whiteboard', JSON.stringify(data[0]))
            await dispatch('getWhiteboards', { noteid: noteid })
            return data[0].uid
        } else if (error) {
            console.error(error)
            if (status == 409) {
                await dispatch('addWhiteboard', { noteid: noteid })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async deleteWhiteboard({ dispatch, commit }, { boardid, noteid }) {
        const { data, error, status } = await supabase.from('whiteboards')
            .delete()
            .eq('boardid', boardid)
        if (!error) {
            await dispatch('getWhiteboards', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getUserNotes({ commit, state }, { orgid, deckid }) {
        const { data, error, status } = await supabase.rpc('get_notes_for_deck', {
            user_id: state.userData.userid,
            org_id: orgid,
            deck_id: deckid
        })
        if (!error) {
            await commit('setUserNotes', data)
        } else if (error) {
            console.error(error)
            await commit('setUserNotes', [])
        }
    },

    async toggleNoteAdded({ dispatch, commit }, { noteid, deckid, isInDeck, orgid }) {
        if (isInDeck) {
            const { data, status, error} = await supabase.from('note_in_deck')
                .delete()
                .eq('noteid', noteid)
                .eq('deckid', deckid)
            if (!error) {
                await dispatch('getUserNotes', { orgid: orgid, deckid: deckid })
                await dispatch('openFlashcardDeck', { deckid: deckid })
            } else if (error) {
                console.error(error)
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        } else {
            const { data, status, error} = await supabase.from('note_in_deck')
                .insert({
                    noteid: noteid,
                    deckid: deckid
                })
            if (!error) {
                await dispatch('getUserNotes', { orgid: orgid, deckid: deckid })
                await dispatch('openFlashcardDeck', { deckid: deckid })
            } else if (error) {
                console.error(error)
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async getFlashcards({ commit, state }, { noteid }) {
        const { data, error, status } = await supabase.from('see_flashcards')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('flashcards', data)
            localStorage.setItem('flashcards', JSON.stringify(state.flashcards))
        } else if (error) {
            console.error(error)
            await commit('flashcards', [])
        }
    },

    async addFlashcard({ dispatch, commit }, { newPrompt, newAnswer, noteid, deckid, isNote }) {
        const { data, error, status } = await supabase.from('flashcards')
            .insert({
                cardprompt: newPrompt,
                cardanswer: newAnswer,
                noteid: noteid,
                deckid: deckid
            })
        if (!error) {
            isNote ? await dispatch('getFlashcards', { noteid: noteid })
                : await dispatch('openFlashcardDeck', { deckid: deckid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateFlashcard({ dispatch, commit }, { cardid, editPrompt, editAnswer, noteid }) {
        const { data, error, status } = await supabase.from('flashcards')
            .update({
                cardprompt: editPrompt,
                cardanswer: editAnswer
            })
            .eq('cardid', cardid)
        if (!error) {
            await dispatch('getFlashcards', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteFlashcard({ dispatch, commit }, { cardid, noteid }) {
        const { data, error, status } = await supabase.from('flashcards')
            .delete()
            .eq('cardid', cardid)
        if (!error) {
            await dispatch('getFlashcards', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async addPlan({ dispatch, commit }, { date, time, amount, priority, noteid}) {
        const { data, error, status } = await supabase.from('study_plan')
            .insert({
                studydate: date + 'T00:00:00.000Z',
                timeamount: amount,
                prioritylevel: priority,
                noteid: noteid,
                time: time
            })
        if (!error) {
            await dispatch('getStudyPlans', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updatePlan({ dispatch, commit }, { planid, completed, noteid }) {
        const { data, error, status } = await supabase.from('study_plan')
            .update({
                studycompleted: completed
            })
            .eq('planid', planid)
        if (!error) {
            await dispatch('getStudyPlans', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getAllPlans({ commit, state }) {
        const { data, error, status } = await supabase.from('see_all_plans')
            .select()
            .eq('userid', state.userData.userid)
            .eq('studycompleted', false)
        if (!error) {
            for (let i = 0; i < data.length; ++i) {
                let timeOfDay = " AM"
                let time = data[i].time
                time = time.split(':')
                if (parseInt(time[0]) > 12) {
                    time[0] = parseInt(time[0]) - 12
                    timeOfDay = " PM"
                }
                if (timeOfDay === " AM" && parseInt(time[0]) < 10) time[0] = parseInt(time[0])
                data[i].time = time[0].toString() + ":" + time[1] + timeOfDay
                let date = data[i].studydate
                data[i].studydate = new Date(date).toDateString()
            }
            await commit('allPlans', data)
        } else if (error) {
            console.error(error)
            await commit('allPlans', [])
        }
    },

    async getStudyPlans({ commit }, { noteid }) {
        const { data, error, status } = await supabase.from('see_study_plans')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            for (let i = 0; i < data.length; ++i) {
                let timeOfDay = " AM"
                let time = data[i].time
                time = time.split(':')
                if (parseInt(time[0]) == 12) timeOfDay = " PM"
                if (parseInt(time[0]) > 12) {
                    time[0] = parseInt(time[0]) - 12
                    timeOfDay = " PM"
                }
                if (timeOfDay === " AM" && parseInt(time[0]) < 10) time[0] = parseInt(time[0])
                data[i].time = time[0].toString() + ":" + time[1] + timeOfDay
                let date = data[i].studydate
                data[i].studydate = new Date(date).toDateString()
            }
            localStorage.setItem('studyPlans', JSON.stringify(data))
            await commit('studyPlans', data)
        } else if (error) {
            console.error(error)
            await commit('studyPlans', [])
            localStorage.setItem('studyPlans', JSON.stringify([]))
        }
    },

    async deletePlan({ dispatch, commit }, { planid, noteid }) {
        const { data, error, status } = await supabase.from('study_plan')
            .delete()
            .eq('planid', planid)
        if (!error) {
            if (noteid === null) await dispatch('getAllPlans')
            else await dispatch('getStudyPlans', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getEmailList({ commit }, { group }) {
        if (group == 'All Users') {
            const { data, error, status } = await supabase.from('user')
                .select('email')
            if (!error) {
                await commit('setEmailList', data)
            } else {
                console.error(error)
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        } else if (group == 'Paid Users') {
            const { data, error, status } = await supabase.from('user')
                .select('email')
                .eq('subscriptionstatus', 'active')
            if (!error) {
                await commit('setEmailList', data)
            } else {
                console.error(error)
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        } else if (group == 'Free Users') {
            const { data, error, status } = await supabase.from('user')
                .select('email')
                .eq('subscriptionstatus', 'inactive')
            if (!error) {
                await commit('setEmailList', data)
            } else {
                console.error(error)
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async updatePass({ commit }, { newPass }) {
        const { data: { user }, error } = await supabase.auth.updateUser({
            password: newPass
        })
        if (!error) {
            await commit('setSupabaseUser', user)
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: "Your password has been updated"
            })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async updateNotifSettings({ commit, state }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                notifsettings: !state.userData.notifsettings
            })
            .eq('userid', state.userData.userid)
            .select()
        if (!error) {
            await commit('setUserData', data[0])
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async exportData({ commit, state }) {
        const { data, error, status } = await supabase.from('export_data')
            .select('*')
            .eq('userid', state.userData.userid)
        if (!error) {
            // also get files
            const organizedData = {};
            const addedWhiteboards = new Set();
            const addedFlashcards = new Set();

            data.forEach(row => {
                const { orgid, orgname, collectionid, collectionname, noteid, notename, typednotes, boardid, data, cardid, cardprompt, cardanswer } = row;

                // Ensure organization exists in the organized data
                if (!organizedData[orgid]) {
                    organizedData[orgid] = { orgname, collections: {} };
                }

                // Ensure collection exists within the organization
                if (!organizedData[orgid].collections[collectionid]) {
                    organizedData[orgid].collections[collectionid] = { collectionname, notes: {} };
                }

                // Ensure note exists within the collection
                if (!organizedData[orgid].collections[collectionid].notes[noteid]) {
                    organizedData[orgid].collections[collectionid].notes[noteid] = { 
                        notename, 
                        typednotes: typednotes || '', // Use an empty string if typednotes is null
                        whiteboards: [], 
                        flashcards: [] 
                    };
                }

                // Add whiteboards to the note only if boardid and data are present and not added yet
                if (boardid !== null && data !== null && !addedWhiteboards.has(boardid)) {
                    organizedData[orgid].collections[collectionid].notes[noteid].whiteboards.push({ boardid, data });
                    addedWhiteboards.add(boardid);
                }

                // Add flashcards to the note only if cardid, cardprompt, and cardanswer are present and not added yet
                if (cardid !== null && cardprompt !== null && cardanswer !== null && !addedFlashcards.has(cardid)) {
                    organizedData[orgid].collections[collectionid].notes[noteid].flashcards.push({ cardid, cardprompt, cardanswer });
                    addedFlashcards.add(cardid);
                }
            });
            await commit('setExportData', organizedData)
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async getFiles({ dispatch, commit, state }, { noteid }) {
        const { data, error, status } = await supabaseService.storage.from(state.userData.userid)
            .list(`${noteid}/`)
        if (!error) {
            for (let i = 0; i < data.length; ++i) {
                data[i] = await dispatch('getFileURL', { file: data[i], noteid: noteid })
            }
            await commit('setFiles', data)
        } else if (error) {
            console.error(error)
        }
    },

    async getFileURL({ state }, { file, noteid }) {
        const { data, error } = supabaseService.storage.from(state.userData.userid)
            .getPublicUrl(`${noteid}/${file.name}`);
        if (!error) {
            file.url = data.publicUrl
            return file
        } else if (error) {
            console.error(error)
        }
    },

    async uploadFiles({ dispatch, commit }, { files, noteid, userid }) {
        let fail = false
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const { data, error, status } = await supabaseService.storage
                .from(userid)
                .upload(`${noteid}/${file.name}`, file)
            if (error) fail = true
        }
        if (fail) await commit('setAlert', {
            color: 'error',
            icon: '$error',
            text: 'One or more files failed to upload.'
        })
        await dispatch('getFiles', { noteid: noteid })
    },

    async deleteAllFiles({ state }, { noteid }) {
        const { data, error } = await supabaseService.storage.from(state.userData.userid).remove([`${noteid}/`])
    },

    async deleteBucket({ state }) {
        async function emptyIt() {
            const { data, error } = await supabase
                .storage
                .emptyBucket(state.userData.userid)
        }
        async function deleteIt() {
            const { data, error } = await supabase
                .storage
                .deleteBucket(state.userData.userid)
        }
        await emptyIt()
        await deleteIt()
    },

    async removeFile({ dispatch, commit }, { noteid, filename, userid }) {
        const { data, error } = await supabaseService.storage.from(userid)
            .remove([`${noteid}/${filename}`])
        if (!error) {
            await dispatch('getFiles', { noteid: noteid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async createBucket({ dispatch }, { email }) {
        const user = await dispatch('getUser', { email: email })
        if (user) {
            const { data, error, status } = await supabaseService.storage.createBucket(`${user[0].userid}`, {
                public: true,
                fileSizeLimit: 2097152
            })
            if (!error) {
                return true
            } else if (error) {
                console.error(error)
                return false
            }
        }
    },

    async createUserFromGoogle({ commit, dispatch, state }, { user }) {
        let email = user.email
        let firstname = user.user_metadata.full_name.split(' ')[0]
        let lastname = user.user_metadata.full_name.split(' ')[1]

        const body= {
            'name': firstname,
            'email': email
        }
        const { data, error, status } = await supabase.rpc('signup', {
            firstname: firstname,
            lastname: lastname,
            email: email,
        })

        if (!error) {
            try {
                await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Type': 'welcome-email'
                    },
                    body: JSON.stringify(body)
                })
            } catch (err) {
                console.error(err)
            }
            await dispatch('createBucket', { email: email })
            await commit('googleSuccess', true)
        }
    },

    async signup({ dispatch, commit }, { firstname, lastname, email, password }) {
        email = email.toLowerCase()
        const body= {
            'name': firstname,
            'email': email
        }
        const { data, error, status } = await supabase.rpc('signup', {
            firstname: firstname,
            lastname: lastname,
            email: email,
        })
        if (!error) {
            const success = await dispatch('supabaseSignup', {
                email: email,
                password: password
            })
            if (success) {
                try {
                    await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Type': 'welcome-email'
                        },
                        body: JSON.stringify(body)
                    })
                } catch (err) {
                    console.error(err)
                }
                await dispatch('createBucket', { email: email })
                await dispatch('login', {
                    email: email,
                    password: password,
                })
                return true
            }
        } else if (error) {
            if (status === 409) {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'An account already exists with that email.'
                })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async toggleSignupDialog({ commit, state }) {
        await commit('toggleSignupDialog', !state.showSignupDialog)
    },

    async toggleLoginDialog({ commit, state }) {
        await commit('toggleLoginDialog', !state.showLoginDialog)
    },

    async getUser({}, { email }) {
        const { data, error, status } = await supabase.from('user')
            .select()
            .eq('email', email)
        return error ? null : data
    },

    async login({ dispatch, commit }, { email, password }) {
        email = email.toLowerCase()
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (!error) {
            await dispatch('getSupabaseUser')
            await commit('toggleSignupDialog', false)
            await commit('toggleLoginDialog', false)
            this.$router.push('/')
        } else if (error) {
            console.error(error)
            if (error.message == 'Invalid login credentials') {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'The provided email and/or password is invalid. Please check your details and try again.'
                })
            } else {
                await commit('setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Something went wrong, please try again.'
                })
            }
        }
    },

    async logout({ commit, dispatch }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        await commit('currentNote', {})
        await commit('studyPlans', [])
        await commit('newOrg', false)
        await commit('newFolder', false)
        await commit('newCollection', false)
        await commit('newNote', false)
        localStorage.clear()
        await dispatch('supabaseLogout')
        this.$router.push('/login')
    },

    async leaveOrg({ dispatch, state, commit }, { orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .delete()
            .eq('orgid', orgid)
            .eq('userid', state.userData.userid)
        if (!error) {
            await dispatch('orgs')
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteCollection({ dispatch, commit }, { collectionid, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .delete()
            .eq('collectionid', collectionid)
        if (!error) {
            await dispatch('collections', { orgid: orgid })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async deleteNote({ dispatch, commit }, { note, orgid }) {
        const { data, error, status } = await supabase.from('note')
            .delete()
            .eq('noteid', note.noteid)
        if (!error) {
            if (note.type) {
                if (note.parent == null) {
                    await dispatch('getOrgNotes', { parent: null })
                } else if (typeof note.parent == 'number') {
                    await dispatch('getFolderNotes', { parent: note.parent })
                }
            }
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    },

    async googleSignin({ dispatch }) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    },

    async supabaseSignup({ commit }, { email, password }) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (!error) return true
        else if (error) {
            console.error(error)
            return false
        }
    },

    async supabaseLogout( { commit }) {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            await commit('setSupabaseUser', null)
            await commit('setSupabaseSession', null)
            await commit('setUserData', null)
        }
    },

    async getSupabaseSession({ commit }) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            await commit('setSupabaseSession', session)
        }
    },

    async getSupabaseUser({ commit, dispatch }) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await commit('setSupabaseUser', user)
            await dispatch('userData', { email: user?.email })
            await dispatch('getSupabaseSession')
        }
    },

    async deleteSupabaseUser({ commit, state }) {
        const { data, error } = await supabaseService.auth.admin.deleteUser(
            state.supabaseUser.id
        )
    },

    async deleteAccount({ dispatch, commit, state }) {
        const { data, error, status } = await supabase.from('user')
            .delete()
            .eq('userid', state.userData.userid)
        if (!error) {
            await dispatch('deleteBucket')
            await dispatch('deleteSupabaseUser')
            const body = {
                name: state.userData.firstname,
                email: state.userData.email
            }
            try {
                await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Type': 'delete-email'
                    },
                    body: JSON.stringify(body)
                })
            } catch(err) {
                console.error(err)
            }
            await commit('setSupabaseUser', null)
            await commit('setSupabaseSession', null)
            await commit('setUserData', null)
            localStorage.clear()
            this.$router.push('/login')
            await commit('setAlert', {
                color: 'success',
                icon: '$success',
                text: "Your account has been deleted"
            })
        } else if (error) {
            console.error(error)
            await commit('setAlert', {
                color: 'error',
                icon: '$error',
                text: 'Something went wrong, please try again.'
            })
        }
    }
}


// External functions
async function parseDate(date) {
    let prettyDate = ""
    const yearMonth = date.split('-')
    let day = yearMonth[2].split('T')
    prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
    return prettyDate
}

async function encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

async function matchPassword(givenPass, accountPass) {
    const match = await bcrypt.compare(givenPass, accountPass)
    return match
}
