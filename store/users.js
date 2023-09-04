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
    allColls: [],
    collections: [],
    notes: [],
    currentNote: {},
    flashcards: [],
    links: [],
    studyPlans: [],
    allPlans: [],
    makingNewOrg: false,
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
    noteBeingShared: null,
    results: [],
    sharedCollList: [],
    sharedNoteList: [],
    collsSharedWithMe: [],
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
    showStudyTools: false,
    showFileView: false,
    showQuickWord: false,
    showMyWhiteboards: false,
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

    noteBeingShared(state, data) {
        state.noteBeingShared = data
    },

    results(state, data) {
        state.results = data
    },

    sharedCollList(state, data) {
        state.sharedCollList = data
    },

    sharedNoteList(state, data) {
        state.sharedNoteList = data
    },

    collsSharedWithMe(state, data) {
        state.collsSharedWithMe = data
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

    async updateCollName({ dispatch, commit }, { collectionid, newName, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .update({
                collectionname: newName
            })
            .eq('collectionid', collectionid)
        if (!error) {
            await dispatch('collections', { orgid })
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

    async loadSharedColls({ commit, state }) {
        const { data, error, status } = await supabase.from('see_colls_shared_with_me')
            .select()
            .eq('userid', state.userData.userid)
        if (!error) {
            await commit('collsSharedWithMe', data)
        } else if (error) {
            console.error(error)
            await commit('collsSharedWithMe', [])
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
        await dispatch('loadSharedColls')
        await dispatch('loadSharedNotes')
    },

    async search({ commit }, { searchText, orgid }) {
        searchText = searchText.toLowerCase()
        const { data, error, status } = await supabase.from('search_users')
            .select()
            .eq('orgid', orgid)
            .like('email', `${searchText}%`)
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

    async createCollection({ dispatch, state, commit }, { collectionname, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .insert({
                collectionname: collectionname,
                orgid: orgid,
                userid: state.userData.userid
            })
        if (!error) {
            await dispatch('collections', { orgid })
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

    async createNote({ dispatch, commit }, { notename, collectionid, orgid }) {
        const { data, error, status } = await supabase.from('note')
            .insert({
                notename: notename,
                collectionid: collectionid,
            }).select()
        if (!error) {
            await dispatch('openNote', { noteid: data[0].noteid })
            await dispatch('collections', { orgid })
            await dispatch('notes', { collectionid })
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

    async collections ({ commit, state }, { orgid }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_collections')
            .select()
            .eq('email', state.userData.email)
            .eq('orgid', orgid)
        if (!error) {
            await commit('setCollections', data)
        } else if (error) {
            console.error(error)
            await commit('setCollections', [])
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
            await dispatch('getFlashcards', { noteid: noteid })
            await dispatch('getLinks', { noteid: noteid })
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
        } else if (error) {
            console.error(error)
        }
    },

    async updateNoteName({ commit, state }, { newNoteName, noteid }) {
        const { data, error, status } = await supabase.from('note')
            .update({
                notename: newNoteName
            }).select()
            .eq('noteid', noteid)
        if (!error) {
            let temp = { ...data[0], 
                "collectionname": state.currentNote.collectionname,
                "orgid": state.currentNote.orgid,
                "userid": state.userData.userid }
            await commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
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

    async addFlashcard({ dispatch, commit }, { newPrompt, newAnswer, noteid }) {
        const { data, error, status } = await supabase.from('flashcards')
            .insert({
                cardprompt: newPrompt,
                cardanswer: newAnswer,
                noteid: noteid
            })
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
                fileSizeLimit: 1048576
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

    async deleteNote({ dispatch, commit }, { noteid, collectionid }) {
        const { data, error, status } = await supabase.from('note')
            .delete()
            .eq('noteid', noteid)
        if (!error) {
            if (collectionid === undefined) await dispatch('adminLoadUsers')
            else await dispatch('notes', { collectionid: collectionid })
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
