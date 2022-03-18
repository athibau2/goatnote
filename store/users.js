import axios from "axios";
import auth from "~/middleware/auth";
import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";


const API_URL = "http://ec2-3-88-53-104.compute-1.amazonaws.com:8000";

export const state = () => ({
    user: getJwtToken(),
    userData: [],
    orgs: [],
    allColls: [],
    collections: [],
    notes: [],
    currentNote: {},
    words: {},
    questions: {},
    links: {},
    makingNewOrg: false,
    makingNewCollection: false,
    makingNewNote: false
  })
  
// mutations should update state
export const mutations = {
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

}

// actions should call mutations
export const actions = {
    async userData({ commit, state }) {
        const response = await axios.get(API_URL + '/see_personal_data')
        if (response.status === 200) {
            const users = response.data
            for (let i = 0; i < users.length; ++i) {
                if (users[i]["email"] === state.user.email) {
                    const currentUser = users[i]
                    commit('setUserData', currentUser)
                    break
                }
            }
        }
    },

    async createOrg({ dispatch  }, { orgname }) {
        const response = await axios.post(API_URL + '/organization', {
            orgname: orgname
        },
        {
            headers: authHeader()
        })
        const org = await axios.get(API_URL + '/organization?orgname=eq.' + orgname)
        const res = await axios.post(API_URL + '/part_of', {
            userid: getUserIdFromToken(getJwtToken()).user_id,
            orgid: org.data[0].orgid
        },
        {
            headers: authHeader()
        })
        dispatch('orgs')
    },

    async createCollection({ dispatch, state }, { collectionname, orgid }) {
        const response = await axios.post(API_URL + '/collection', {
            collectionname: collectionname,
            orgid: orgid,
            userid: state.user.user_id
        },
        {
            headers: authHeader()
        })
        dispatch('collections')
        dispatch('allColls')
    },

    async createNote({ dispatch }, { notename, collectionid }) {
        const response = await axios.post(API_URL + '/note', {
            notename: notename,
            collectionid: collectionid,
        },
        {
            headers: authHeader()
        })
        dispatch('notes')
    },

    async orgs({ commit, state }) {
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

    async notes({ commit, state }, { collectionid }) {
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_notes?email=eq.' + state.user.email + '&collectionid=eq.' + collectionid)
        if (response.status === 200) {
            commit('setNotes', response.data)
        }
    },

    async openNote({ dispatch, commit, state }, { noteid }) {
        localStorage.removeItem('note')
        await commit('currentNote', {})
        const response = await axios.get(API_URL + '/see_note_with_data?noteid=eq.' + noteid)
        if (response.status === 200) {
            await commit('currentNote', response.data[0])
            localStorage.setItem('note', JSON.stringify(state.currentNote))
            dispatch('getWords', { noteid })
            dispatch('getQuestions', { noteid })
            dispatch('getLinks', { noteid })
            this.$router.push('/note')
        }
    },

    async getLinks({ commit, state }, { noteid }) {
        await commit('links', {})
        const links = await axios.get(API_URL + '/see_links?noteid=eq.' + noteid)
        if (links.status === 200) {
            await commit('links', links.data)
            localStorage.setItem('links', JSON.stringify(state.links))
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

    async deleteLink({ dispatch }, { linkid, noteid }) {
        const res = await axios.delete(API_URL + '/links?linkid=eq.' + linkid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getLinks', { noteid: noteid})
        }
    },

    async getQuestions({ commit, state }, { noteid }) {
        await commit('questions', {})
        const questions = await axios.get(API_URL + '/see_questions?noteid=eq.' + noteid)
        if (questions.status === 200) {
            await commit('questions', questions.data)
            localStorage.setItem('questions', JSON.stringify(state.questions))
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

    async deleteQuestion({ dispatch }, { questionid, noteid }) {
        const res = await axios.delete(API_URL + '/questions?questionid=eq.' + questionid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getQuestions', { noteid: noteid})
        }
    },

    async getWords({ commit, state }, { noteid }) {
        await commit('words', {})
        const words = await axios.get(API_URL + '/see_words?noteid=eq.' + noteid)
        if (words.status === 200) {
            await commit('words', words.data)
            localStorage.setItem('words', JSON.stringify(state.words))
        }
    },

    async addWord({ dispatch }, { newWord, newDef, noteid }) {
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

    async deleteWord({ dispatch }, { wordid, noteid }) {
        const res = await axios.delete(API_URL + '/words?wordid=eq.' + wordid, {
            headers: authHeader()
        })
        if (res.status === 204) {
            dispatch('getWords', { noteid: noteid})
        }
    },

    async signup({ dispatch }, { firstname, lastname, email, password }) {
        const response = await axios.post(API_URL + '/rpc/signup', {
            firstname: firstname, lastname: lastname, 
            email: email, password: password
        })
        if (response.status === 200) {
            console.log(response.data)
            dispatch('login', {
                email: email,
                password: password
            })
        }
    },

    async login ({ dispatch, commit }, { email, password }) {
        const response = await axios.post(API_URL + "/rpc/login", { 
            email: email,
            password: password
            },
            {
                headers: authHeader()
            }
        );
        if (response.status === 200) {
            console.log(response.data)
            setJwtToken(response.data[0].token)
            await commit('setUser', getUserIdFromToken(getJwtToken()))
            dispatch('userData')
            dispatch('orgs')
            this.$router.push('/')
        }
    },

    async updatePass({ dispatch, state }, { password }) {
        const response = await axios.put(API_URL + '/user?email=eq.' + state.user.email, {
            password: password
        },
        {
            headers: authHeader()
        })
        if (response.status === 200) {
            dispatch('userData')
        }
    },

    async logout({ commit }) {
        deleteJwtToken()
        localStorage.removeItem('note')
        localStorage.removeItem('words')
        localStorage.removeItem('questions')
        localStorage.removeItem('links')
        await commit('setUser', null)
        this.$router.push('/login')
    }
}

export const getters = {
    isLoggedIn: state => {
        return state.user
    },

    getOrgs: state => {
        return state.orgs
    }
  }

