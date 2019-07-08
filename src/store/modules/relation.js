import Vue from 'vue'
const relation = {
  state: {
    count: {},
  },
  mutations: {
    increment(state, key) {
      state.count[key] = Date.now()
    }
  },
  actions: {
    increment ({ commit }, key) {
      commit('increment', key)
    }
  }
}

export default relation
