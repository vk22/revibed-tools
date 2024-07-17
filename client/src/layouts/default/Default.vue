<template>
  <!-- <v-app>
    <default-bar />
    <default-view />
  </v-app> -->
  <v-layout class="rounded rounded-md">
    <!-- <v-app-bar title="Application bar"></v-app-bar> -->
    <Sidebar></Sidebar>
    <default-view />
  </v-layout>
</template>

<script>
import DefaultBar from "./AppBar.vue";
import Sidebar from "./Sidebar.vue";
import DefaultView from "./View.vue";
export default {
  components: {
    DefaultBar,
    DefaultView,
    Sidebar
  },
  data() {
    return {
    };
  },
  async created() {
    await this.$store.dispatch('getAllData')
    // await this.$store.dispatch('getYoutubes')
    // await this.$store.dispatch('getLabels')
    // await this.$store.dispatch('getReleases')
  },
  watch: {
  },
};
</script>

