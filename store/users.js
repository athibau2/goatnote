import { supabase, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
const short = require('short-uuid');
const bcrypt = require('bcryptjs')
import randomstring from "randomstring"

export const state = () => ({
    user: getJwtToken(),
    userData: [],
    orgs: [],
    allColls: [],
    collections: [],
    notes: [],
    currentNote: {},
    words: [],
    questions: [],
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
                'Unlimited vocab words',
                'Unlimited study questions',
                'Unlimited content links',
                'Share notes with up to 3 people',
            ]
        },
        {
            name: 'Premium',
            price: '$3.99 / month',
            paymentLink: process.env.NUXT_ENV_STRIPE_PAYMENT_LINK,
            features: [
                'Everything in Basic, plus...',
                'Create vocab words with AI',
                'Create study questions with AI',
                'Unlimited notes sharing',
                'External notes sharing',
            ]
        },
    ],
    resetCode: null,
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
    newOrg(state, data) {
        state.makingNewOrg = data
    },

    newCollection(state, data) {
        state.makingNewCollection = data
    },

    newNote(state, data) {
        state.makingNewNote = data
    },

    setUser(state, user) {
        state.user = user
    },

    setUserData(state, data) {
        state.userData = data
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

    words(state, data) {
        state.words = data
    },

    questions(state, data) {
        state.questions = data
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

    toggleConsented(state) {
        state.consented = !state.consented
    },

    toggleVerifiedAge(state) {
        state.verifiedAge = !state.verifiedAge
    },

    setSignupInfo(state, data) {
        state.signupInfo = data
    },
}

// actions should call mutations
export const actions = {
    async getPassResetCode({ commit, dispatch }, { email, code = randomstring.generate(6) }) {
        const res = await dispatch('getUser', { email: email })
        if (res != null) {
            const fifteenMin = 900000
            const expiration = Date.now() + fifteenMin
            const { data, error, status } = await supabase.from('reset_code')
                .insert({
                    code: code,
                    codeemail: email,
                    codeexpiration: expiration.toString()
                }).select()
            if (!error) {
                const params = {
                    'name': res[0].firstname,
                    'email': email,
                    'code': code,
                    'codeexpiration': `${new Date(expiration).toDateString()} at ${new Date(expiration).toLocaleTimeString()}`
                }
                await fetch('http://localhost:8888/.netlify/functions/email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Type': 'reset-pass'
                    },
                    body: JSON.stringify(params)
                }).then(async function(response) {
                    if (response) {
                        alert(`Check your email and enter the code in the space below. The code will expire in 15 minutes.`)
                        await commit('setResetCode', data[0])
                    } else {
                        console.log('Failed to send email');
                    }
                })
            } else if (error) {
                console.log(error)
                if (status === 409) {
                    await dispatch('getPassResetCode', { email: email })
                }
            }
        } else if (res == null) {
            alert('No account found with that email.')
        }
    },

    async resetPass({}, { email, password }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                password: await encryptPassword(password)
            })
            .eq('email', email)
        if (!error) {
            alert('Password reset successful.')
            await commit('setResetCode', null)
            this.$router.push('/login')
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('No user found with that email.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async toggleAdmin({ dispatch }, { userid, isadmin }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                isadmin: isadmin
            })
            .eq('userid', userid)
        if (!error) {
            dispatch('adminLoadUsers')
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('User is not found.')
            } else {
                alert('Something went wrong, please try again.')
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
                console.log(error)
                await commit('adminUsers', [])
            }
        }
        
        async function getOrgs() {
            const { data, error, status } = await supabase.from('admin_see_all_orgs')
                .select()
            if (!error) {
                await commit('adminOrgs', data)
            } else if (error) {
                console.log(error)
                await commit('adminOrgs', [])
            }
        }

        async function getColls() {
            const { data, error, status } = await supabase.from('admin_see_all_colls')
                .select()
            if (!error) {
                await commit('adminColls', data)
            } else if (error) {
                console.log(error)
                await commit('adminColls', [])
            }
        }

        async function getNotes() {
            const { data, error, status } = await supabase.from('admin_see_all_notes')
                .select()
            if (!error) {
                await commit('adminNotes', data)
            } else if (error) {
                console.log(error)
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
                console.log(error)
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
                console.log(error)
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
                console.log(error)
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
                console.log(error)
                await commit('adminUserNotes', [])
            }
        }
    },

    async deleteUser({ dispatch }, { userid }) {
        const { data, error, status } = await supabase.from('user')
            .delete()
            .eq('userid', userid)
        if (!error) {
            await dispatch('adminLoadUsers')
            this.$router.push('/admin')
        } else if (error) {
            console.log(error)
            if (status === 400) {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async deleteOrg({ dispatch }, { orgid }) {
        const { data, error, status } = await supabase.from('organization')
            .delete()
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('adminLoadUsers')
            this.$router.push('/admin')
        } else if (error) {
            console.log(error)
            if (status === 400) {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async removeFromOrg({ dispatch }, { userid, orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .delete()
            .eq('userid', userid)
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('loadOrgUsers', { orgid })
            await dispatch('adminLoadOneUser', { userid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async loadOrgUsers({ commit }, { orgid }) {
        const { data, error, status } = await supabase.from('admin_see_org_users')
            .select()
            .eq('orgid', orgid)
        if (!error) {
            await commit('orgUsers', data)
        } else if (error) {
            console.log(error)
            if (status === 404) {
                await commit('orgUsers', [])
            } else {
                alert('Something went wrong, please try again.')
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
            console.log(error)
            if (status === 404) {
                await commit('collNotes', [])
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async userData({ commit, state }) {
        const { data, error, status } = await supabase.from('see_personal_data')
            .select()
            .eq('email', state.user.email)
        if (!error) {
            await commit('setUserData', data[0])
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async basicOnboardingComplete({ dispatch, state }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                onboarded: true
            })
            .eq('userid', state.user.user_id)
        if (!error) {
            await dispatch('userData')
        } else if (error) {
            console.log(error)
            if (status === 404 || status === 400) {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async noteOnboardingComplete({ dispatch, state }) {
        const { data, error, status } = await supabase.from('user')
            .update({
                noteonboarded: true
            })
            .eq('userid', state.user.user_id)
        if (!error) {
            await dispatch('userData')
        } else if (error) {
            console.log(error)
            if (status === 404 || status === 400) {
                alert('Something went wrong, please try again.')
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
            console.log(error)
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
            console.log(error)
            await commit('foundOrg', null)
        }
    },

    async joinOrg({ dispatch, state }, { orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .insert({
                userid: state.user.user_id,
                orgid: orgid
            })
        if (!error) {
            await dispatch('orgs')
            alert('You have been successfully added to the organization.')
        } else if (error) {
            console.log(error)
            if (status === 409) {
                alert('You are already a member of this organization.')
            } else if (status === 400) {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async toggleOrg({ dispatch }, { orgid, isPrivate }) {
        const { data, error, status } = await supabase.from('organization')
            .update({
                isprivate: isPrivate
            })
            .eq('orgid', orgid)
        if (!error) {
            await dispatch('adminLoadUsers')
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Organization not found.')
            } else if (status === 400) {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async createOrg({ dispatch }, { orgname, isPrivate }) {
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
            console.log(error)
            if (status === 409) {
                alert('An organization with this name already exists.')
            } else alert('Something went wrong, please try again.')
        }
    },

    async updateCollName({ dispatch }, { collectionid, newName, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .update({
                collectionname: newName
            })
            .eq('collectionid', collectionid)
        if (!error) {
            await dispatch('collections', { orgid })
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Collection not found.')
            } else alert('Something went wrong, please try again.')
        }
    },

    async loadSharedColls({ commit, state }) {
        const { data, error, status } = await supabase.from('see_colls_shared_with_me')
            .select()
            .eq('userid', state.user.user_id)
        if (!error) {
            await commit('collsSharedWithMe', data)
        } else if (error) {
            console.log(error)
            await commit('collsSharedWithMe', [])
        }
    },

    async loadSharedNotes({ commit, state }) {
        const { data, error, status } = await supabase.from('see_notes_shared_with_me')
            .select()
            .eq('userid', state.user.user_id)
        if (!error) {
            await commit('notesSharedWithMe', data)
        } else if (error) {
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
            await commit('sharedNoteList', [])
        }
    },

    async shareColl({ dispatch, state }, { collection, users }) {
        let success = true
        for (let i = 0; i < users.length; ++i) {
            const { data, error, status } = await supabase.from('shared_collection')
                .insert({
                    collectionid: collection.collectionid,
                    ownerid: state.user.user_id,
                    userid: users[i]
                })
            if (!error) continue
            else if (error) {
                console.log(error)
                success = false
            }
        }
        await dispatch('getSharedCollList', { collection })
        if (success) {
            alert('Your collection has successfully been shared')
        } else if (!success) {
            alert('Sharing has completed, but an error has occurred.')
        }
    },

    async shareNote({ dispatch, state }, { note, users }) {
        let success = true
        for (let i = 0; i < users.length; ++i) {
            const { data, error, status } = await supabase.from('shared_note')
                .insert({
                    noteid: note.noteid,
                    ownerid: state.user.user_id,
                    userid: users[i]
                })
            if (!error) continue
            else if (error) {
                console.log(error)
                success = false
            }
        }
        await dispatch('getSharedNoteList', { note })
        if (success) {
            alert('Your note has successfully been shared')
        } else if (!success) {
            alert('Sharing has completed, but an error has occurred.')
        }
    },

    async unshareColl({ dispatch }, { collection, userid, type }) {
        const { data, error, status } = await supabase.from('shared_collection')
            .delete()
            .eq('collectionid', collection.collectionid)
            .eq('userid', userid)
        if (!error) {
            (type === "owner")
                ? await dispatch('getSharedCollList', { collection })
                : await dispatch('loadSharedWithMe')
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async unshareNote({ dispatch }, { note, userid, type }) {
        const { data, error, status } = await supabase.from('shared_note')
            .delete()
            .eq('noteid', note.noteid)
            .eq('userid', userid)
        if (!error) {
            (type === "owner")
                ? await dispatch('getSharedNoteList', { note })
                : await dispatch('loadSharedWithMe')
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again')
        }
    },

    async createCollection({ dispatch, state }, { collectionname, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .insert({
                collectionname: collectionname,
                orgid: orgid,
                userid: state.user.user_id
            })
        if (!error) {
            await dispatch('collections', { orgid })
            await dispatch('allColls')
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Organization or user not found, unable to create collection.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async createNote({ dispatch }, { notename, collectionid, orgid }) {
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
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async orgs({ commit, state }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_orgs')
            .select()
            .eq('email', state.user.email)
        if (!error) {
            await commit('setOrgs', data)
        } else if (error) {
            console.log(error)
            await commit('setOrgs', [])
        }
    },

    async allColls({ commit, state }) {
        const { data, error, status } = await supabase.from('see_collections')
            .select()
            .eq('email', state.user.email)
        if (!error) {
            await commit('allColls', data)
        } else if (error) {
            console.log(error)
            await commit('allColls', [])
        }
    },

    async collections ({ commit, state }, { orgid }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        const { data, error, status } = await supabase.from('see_collections')
            .select()
            .eq('email', state.user.email)
            .eq('orgid', orgid)
        if (!error) {
            await commit('setCollections', data)
        } else if (error) {
            console.log(error)
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
            console.log(error)
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
            localStorage.setItem('prettyDate', prettyDate)
            await commit('currentNote', data[0])
            localStorage.setItem('note', JSON.stringify(state.currentNote))
            await dispatch('getWords', { noteid: noteid })
            await dispatch('getQuestions', { noteid: noteid })
            await dispatch('getLinks', { noteid: noteid })
            await dispatch('getStudyPlans', { noteid: noteid })
            this.$router.push('/note')
        } else if (error) {
            console.log(error)
            alert('An error occurred opening the note, please try again.')
        }
    },

    async updateGptCalls({ commit }, { num, noteid }) {
        const { data, error, status } = await supabase.from('note')
            .update({
                numgptcalls: num
            })
            .eq('noteid', noteid)
            .select()
        console.log(data)
        if (!error) {
            let temp = JSON.parse(localStorage.getItem('note'))
            temp.typednotes = data[0].typednotes
            await commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
        } else if (error) {
            console.log(error)
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
            console.log(error)
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
                "userid": state.user.user_id }
            await commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
        } else if (error) {
            console.log(error)
            alert('An error occurred updating the note name, please try again.')
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
            console.log(error)
            await commit('links', [])
        }
    },

    async addLink({ dispatch }, { url, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .insert({
                url: url,
                noteid: noteid
            })
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async updateLink({ dispatch }, { linkid, editLink, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .update({
                url: editLink
            })
            .eq('linkid', linkid)
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Link not found.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async deleteLink({ dispatch }, { linkid, noteid }) {
        const { data, error, status } = await supabase.from('links')
            .delete()
            .eq('linkid', linkid)
        if (!error) {
            await dispatch('getLinks', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async getQuestions({ commit, state }, { noteid }) {
        const { data, error, status } = await supabase.from('see_questions')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('questions', data)
            localStorage.setItem('questions', JSON.stringify(state.questions))
        } else if (error) {
            console.log(error)
            await commit('questions', [])
        }
    },

    async addQuestion({ dispatch }, { newQuestion, newAnswer, noteid }) {
        const { data, error, status } = await supabase.from('questions')
            .insert({
                questiontext: newQuestion,
                answer: newAnswer,
                noteid: noteid
            })
        if (!error) {
            await dispatch('getQuestions', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try agian.')
        }
    },

    async updateQuestion({ dispatch }, { questionid, editQuestion, editAnswer, noteid }) {
        const { data, error, status } = await supabase.from('questions')
            .update({
                questiontext: editQuestion,
                answer: editAnswer
            })
            .eq('questionid', questionid)
        if (!error) {
            await dispatch('getQuestions', { noteid: noteid })
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Question not found.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async deleteQuestion({ dispatch }, { questionid, noteid }) {
        const { data, error, status } = await supabase.from('questions')
            .delete()
            .eq('questionid', questionid)
        if (!error) {
            await dispatch('getQuestions', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async getWords({ commit, state }, { noteid }) {
        const { data, error, status } = await supabase.from('see_words')
            .select()
            .eq('noteid', noteid)
        if (!error) {
            await commit('words', data)
            localStorage.setItem('words', JSON.stringify(state.words))
        } else if (error) {
            console.log(error)
            await commit('words', [])
        }
    },

    async addWord({ dispatch }, { newWord, newDef, noteid }) {
        const { data, error, status } = await supabase.from('words')
            .insert({
                vocabword: newWord,
                definition: newDef,
                noteid: noteid
            })
        if (!error) {
            await dispatch('getWords', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async updateWord({ dispatch }, { wordid, editWord, editDef, noteid }) {
        const { data, error, status } = await supabase.from('words')
            .update({
                vocabword: editWord,
                definition: editDef
            })
            .eq('wordid', wordid)
        if (!error) {
            await dispatch('getWords', { noteid: noteid })
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Word not found')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async deleteWord({ dispatch }, { wordid, noteid }) {
        const { data, error, status } = await supabase.from('words')
            .delete()
            .eq('wordid', wordid)
        if (!error) {
            await dispatch('getWords', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async addPlan({ dispatch }, { date, time, amount, priority, noteid}) {
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
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async updatePlan({ dispatch }, { planid, completed, noteid }) {
        const { data, error, status } = await supabase.from('study_plan')
            .update({
                studycompleted: completed
            })
            .eq('planid', planid)
        if (!error) {
            await dispatch('getStudyPlans', { noteid: noteid })
        } else if (error) {
            console.log(error)
            if (status === 404) {
                alert('Plan not found.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async getAllPlans({ commit, state }) {
        const { data, error, status } = await supabase.from('see_all_plans')
            .select()
            .eq('userid', state.user.user_id)
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
            console.log(error)
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
            console.log(error)
            await commit('studyPlans', [])
            localStorage.setItem('studyPlans', JSON.stringify([]))
        }
    },

    async deletePlan({ dispatch }, { planid, noteid }) {
        const { data, error, status } = await supabase.from('study_plan')
            .delete()
            .eq('planid', planid)
        if (!error) {
            if (noteid === null) await dispatch('getAllPlans')
            else await dispatch('getStudyPlans', { noteid: noteid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async updatePass({ dispatch, state }, { newPass, currentPass }) {
        // const response = await dispatch('getUser', { email: state.user.email })
        // if (response != null) {
            // if (await matchPassword(currentPass, response[0].password)) {
            if (await matchPassword(currentPass, state.userData.password)) {
                const { data, error, status } = await supabase.from('user')
                    .update({
                        password: await encryptPassword(newPass)
                    })
                    .eq('userid', state.user.user_id)
                if (!error) {
                    await dispatch('userData')
                    alert("Your password has been updated")
                } else if (error) {
                    console.log(error)
                    alert('Something went wrong, please try again.')
                }
            }
            else {
                alert("The current password you entered is incorrect")
            }
        // } else {
        //     alert('Something went wrong, please try again.')
        // }
    },

    async signup({ dispatch }, { firstname, lastname, email, password }) {
        email = email.toLowerCase()
        const body= {
            'name': firstname,
            'email': email
        }
        await fetch('http://localhost:8888/.netlify/functions/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Type': 'welcome-email'
            },
            body: JSON.stringify(body)
        })
        // const { data, error, status } = await supabase.rpc('signup', {
        //     firstname: firstname,
        //     lastname: lastname,
        //     email: email,
        //     password: await encryptPassword(password)
        // })
        // if (!error) {
        //     await dispatch('login', {
        //         email: email,
        //         password: password
        //     })
        //     return true
        // } else if (error) {
        //     if (status === 409) {
        //         alert('An account already exists with that email.')
        //     } else {
        //         alert('Something went wrong, please try again.')
        //     }
        // }
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
        const res = await dispatch('getUser', { email: email })
        if (res != null && res.length != 0) {
            if (await matchPassword(password, res[0].password)) {
                const { data, error, status } = await supabase.rpc('login', {
                    email: email,
                    password: res[0].password
                })
                if (!error && data.token != null) {
                    setJwtToken(data.token)
                    await commit('setUser', getUserIdFromToken(getJwtToken()))
                    await dispatch('userData')
                    await dispatch('orgs')
                    await commit('toggleSignupDialog', false)
                    await commit('toggleLoginDialog', false)
                    this.$router.push('/')
                } else if (error) {
                    console.log(error)
                    alert('Something went wrong, please try again.')
                }
            } else {
                alert('The password you entered was incorrect.')
            }
        } else {
            alert('No user found with that email.')
        }
    },

    async logout({ commit }) {
        await commit('setCollections', [])
        await commit('setNotes', [])
        await commit('currentNote', {})
        await commit('studyPlans', [])
        await commit('newOrg', false)
        await commit('newCollection', false)
        await commit('newNote', false)
        localStorage.removeItem('note')
        localStorage.removeItem('collNotes')
        localStorage.removeItem('words')
        localStorage.removeItem('questions')
        localStorage.removeItem('links')
        localStorage.removeItem('studyPlans')
        deleteJwtToken()
        await commit('setUser', null)
        this.$router.push('/login')
    },

    async leaveOrg({ dispatch, state }, { orgid }) {
        const { data, error, status } = await supabase.from('part_of')
            .delete()
            .eq('orgid', orgid)
            .eq('userid', state.user.user_id)
        if (!error) {
            await dispatch('orgs')
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async deleteCollection({ dispatch }, { collectionid, orgid }) {
        const { data, error, status } = await supabase.from('collection')
            .delete()
            .eq('collectionid', collectionid)
        if (!error) {
            await dispatch('collections', { orgid: orgid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async deleteNote({ dispatch }, { noteid, collectionid }) {
        const { data, error, status } = await supabase.from('note')
            .delete()
            .eq('noteid', noteid)
        if (!error) {
            if (collectionid === undefined) await dispatch('adminLoadUsers')
            else await dispatch('notes', { collectionid: collectionid })
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    },

    async deleteAccount({ state }) {
        const { data, error, status } = await supabase.from('user')
            .delete()
            .eq('userid', state.user.user_id)
        if (!error) {
            deleteJwtToken()
            this.$router.push('/login')
            alert("Your account has been deleted")
        } else if (error) {
            console.log(error)
            alert('Something went wrong, please try again.')
        }
    }
}

export const getters = {
    isLoggedIn: state => {
        return state.user
    },

    getOrgs: state => {
        return state.orgs
    },

    getTypedNotes: state => {
        return state.currentNote.typednotes
    }
}

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
