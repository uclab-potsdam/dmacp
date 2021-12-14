import Vue from 'vue'
import Vuex from 'vuex'
import loadData from './loadData.js';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    data: [],
    status: "Waiting",
    compress: false,
    events: true,
    relations: 'links'
  },
  mutations: {
    MUTATE_DATA(state, { status, response}) {
      if (status == "Loaded") {
        state.data = response
        state.status = status
      }
    },
    MUTATE_VIS_PROPERTY (state, label) {
      if (label === 'Links' || label === 'Signature') {
        state.relations = state.relations === 'signature' ? 'links' : 'signature'
      } else {
        state[label] = !state[label]
        if (label === 'compress') {
          state.relations = 'links'
        }
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
    },
    changeVisStatus ({commit, dispatch}, label) {
      // Re-running action that loads data.
      dispatch('loadingData')
      commit('MUTATE_VIS_PROPERTY', label)
    }
  },
  modules: {
  }
})
