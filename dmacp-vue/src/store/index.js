import Vue from 'vue'
import Vuex from 'vuex'
import loadData from './loadData.js';
import axios from 'axios';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    data: [],
    status: "Waiting"
  },
  mutations: {
    MUTATE_DATA(state, { status, response}) {
      if (status == "Loaded") {
        // console.log(response)
        state.data = response
        state.status = status
        // console.log('state', state.data)
      }
    }
  },
  actions: {
    async loadingData ({commit}) {
      await loadData('../data/combustion.html')
        .then((response) => { 
          // const data = loadData('@/assets/data/combustion.html')
          console.log('response', response)
          const status = "Loaded"
          commit('MUTATE_DATA', {status, response}) 
        })
      
    }
  },
  modules: {
  }
})
