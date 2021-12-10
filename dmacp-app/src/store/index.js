import Vue from 'vue'
import Vuex from 'vuex'
import loadData from './loadData.js';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    data: [],
    status: "Waiting"
  },
  mutations: {
    MUTATE_DATA(state, { status, response}) {
      if (status == "Loaded") {
        state.data = response
        state.status = status
      }
    }
  },
  actions: {
    async loadingData ({commit}) {
      await loadData('./data/combustion.html')
        .then((response) => { 
          const status = "Loaded"
          commit('MUTATE_DATA', {status, response}) 
        })
      
    }
  },
  modules: {
  }
})
