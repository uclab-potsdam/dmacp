import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import loadData from './loadData.js';
import loadFromApi from './loadFromApi.js';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    compress: false,
    data: [],
    essayKey: "",
    events: true,
    relations: 'links',
    status: "Waiting",
    selectedMarker: {id: null, type: null, targets: []},
    localDev: true
  },
  mutations: {
    MUTATE_DATA(state, { status, parsedData}) {
      if (status == "Loaded") {
        const dataKeys = Object.keys(parsedData)
        // currently only getting first key, if essays will be compared then needs to be reworked
        const currentKey = dataKeys[0]
        state.essayKey = currentKey
        state.data = parsedData[currentKey]
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
    },
    MUTATE_SELECTED_MARKER(state, marker) {
      state.selectedMarker.id = marker.id
      state.selectedMarker.type = marker.type
      state.selectedMarker.targets = marker.targets === undefined ? [] : marker.targets
    }
  },
  actions: {
    loadingData ({commit, state}) {

      const essayUrl = 'https://content-dev.anthropocene-curriculum.org/wp-json/wp/v2/contribution?slug=combustion-products-as-markers-for-the-anthropocene'
      const paintboxUrl = './data/sample-data.json'

      const localEssay = loadData('./data/Nuclear_Anthropocene.html')
        .then((parsedData) => {
          const status = "Loaded"
          console.log('loading from local')
          commit('MUTATE_DATA', { status, parsedData })
        })

      const promise1 = axios.get(essayUrl).catch(function (error) {
        console.log('Error', error.message)
        if (!error.response) { }
        loadData('./data/Nuclear_Anthropocene.html')
          .then((parsedData) => {
            const status = "Loaded"
            console.log('loading from local', parsedData)
            commit('MUTATE_DATA', { status, parsedData })
          })
      })

      const promise2 = axios.get(paintboxUrl)
      // Remove when loading from ac-frontend
      const essaySource = state.localDev === true ? localEssay : promise1

      Promise.all([essaySource, promise2]).then((responses) => {
          let essay = responses[0]
          let paintbox = responses [1]
          let parsedData = []
          const status = "Loaded"
          loadFromApi(essay.data[0], paintbox.data)
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
    },
    changeSelectedMarker({commit}, marker) {
      commit('MUTATE_SELECTED_MARKER', marker)
    }
  },
  modules: {
  }
})
