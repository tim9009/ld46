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
    currentLocation: 0,
    finalLocaiton: 0,
    fuelRequirement: 0,
    shuttleDockedToMothership: true
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
