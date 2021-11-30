import Vue from 'vue'
import Vuex from 'vuex'
import loadData from '../assets/js/loadData.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    MUTATE_DATA (state, data) {
      state.data = data
    }
  },
  actions: {
    loadData ({state, commit}) {
      const loadedData = await loadData('../assets/data/combustion.html');
      commit('MUTATE_DATA', loadedData)
    }
  },
  modules: {
  }
})
