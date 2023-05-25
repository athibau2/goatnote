import axios from "axios";
import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";
const short = require('short-uuid');
const bcrypt = require('bcryptjs')


const API_URL = "http://ec2-3-88-53-104.compute-1.amazonaws.com:8000";

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
    showLoginDialog: false,
  })
  
// mutations should update state
export const mutations = {
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

    toggleLoginDialog(state, data) {
        state.showLoginDialog = data
    },
}

// actions should call mutations
export const actions = {
    async toggleAdmin({ dispatch }, { userid, isadmin }) {
        try {
            const res = await axios.patch(API_URL + `/user?userid=eq.${userid}`, {
                isadmin: isadmin
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('loadAdminData')
            }
        } catch (err) {
            if (err.response.status === 404) {
                alert('User is not found')
            } else if (err.response.status === 400) {
                alert('Something went wront, please try again')
            }
        }
    },

    async loadAdminData({ commit }) {
        try {
            const res = await axios.get(API_URL + '/admin_see_all_users')
            if (res.status === 200) await commit('adminUsers', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminUsers', []) }

        try {
            const res = await axios.get(API_URL + '/admin_see_all_orgs')
            if (res.status === 200) await commit('adminOrgs', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminOrgs', []) }

        try {
            const res = await axios.get(API_URL + '/admin_see_all_colls')
            if (res.status === 200) await commit('adminColls', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminColls', []) }

        try {
            const res = await axios.get(API_URL + '/admin_see_all_notes')
            if (res.status === 200) await commit('adminNotes', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminNotes', []) }
    },

    async loadAdminUserData({ commit }, { userid }) {
        try {
            const res = await axios.get(API_URL + `/see_personal_data?userid=eq.${userid}`)
            if (res.status === 200) await commit('adminUserData', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminUserData', []) }

        try {
            const res = await axios.get(API_URL + `/admin_see_user_orgs?userid=eq.${userid}`)
            if (res.status === 200) await commit('adminUserOrgs', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminUserOrgs', []) }

        try {
            const res = await axios.get(API_URL + `/admin_see_user_colls?userid=eq.${userid}`)
            if (res.status === 200) await commit('adminUserColls', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminUserColls', []) }

        try {
            const res = await axios.get(API_URL + `/admin_see_user_notes?userid=eq.${userid}`)
            if (res.status === 200) await commit('adminUserNotes', res.data)
        } catch (err) { if (err.response.status === 404) commit('adminUserNotes', []) }
    },

    async deleteUser({ dispatch }, { userid }) {
        try {
            const res = await axios.delete(API_URL + `/user?userid=eq.${userid}`, {
                headers: authHeader()
            })
            if (res.status === 204 || res.status === 404) {
                await dispatch('loadAdminData')
                this.$router.push('/admin')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async deleteOrg({ dispatch }, { orgid }) {
        try {
            const res = await axios.delete(API_URL + `/organization?orgid=eq.${orgid}`, {
                headers: authHeader()
            })
            if (res.status === 204 || res.status === 404) {
                await dispatch('loadAdminData')
                this.$router.push('/admin')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async removeFromOrg({ dispatch }, { userid, orgid }) {
        try {
            const res = await axios.delete(API_URL + `/part_of?userid=eq.${userid}&orgid=eq.${orgid}`, {
                headers: authHeader()
            })
            if (res.status === 204 || res.status === 404) {
                await dispatch('loadOrgUsers', { orgid })
                await dispatch('loadAdminUserData', { userid })
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async loadOrgUsers({ commit }, { orgid }) {
        try {
            const res = await axios.get(API_URL + `/admin_see_org_users?orgid=eq.${orgid}`)
            if (res.status === 200) {
                await commit('orgUsers', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('orgUsers', [])
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async loadCollNotes({ commit }, { collectionid }) {
        try {
            const res = await axios.get(API_URL +  `/admin_see_coll_notes?collectionid=eq.${collectionid}`)
            if (res.status == 200) {
                await commit('collNotes', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('collNotes', [])
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async userData({ commit, state }) {
        try {
            const response = await axios.get(API_URL + '/see_personal_data?email=eq.' + state.user.email)
            if (response.status === 200) {
                commit('setUserData', response.data[0])
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async basicOnboardingComplete({ dispatch, state }) {
        try {
            const res = await axios.patch(API_URL + `/user?userid=eq.${state.user.user_id}`, {
                onboarded: true
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                await dispatch('userData')
            } 
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try agian.')
            }
        }
    },

    async noteOnboardingComplete({ dispatch, state }) {
        try {
            const res = await axios.patch(API_URL + `/user?userid=eq.${state.user.user_id}`, {
                noteonboarded: true
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                await dispatch('userData')
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try agian.')
            }
        }
    },

    async loadPublicOrgs({ commit }) {
        await commit('foundOrg', null)
        try {
            const res = await axios.get(API_URL + `/see_public_orgs`)
            if (res.status === 200) {
                await commit('publicOrgs', res.data)
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                await commit('publicOrgs', [])
            }
        }
    },

    async searchOrg({ commit }, { searchText }) {
        try {
            const res = await axios.get(API_URL + `/search_org_by_code?joincode=eq.${searchText}`)
            if (res.status === 200) {
                if (res.data.length === 0) await commit('foundOrg', null)
                else await commit('foundOrg', res.data[0])
            }
        } catch(err) {
            if (err.response.status === 404) {
                await commit('foundOrg', null)
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async joinOrg({ dispatch, state }, { orgid }) {
        try {
            const res = await axios.post(API_URL + `/part_of`, {
                userid: state.user.user_id,
                orgid: orgid
            },
            {
                headers: authHeader()
            })
            if (res.status === 201) {
                dispatch('orgs')
                alert('You have been successfully added to the organization.')
            }
        } catch(err) {
            if (err.response.status === 409) {
                alert('You are already a member of this organization or this organization already exists.')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async toggleOrg({ dispatch }, { orgid, isPrivate }) {
        try {
            const res = await axios.patch(API_URL + `/organization?orgid=eq.${orgid}`, {
                isprivate: isPrivate
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('loadAdminData')
            }
        } catch(err) {
            if (err.response.status === 404) {
                alert('Organization not found.')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async createOrg({ dispatch }, { orgname, isPrivate }) {
        try {
            const response = await axios.post(API_URL + '/organization', {
                orgname: orgname,
                isprivate: isPrivate,
                joincode: short.generate()
            },
            {
                headers: { ...authHeader(), Prefer: "return=representation" }
            })
            if (response.status === 201) {
                dispatch('joinOrg', { orgid: response.data[0].orgid })
            }
        } catch(error) {
            if (error.response.status === 409) alert('An organization with that name already exists')
            else alert('Something went wrong')
        }
    },

    async updateCollName({ dispatch }, { collectionid, newName, orgid }) {
        try {
            const res = await axios.patch(API_URL + `/collection?collectionid=eq.${collectionid}`, {
                collectionname: newName
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('collections', { orgid })
            }
        } catch (err) {
            if (err.response.status === 404) alert('Collection not found')
            else if (err.response.status === 400) alert('Something went wrong, please refresh the page and try again.')
        }
    },

    async loadSharedWithMe({ commit, state }) {
        try {
            const res = await axios.get(API_URL + `/see_colls_shared_with_me?userid=eq.${state.user.user_id}`)
            if (res.status === 200) {
                await commit('collsSharedWithMe', res.data)
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                await commit('collsSharedWithMe', [])
            }
        }

        try {
            const res = await axios.get(API_URL + `/see_notes_shared_with_me?userid=eq.${state.user.user_id}`)
            if (res.status === 200) {
                await commit('notesSharedWithMe', res.data)
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                await commit('notesSharedWithMe', [])
            }
        }
    },

    async search({ commit }, { searchText, orgid }) {
        try {
            searchText = searchText.toLowerCase()
            const res = await axios.get(API_URL + `/search_users?orgid=eq.${orgid}&email=like.${searchText}%`)
            if (res.status === 200) {
                await commit('results', res.data)
            }
        } catch(err) {
            if (err.response.status === 404 || err.response.status === 400) {
                await commit('results', [])
            }
        }
    },

    async getSharedCollList({ commit }, { collection }) {
        await commit('collBeingShared', collection)
        try {
            const res = await axios.get(API_URL + `/see_shared_colls?collectionid=eq.${collection.collectionid}`)
            if (res.status === 200) {
                await commit('sharedCollList', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('sharedCollList', [])
            }
        }
    },

    async getSharedNoteList({ commit }, { note }) {
        await commit('noteBeingShared', note)
        try {
            const res = await axios.get(API_URL + `/see_shared_notes?noteid=eq.${note.noteid}`)
            if (res.status === 200) {
                await commit('sharedNoteList', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('sharedNoteList', [])
            }
        }
    },

    async shareColl({ dispatch, state }, { collection, users }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await axios.post(API_URL + '/shared_collection', {
                    collectionid: collection.collectionid,
                    ownerid: state.user.user_id,
                    userid: users[i]
                })
                if (res.status === 201) continue
            }
            await dispatch('getSharedCollList', { collection })
            alert('Your collection has successfully been shared')
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async shareNote({ dispatch, state }, { note, users }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await axios.post(API_URL + '/shared_note', {
                    noteid: note.noteid,
                    ownerid: state.user.user_id,
                    userid: users[i]
                })
                if (res.status === 201) continue
            }
            await dispatch('getSharedNoteList', { note })
            alert('Your note has successfully been shared')
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async unshareColl({ dispatch }, { collection, userid, type }) {
        try {
            const res = await axios.delete(API_URL + `/shared_collection?collectionid=eq.${collection.collectionid}&userid=eq.${userid}`, {
                headers: authHeader()
            })
            if (res.status === 204) {
                (type === "owner")
                    ? await dispatch('getSharedCollList', { collection })
                    : await dispatch('loadSharedWithMe')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async unshareNote({ dispatch }, { note, userid, type }) {
        try {
            const res = await axios.delete(API_URL + `/shared_note?noteid=eq.${note.noteid}&userid=eq.${userid}`, {
                headers: authHeader()
            })
            if (res.status === 204) {
                (type === "owner")
                    ? await dispatch('getSharedNoteList', { note })
                    : await dispatch('loadSharedWithMe')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async createCollection({ dispatch, state }, { collectionname, orgid }) {
        try {
            const response = await axios.post(API_URL + '/collection', {
                collectionname: collectionname,
                orgid: orgid,
                userid: state.user.user_id
            },
            {
                headers: authHeader()
            })
            if (response.status === 200 || response.status === 201) {
                dispatch('collections', { orgid })
                dispatch('allColls')
            }
        } catch(err) {
            if (err.response.status === 404) {
                alert('Organization or user not found, unable to create collection.')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async createNote({ dispatch }, { notename, collectionid, orgid }) {
        const response = await axios.post(API_URL + '/note', {
            notename: notename,
            collectionid: collectionid,
        },
        {
            headers: { ...authHeader(), Prefer: "return=representation" }
        })
        if (response.status === 201) {
            dispatch('openNote', { noteid: response.data[0].noteid })
            dispatch('collections', { orgid })
            dispatch('notes', { collectionid })
        }
    },

    async orgs({ commit, state }) {
        commit('setCollections', [])
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_orgs?email=eq.' + state.user.email)
        if (response.status === 200) {
            commit('setOrgs', response.data)
        }
    },

    async allColls({ commit, state }) {
        const response = await axios.get(API_URL + '/see_collections?email=eq.' + state.user.email)
        if (response.status === 200) {
            commit('allColls', response.data)
        }
    },

    async collections ({ commit, state }, { orgid }) {
        commit('setCollections', [])
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_collections?email=eq.' + state.user.email + '&orgid=eq.' + orgid)
        if (response.status === 200) {
            commit('setCollections', response.data)
        }
    },

    async notes({ commit }, { collectionid }) {
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_notes?&collectionid=eq.' + collectionid)
        if (response.status === 200) {
            await commit('setNotes', response.data)
            localStorage.setItem('collNotes', JSON.stringify(response.data))
        }
    },

    async openNote({ dispatch, commit, state }, { noteid }) {
        localStorage.removeItem('prettyDate')
        await commit('currentNote', {})
        const response = await axios.get(API_URL + '/see_note_with_data?noteid=eq.' + noteid)
        if (response.status === 200) {
            let prettyDate = await parseDate(response.data[0].notedate)
            localStorage.setItem('prettyDate', prettyDate)
            await commit('currentNote', response.data[0])
            localStorage.setItem('note', JSON.stringify(state.currentNote))
            await dispatch('getWords', { noteid })
            await dispatch('getQuestions', { noteid })
            await dispatch('getLinks', { noteid })
            await dispatch('getStudyPlans', { noteid })
            this.$router.push('/note')
        }
    },

    async saveNotes({ commit }, { noteText, noteid }) {
        const response = await axios.patch(API_URL + '/note?noteid=eq.' + noteid, {
            typednotes: noteText
        },
        {
            headers: authHeader()
        })
        if (response.status === 204) {
            let temp = JSON.parse(localStorage.getItem('note'))
            temp.typednotes = noteText
            commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
        }
    },

    async updateNoteName({ commit, state }, { newNoteName, noteid }) {
        const res = await axios.patch(API_URL + '/note?noteid=eq.' + noteid, {
            notename: newNoteName
        },
        {
            headers: { ...authHeader(), Prefer: "return=representation" }
        })
        if (res.status === 204 || res.status === 200) {
            let temp = { ...res.data[0], 
                "collectionname": state.currentNote.collectionname,
                "orgid": state.currentNote.orgid,
                "userid": state.user.user_id }
            await commit('currentNote', temp)
            localStorage.setItem('note', JSON.stringify(temp))
        }
    },

    async getLinks({ commit, state }, { noteid }) {
        try {
            const links = await axios.get(API_URL + '/see_links?noteid=eq.' + noteid)
            if (links.status === 200) {
                await commit('links', links.data)
                localStorage.setItem('links', JSON.stringify(state.links))
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('links', [])
            }
        }
    },

    async addLink({ dispatch }, { url, noteid }) {
        const response = await axios.post(API_URL + '/links', {
            url: url,
            noteid: noteid
        },
        {
            headers: authHeader()
        })
        if (response.status === 201) {
            dispatch('getLinks', { noteid: noteid })
        }
    },

    async updateLink({ dispatch }, { linkid, editLink, noteid }) {
        try {
            const res = await axios.patch(API_URL + `/links?linkid=eq.${linkid}`, {
                url: editLink
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('getLinks', { noteid: noteid })
            }
        } catch (err) {
            if (err.response.status === 404) {
                alert('Link not found')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async deleteLink({ dispatch }, { linkid, noteid }) {
        const res = await axios.delete(API_URL + '/links?linkid=eq.' + linkid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getLinks', { noteid: noteid})
        }
    },

    async getQuestions({ commit, state }, { noteid }) {
        try {
            const questions = await axios.get(API_URL + '/see_questions?noteid=eq.' + noteid)
            if (questions.status === 200) {
                await commit('questions', questions.data)
                localStorage.setItem('questions', JSON.stringify(state.questions))
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('questions', [])
            }
        }
    },

    async addQuestion({ dispatch }, { newQuestion, newAnswer, noteid }) {
        const response = await axios.post(API_URL + '/questions', {
            questiontext: newQuestion,
            answer: newAnswer,
            noteid: noteid
        },
        {
            headers: authHeader()
        })
        if (response.status === 201) {
            dispatch('getQuestions', { noteid: noteid })
        }
    },

    async updateQuestion({ dispatch }, { questionid, editQuestion, editAnswer, noteid }) {
        try {
            const res = await axios.patch(API_URL + `/questions?questionid=eq.${questionid}`, {
                questiontext: editQuestion,
                answer: editAnswer
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('getQuestions', { noteid: noteid })
            }
        } catch (err) {
            if (err.response.status === 404) {
                alert('Question not found')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async deleteQuestion({ dispatch }, { questionid, noteid }) {
        const res = await axios.delete(API_URL + '/questions?questionid=eq.' + questionid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getQuestions', { noteid: noteid})
        }
    },

    async getWords({ commit, state }, { noteid }) {
        try {
            const words = await axios.get(API_URL + '/see_words?noteid=eq.' + noteid)
            if (words.status === 200) {
                await commit('words', words.data)
                localStorage.setItem('words', JSON.stringify(state.words))
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('words', [])
            }
        }
    },

    async addWord({ dispatch }, { newWord, newDef, noteid }) {
        console.log(newWord, newDef)
        const response = await axios.post(API_URL + '/words', {
            vocabword: newWord,
            definition: newDef,
            noteid: noteid
        },
        {
            headers: authHeader()
        })
        if (response.status === 201) {
            dispatch('getWords', { noteid: noteid })
        }
    },

    async updateWord({ dispatch }, { wordid, editWord, editDef, noteid }) {
        try {
            const res = await axios.patch(API_URL + `/words?wordid=eq.${wordid}`, {
                vocabword: editWord,
                definition: editDef
            },
            {
                headers: authHeader()
            })
            if (res.status === 204) {
                dispatch('getWords', { noteid: noteid })
            }
        } catch (err) {
            if (err.response.status === 404) {
                alert('Word not found')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async deleteWord({ dispatch }, { wordid, noteid }) {
        const res = await axios.delete(API_URL + '/words?wordid=eq.' + wordid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getWords', { noteid: noteid })
        }
    },

    async addPlan({ dispatch }, { date, time, amount, priority, noteid}) {
        const res = await axios.post(API_URL + '/study_plan', {
            studydate: date + 'T00:00:00.000Z',
            timeamount: amount,
            prioritylevel: priority,
            noteid: noteid,
            time: time
        },
        {
            headers: authHeader()
        })
        if (res.status === 201) {
            dispatch('getStudyPlans', { noteid })
        }
    },

    async updatePlan({ dispatch }, { planid, completed, noteid }) {
        const res = await axios.patch(API_URL + '/study_plan?planid=eq.' + planid, {
            studycompleted: completed
        },
        {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getStudyPlans', { noteid })
        }
    },

    async getAllPlans({ commit, state }) {
        try {
            const res = await axios.get(API_URL + `/see_all_plans?userid=eq.${state.user.user_id}&studycompleted=eq.false`)
            if (res.status === 200) {
                for (let i = 0; i < res.data.length; ++i) {
                    let timeOfDay = " AM"
                    let time = res.data[i].time
                    time = time.split(':')
                    if (parseInt(time[0]) > 12) {
                        time[0] = parseInt(time[0]) - 12
                        timeOfDay = " PM"
                    }
                    if (timeOfDay === " AM" && parseInt(time[0]) < 10) time[0] = parseInt(time[0])
                    res.data[i].time = time[0].toString() + ":" + time[1] + timeOfDay
                    let date = res.data[i].studydate
                    res.data[i].studydate = new Date(date).toDateString()
                }
                await commit('allPlans', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('allPlans', [])
            }
        }
    },

    async getStudyPlans({ commit }, { noteid }) {
        try {
            const res = await axios.get(API_URL + '/see_study_plans?noteid=eq.' + noteid)
            if (res.status === 200) {
                for (let i = 0; i < res.data.length; ++i) {
                    let timeOfDay = " AM"
                    let time = res.data[i].time
                    time = time.split(':')
                    if (parseInt(time[0]) > 12) {
                        time[0] = parseInt(time[0]) - 12
                        timeOfDay = " PM"
                    }
                    if (timeOfDay === " AM" && parseInt(time[0]) < 10) time[0] = parseInt(time[0])
                    res.data[i].time = time[0].toString() + ":" + time[1] + timeOfDay
                    let date = res.data[i].studydate
                    res.data[i].studydate = new Date(date).toDateString()
                }
                await localStorage.setItem('studyPlans', JSON.stringify(res.data))
                await commit('studyPlans', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('studyPlans', [])
                localStorage.setItem('studyPlans', JSON.stringify([]))
            }
        }
    },

    async deletePlan({ dispatch }, { planid, noteid }) {
        const res = await axios.delete(API_URL + '/study_plan?planid=eq.' + planid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            if (noteid === null) dispatch('getAllPlans')
            else dispatch('getStudyPlans', { noteid: noteid })
        }
    },

    async updatePass({ dispatch, state }, { newPass, currentPass }) {
        try {
            const res = await axios.get(API_URL + '/user?userid=eq.' + state.user.user_id)
            if (await matchPassword(currentPass, res.data[0].password)) {
                const response = await axios.patch(API_URL + '/user?userid=eq.' + state.user.user_id, {
                    password: await encryptPassword(newPass)
                },
                {
                    headers: authHeader()
                })
                if (response.status === 204) {
                    dispatch('userData')
                    alert("Your password has been updated")
                }
            }
            else { alert("The current password you entered is incorrect") }
        } catch(err) {
            if (err.response.status === 400 || err.response.status === 404) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async signup({ dispatch }, { firstname, lastname, email, password }) {
        try {
            email = email.toLowerCase()
            const response = await axios.post(API_URL + '/rpc/signup', {
                firstname: firstname, lastname: lastname,
                email: email, password: await encryptPassword(password)
            })
            if (response.status === 200) {
                dispatch('login', {
                    email: email,
                    password: password
                })
            }
        } catch(error) {
            if (error.response.status === 409) alert('An account with that email already exists')
            else alert('Something went wrong, please refresh the page and try again.')
        }
    },

    async toggleLoginDialog({ commit, state }) {
        await commit('toggleLoginDialog', !state.showLoginDialog)
    },

    async login ({ dispatch, commit }, { email, password }) {
        try {
            email = email.toLowerCase()
            const res = await axios.get(API_URL + `/user?email=eq.${email}`)
            if (res.status === 200 && res.data.length > 0) {
                if (await matchPassword(password, res.data[0].password)) {
                    try {
                        const response = await axios.post(API_URL + "/rpc/login", {
                            email: email,
                            password: res.data[0].password
                        },
                        {
                            headers: authHeader()
                        }
                        );
                        if (response.status === 200) {
                            setJwtToken(response.data[0].token)
                            await commit('setUser', getUserIdFromToken(getJwtToken()))
                            dispatch('userData')
                            dispatch('orgs')
                            commit('toggleLoginDialog', false)
                            this.$router.push('/')
                        }
                    } catch(error) {
                        if (error) {
                            if (error.response.status === 400) {
                                alert('Something went wrong, please refresh the page and try again.')
                            }
                        }
                    }
                } else {
                    alert('The password you entered was incorrect.')
                }
            } else if (res.data.length === 0) {
                alert('No user found with that email.')
            }
        } catch(err) {
            if (err.response.status === 404) {
                alert('No user found with that email.')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again.')
            }
        }
    },

    async logout({ commit }) {
        commit('setCollections', [])
        commit('setNotes', [])
        commit('currentNote', {})
        commit('studyPlans', [])
        commit('newOrg', false)
        commit('newCollection', false)
        commit('newNote', false)
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
        const response = await axios.delete(API_URL + `/part_of?orgid=eq.${orgid}&userid=eq.${state.user.user_id}`, {
            headers: authHeader()
        })
        if (response.status === 204) {
            dispatch('orgs')
        }
    },

    async deleteCollection({ dispatch }, { collectionid, orgid }) {
        const response = await axios.delete(API_URL + `/collection?collectionid=eq.${collectionid}`, {
            headers: authHeader()
        })
        if (response.status === 204) {
            dispatch('collections', { orgid: orgid })
        }
    },

    async deleteNote({ dispatch }, { noteid, collectionid }) {
        const response = await axios.delete(API_URL + `/note?noteid=eq.${noteid}`, {
            headers: authHeader()
        })
        if (response.status === 204) {
            if (collectionid === undefined) await dispatch('loadAdminData')
            else await dispatch('notes', { collectionid: collectionid })
        }
    },

    async deleteAccount({ state }) {
        const res = await axios.delete(API_URL + '/user?userid=eq.' + state.user.user_id, {
            headers: authHeader()
        })
        if (res.status === 204) {
            deleteJwtToken()
            this.$router.push('/login')
            alert("Your account has been deleted")
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
