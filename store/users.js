import axios from "axios";
import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";

const API_URL = "http://ec2-3-88-53-104.compute-1.amazonaws.com:8000";

export const state = () => ({
    user: getJwtToken(),
    userData: [],
    orgs: [],
    collections: [],
  })
  
// mutations should update state
export const mutations = {
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

    clearCollections(state, data) {
        state.collections = data
    }

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
        commit('clearCollections', [])
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
            //this.$auth.$storage.setUniversal('user', response.data.user, true)
            dispatch('orgs')
            this.$router.push('/')
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
