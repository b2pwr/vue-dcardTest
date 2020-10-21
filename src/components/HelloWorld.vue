<template>
  <v-container>
    <v-list three-line>
      <div v-for="(repo) in repos" :key="repo.id">
        <v-list-item>
          <v-list-item-avatar>
            <v-img :alt="repo.name" :src="repo.owner.avatar_url"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="repo.name"></v-list-item-title>
            <v-list-item-subtitle>{{ repo.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
    <div v-show="error">😰 {{ error }}</div>
    <div class="spinner text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        v-show="isSearching && repos.length > 0"
      />
    </div>
    <div class="observer"></div>
  </v-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { LOAD_MORE } from '../store';

  export default {
    name: 'HelloWorld',
    mounted() {
      const options = {
        root: null, // viewport
        rootMargin: '1880px',
        threshold: 1.0,
      };
      const observer = new IntersectionObserver(
        ([entry]) => {
          if(entry.isIntersecting && this.repos.length > 0) {
            if (!this.isSearching && !(this.nextPage > this.lastPage)) {
              this.loadMore({ keywords: this.keywords, nextPage: this.nextPage });
            }
          }
        },
        options
      );
      observer.observe(document.getElementsByClassName('observer')[0]);
    },
    methods: {
      ...mapActions({
        loadMore: `searchText/${LOAD_MORE}`,
      })
    },
    computed: {
      ...mapState({
        keywords: state => state.searchText.keywords,
        repos: state => state.searchText.repos,
        error: state => state.searchText.error,
        isSearching: state => state.searchText.isSearching,
        nextPage: state => state.searchText.nextPage,

      })
    },
  }
</script>
