import axios from "axios";
import { authHeader, deleteJwtToken, getJwtToken, getUserIdFromToken, setJwtToken } from "./auth";

const API_URL = "http://ec2-3-88-53-104.compute-1.amazonaws.com:8000";

export const state = () => ({
    user: null,
  })
  
// mutations should update state
export const mutations = {
    setUser(state, user) {
        state.user = user
    }
}

// actions should call mutations
export const actions = {
  async login ({ commit }) {
    const response = await axios.post(API_URL + "/rpc/login", { 
        email: 'icook8662@gmail.com',
        password: 'password'
        },
        {
            headers: authHeader()
        }
    );
    if (response.status === 200) {
        console.log(response.data)
        setJwtToken(response.data[0].token)
        commit('setUser', getUserIdFromToken(getJwtToken()))
    }
  },

  async logout({ commit }) {
      deleteJwtToken()
      commit('setUser', null)
  }
}
