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
      oxygen: 0,
      scrap: 0,
      mothershipStructure: 100,
      personHealth: 100
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
