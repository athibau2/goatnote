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
    makingNewNote: false,
    saving: "Saved"
  })
  
// mutations should update state
export const mutations = {
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

}

// actions should call mutations
export const actions = {
    async userData({ commit, state }) {
        const response = await axios.get(API_URL + '/see_personal_data?email=eq.' + state.user.email)
        if (response.status === 200) {
            commit('setUserData', response.data[0])
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
        dispatch('collections', { orgid })
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
        dispatch('notes', { collectionid })
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

    async notes({ commit, state }, { collectionid }) {
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_notes?email=eq.' + state.user.email + '&collectionid=eq.' + collectionid)
        if (response.status === 200) {
            commit('setNotes', response.data)
        }
    },

    async openNote({ dispatch, commit, state }, { noteid }) {
        localStorage.removeItem('note')
        localStorage.removeItem('prettyDate')
        await commit('currentNote', {})
        const response = await axios.get(API_URL + '/see_note_with_data?noteid=eq.' + noteid)
        if (response.status === 200) {
            let prettyDate = await parseDate(response.data[0].notedate)
            localStorage.setItem('prettyDate', prettyDate)
            await commit('currentNote', response.data[0])
            localStorage.setItem('note', JSON.stringify(state.currentNote))
            dispatch('getWords', { noteid })
            dispatch('getQuestions', { noteid })
            dispatch('getLinks', { noteid })
            this.$router.push('/note')
        }
    },

    async saveNotes({ dispatch, commit }, { noteText, noteid }) {
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

    async updatePass({ dispatch, state }, { newPass, currentPass }) {
        const res = await axios.get(API_URL + '/user?userid=eq.' + state.user.user_id)
        if (res.data.password === currentPass) {
            const response = await axios.patch(API_URL + '/user?userid=eq.' + state.user.user_id, {
                password: newPass
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
    },

    async signup({ dispatch }, { firstname, lastname, email, password }) {
        const response = await axios.post(API_URL + '/rpc/signup', {
            firstname: firstname, lastname: lastname, 
            email: email, password: password
        })
        if (response.status === 200) {
            alert("Account created successfully")
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
            setJwtToken(response.data[0].token)
            await commit('setUser', getUserIdFromToken(getJwtToken()))
            dispatch('userData')
            dispatch('orgs')
            this.$router.push('/')
        }
    },

    async logout({ commit }) {
        commit('setCollections', [])
        commit('setNotes', [])
        commit('currentNote', {})
        commit('newOrg', false)
        commit('newCollection', false)
        commit('newNote', false)
        localStorage.removeItem('note')
        localStorage.removeItem('words')
        localStorage.removeItem('questions')
        localStorage.removeItem('links')
        deleteJwtToken()
        await commit('setUser', null)
        this.$router.push('/login')
    },

    async leaveOrg({ dispatch, state }, { orgid }) {
        const collections = await axios.get(API_URL + `/see_collections?userid=eq.${state.user.user_id}&orgid=eq.${orgid}`)
        let notes = []
        for (let i = 0; i < collections.data.length; ++i) {
            let temp = await axios.get(API_URL + '/see_notes?collectionid=eq.' + collections.data[i].collectionid)
            for (let j = 0; j < temp.data.length; ++j) {
                notes.push(temp.data[j])
            }
        }
        let words = []
        let questions = []
        let links = []
        for (let i = 0; i < notes.length; ++i) {
            let w = await axios.get(API_URL + '/see_words?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < w.data.length; ++j) {
                words.push(w.data[j])
            }
            let q = await axios.get(API_URL + '/see_questions?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < q.data.length; ++j) {
                questions.push(q.data[j])
            }
            let l = await axios.get(API_URL + '/see_links?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < l.data.length; ++j) {
                links.push(l.data[j])
            }
        }

        for (let i = 0; i < links.length; ++i) { await axios.delete(API_URL + '/links?linkid=eq.' + links[i].linkid) }
        for (let i = 0; i < questions.length; ++i) { await axios.delete(API_URL + '/questions?questionid=eq.' + questions[i].questionid) }
        for (let i = 0; i < words.length; ++i) { await axios.delete(API_URL + '/words?wordid=eq.' + words[i].wordid) }
        for (let i = 0; i < notes.length; ++i) { await axios.delete(API_URL + '/note?noteid=eq.' + notes[i].noteid) }
        for (let i = 0; i < collections.data.length; ++i) { await axios.delete(API_URL + '/collection?collectionid=eq.' + collections.data[i].collectionid) }


        const response = await axios.delete(API_URL + `/part_of?orgid=eq.${orgid}&userid=eq.${state.user.user_id}`)
        if (response.status === 204) {
            dispatch('orgs')
        }
    },

    async deleteCollection({ dispatch }, { collectionid, orgid }) {
        let notes = await axios.get(API_URL + '/see_notes?collectionid=eq.' + collectionid)
        notes = notes.data
        let words = []
        let questions = []
        let links = []

        for (let i = 0; i < notes.length; ++i) {
            let w = await axios.get(API_URL + '/see_words?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < w.data.length; ++j) {
                words.push(w.data[j])
            }
            let q = await axios.get(API_URL + '/see_questions?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < q.data.length; ++j) {
                questions.push(q.data[j])
            }
            let l = await axios.get(API_URL + '/see_links?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < l.data.length; ++j) {
                links.push(l.data[j])
            }
        }

        for (let i = 0; i < links.length; ++i) { await axios.delete(API_URL + '/links?linkid=eq.' + links[i].linkid) }
        for (let i = 0; i < questions.length; ++i) { await axios.delete(API_URL + '/questions?questionid=eq.' + questions[i].questionid) }
        for (let i = 0; i < words.length; ++i) { await axios.delete(API_URL + '/words?wordid=eq.' + words[i].wordid) }
        for (let i = 0; i < notes.length; ++i) { await axios.delete(API_URL + '/note?noteid=eq.' + notes[i].noteid) }

        const response = await axios.delete(API_URL + `/collection?collectionid=eq.${collectionid}`)
        if (response.status === 204) {
            dispatch('collections', { orgid: orgid })
        }
    },

    async deleteNote({ dispatch }, { noteid, collectionid }) {
        let words = await axios.get(API_URL + '/words?noteid=eq.' + noteid)
        let questions = await axios.get(API_URL + '/questions?noteid=eq.' + noteid)
        let links = await axios.get(API_URL + '/links?noteid=eq.' + noteid)
        words = words.data
        questions = questions.data
        links = links.data

        for (let i = 0; i < links.length; ++i) { await axios.delete(API_URL + '/links?linkid=eq.' + links[i].linkid) }
        for (let i = 0; i < questions.length; ++i) { await axios.delete(API_URL + '/questions?questionid=eq.' + questions[i].questionid) }
        for (let i = 0; i < words.length; ++i) { await axios.delete(API_URL + '/words?wordid=eq.' + words[i].wordid) }

        const response = await axios.delete(API_URL + `/note?noteid=eq.${noteid}`)
        if (response.status === 204) {
            dispatch('notes', { collectionid: collectionid })
        }
    },

    async deleteAccount({ state }) {
        const collections = await axios.get(API_URL + '/see_collections?userid=eq.' + state.user.user_id)
        let notes = []
        for (let i = 0; i < collections.data.length; ++i) {
            let temp = await axios.get(API_URL + '/see_notes?collectionid=eq.' + collections.data[i].collectionid)
            for (let j = 0; j < temp.data.length; ++j) {
                notes.push(temp.data[j])
            }
        }
        let words = []
        let questions = []
        let links = []
        for (let i = 0; i < notes.length; ++i) {
            let w = await axios.get(API_URL + '/see_words?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < w.data.length; ++j) {
                words.push(w.data[j])
            }
            let q = await axios.get(API_URL + '/see_questions?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < q.data.length; ++j) {
                questions.push(q.data[j])
            }
            let l = await axios.get(API_URL + '/see_links?noteid=eq.' + notes[i].noteid)
            for (let j = 0; j < l.data.length; ++j) {
                links.push(l.data[j])
            }
        }

        for (let i = 0; i < links.length; ++i) { await axios.delete(API_URL + '/links?linkid=eq.' + links[i].linkid) }
        for (let i = 0; i < questions.length; ++i) { await axios.delete(API_URL + '/questions?questionid=eq.' + questions[i].questionid) }
        for (let i = 0; i < words.length; ++i) { await axios.delete(API_URL + '/words?wordid=eq.' + words[i].wordid) }
        for (let i = 0; i < notes.length; ++i) { await axios.delete(API_URL + '/note?noteid=eq.' + notes[i].noteid) }
        for (let i = 0; i < collections.data.length; ++i) { await axios.delete(API_URL + '/collection?collectionid=eq.' + collections.data[i].collectionid) }

        await axios.delete(API_URL + '/part_of?userid=eq.' + state.user.user_id)
        const res = await axios.delete(API_URL + '/user?userid=eq.' + state.user.user_id)
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

