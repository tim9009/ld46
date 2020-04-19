import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameWon: false,
    gameLost: false,
    spaceCamera: null,
    groundCamera: null,
    resources: {
      fuel: 0,
      oxygen: 0
    },
    currentLocations: 0,
    finalLocaiton: 0
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
