<template>
  <v-app id="inspire"> 
    <v-card style="position: sticky;top: 0;z-index: 5">
      <v-app-bar
        color="white"
        elevate-on-scroll
        scroll-target="#scroll"
        elevation="3"
      >
        <v-toolbar-title>Github Repositories Search</v-toolbar-title>
        <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer>
        <v-text-field
          hide-details
          append-icon="mdi-database-search"
          :bind="text"
          @input="textChange"
        >
        </v-text-field>
      </v-app-bar>
    </v-card>
    <v-progress-linear
      v-show="isSearching"
      indeterminate
    ></v-progress-linear>
    <v-container id="scroll" style="height: 100%;">
      <HelloWorld />
    </v-container>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import { INPUT_CHANGED } from './store';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  computed: {
    ...mapState({
      text: state => state.searchText.text,
      nextPage: state => state.searchText.nextPage,
      isSearching: state => state.searchText.isSearching,
    })
  },
  methods: {
    textChange: debounce(
      function(keywords) { this.$store.dispatch(`searchText/${INPUT_CHANGED}`, { keywords, nextPage: this.nextPage }) },
      1000
    ),
  }
};
</script>
