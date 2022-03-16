import axios from "axios";
import auth from "~/middleware/auth";
import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";


const API_URL = "http://ec2-3-88-53-104.compute-1.amazonaws.com:8000";

export const state = () => ({
    user: getJwtToken(),
    userData: [],
    orgs: [],
    collections: [],
    notes: [],
    currentNote: {},
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

    setCollections(state, data) {
        state.collections = data
    },

    setNotes(state, data) {
        state.notes = data
    },

    currentNote(state, data) {
        state.currentNote = data
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

    async createOrg({ dispatch, commit, state }, { orgname }) {
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

    async orgs({ commit, state }) {
        let userOrgs = []
        const response = await axios.get(API_URL + '/see_orgs')
        if (response.status === 200) {
            const orgs = response.data
            for (let i = 0; i < orgs.length; ++i) {
                if (orgs[i]["email"] === state.user.email) {
                    userOrgs.push(orgs[i])
                }
            }
            console.log(userOrgs)
            commit('setOrgs', userOrgs)
        }
    },

    async collections ({ commit, state }, { orgid }) {
        commit('setCollections', [])
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_collections')
        if (response.status === 200) {
            let collections = response.data
            let temp = []
            for (let i = 0; i < collections.length; ++i) {
                if (collections[i]["email"] === state.user.email) {
                    temp.push(collections[i])
                }
            }
            collections = temp
            temp = []
            for (let i = 0; i < collections.length; ++i) {
                if (collections[i]["orgid"] === orgid) {
                    temp.push(collections[i])
                }
            }
            commit('setCollections', temp)
            temp = []
        }
    },

    async notes({ commit, state }, { collectionid }) {
        commit('setNotes', [])
        const response = await axios.get(API_URL + '/see_notes')
        if (response.status === 200) {
            let notes = response.data
            let temp = []
            for (let i = 0; i < notes.length; ++i) {
                if (notes[i]["userid"] === state.userData.userid) {
                    temp.push(notes[i])
                }
            }
            notes = temp
            temp = []
            for (let i = 0; i < notes.length; ++i) {
                if (notes[i]["collectionid"] === collectionid) {
                    temp.push(notes[i])
                }
            }
            commit('setNotes', temp)
            temp = []
        }
    },

    async openNote({ commit }, { noteid }) {
        commit('currentNote', {})
        const response = await axios.get(API_URL + '/see_note_with_data')
        if (response.status === 200) {
            let notes = response.data
            for (let i = 0; i < notes.length; ++i) {
                if (notes[i]["noteid"] === noteid) {
                    commit('currentNote', notes[i])
                    break
                }
            }
            this.$router.push('/note')
        }
    },

    async signup({ dispatch, commit }, { firstname, lastname, email, password }) {
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

