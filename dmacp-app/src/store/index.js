import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import loadData from './loadData.js';
import loadFromApi from './loadFromApi.js';

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
    MUTATE_DATA(state, { status, parsedData}) {
      if (status == "Loaded") {
        //console.log('in mutate', parsedData)
        state.data = parsedData
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
    loadingData ({commit}) {
      // loadData('./data/combustion.html')
      //   .then((parsedData) => {
      //     const status = "Loaded"
      //     console.log('!', parsedData)
      //     //commit('MUTATE_DATA', {status, parsedData})
      //   })

      const essayUrl = 'https://content-dev.anthropocene-curriculum.org/wp-json/wp/v2/contribution?slug=combustion-products-as-markers-for-the-anthropocene'

      axios.get(essayUrl)
        .then((response) => {
          let parsedData = []
          const status = "Loaded"
          loadFromApi(response.data[0])
            .then(value => {
              parsedData = value
              commit('MUTATE_DATA', { status, parsedData }) 
            });
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
