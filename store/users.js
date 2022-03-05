import axios from "axios";
import { authHeader, getJwtToken, getUserIdFromToken } from "./auth";

const API_URL = "http://ec2-54-91-199-105.compute-1.amazonaws.com:8000";

export const state = () => ({
    list: [],
  })
  
// mutations should update state
export const mutations = {
  add(state, text) {
    state.list.push({
      text,
      done: false
    })
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle(state, todo) {
    todo.done = !todo.done
  }
}

// actions should call mutations
export const actions = {
  async getUsers ({ commit, state }) {
    const users = await this.$axios.get(API_URL + '/admin_see_all_users')
  },
}
