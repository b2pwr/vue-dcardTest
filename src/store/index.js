import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const BASE_URL = 'https://api.github.com/search/repositories';

Vue.use(Vuex);

export const GET_REPOS_SUCCESS = 'GET_REPOS_SUCCESS';
export const GET_REPOS_FAILED = 'GET_REPOS_FAILED';
export const INPUT_CHANGED = 'INPUT_CHANGED';
export const IS_SEARCHING = 'IS_SEARCHING';
export const LOAD_MORE = 'LOAD_MORE';

export default new Vuex.Store({
  modules: {
    searchText: {
      namespaced: true,
      state: {
        keywords: '',
        repos: [],
        nextPage: 1,
        lastPage: 1,
        isSearching: false,
        error: null,
      },
      getters: {
        getSearchText (state) {
          return state.keywords;
        },
      },
      // in react, [action]
      mutations: {
        [INPUT_CHANGED](state, keywords) {
          state.repos = [];
          state.nextPage = 1;
          state.keywords = keywords;
        },
        [IS_SEARCHING](state, { isSearching }) {
          state.isSearching = isSearching;
        },
        [GET_REPOS_SUCCESS](state, { data, isSearching }) {
          state.repos = state.repos.concat(data.data.items);
          state.isSearching = isSearching;
          state.nextPage += 1;
          state.lastPage = data.headers.link ? data.headers.link.split(',').find(link => link.includes('rel="last"')).match(/page=(\d*)/)[1] : 1;
        },
        [GET_REPOS_FAILED](state, { error, isSearching }) {
          state.isSearching = isSearching;
          state.error = error;
        }
      },
      actions: {
        async [INPUT_CHANGED]({ commit }, { keywords, nextPage }) {
          commit(INPUT_CHANGED, keywords);
          if(keywords.length > 0) {
            commit(IS_SEARCHING, { isSearching: true });
            try {
              const data = await axios(`${BASE_URL}?q=${keywords}&sort=stars&order=desc&per_page=50&page=${nextPage}`);
              commit(GET_REPOS_SUCCESS, { data, isSearching: false });
            } catch(error) {
              console.log('get repo failed', error);
              commit(GET_REPOS_FAILED, { error, isSearching: false });
            }
          }
        },
        async [LOAD_MORE]({ commit }, { keywords, nextPage }) {
          console.log('load more', keywords, nextPage);
          if(keywords.length > 0) {
            commit(IS_SEARCHING, { isSearching: true });
            try {
              const data = await axios(`${BASE_URL}?q=${keywords}&sort=stars&order=desc&per_page=50&page=${nextPage}`);
              commit(GET_REPOS_SUCCESS, { data, isSearching: false });
            } catch(error) {
              console.log('get repo failed', error);
              commit(GET_REPOS_FAILED, { error, isSearching: false });
            }
          }
        },
      },
    }
  },
})