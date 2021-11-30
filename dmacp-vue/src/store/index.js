import Vue from 'vue'
import Vuex from 'vuex'
import loadData from './loadData.js';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    MUTATE_DATA(state, { status, response}) {
      if (status == "Loaded") {
        state.data = response
        // console.log('state', state.data)
      }
    }
  },
  actions: {
    async loadingData ({state, commit}) {


      await loadData('../data/combustion.html')
        .then((response) => { 
          // const data = loadData('@/assets/data/combustion.html')
          // console.log('response', response)
          const status = "Loaded"
          commit('MUTATE_DATA', {status, response}) 
        })
      
    }
  },
  modules: {
  }
})
