<template>
  <v-app>
    <default-view />
  </v-app>
</template>

<script>
import DefaultView from "./View.vue";
export default {
  components: {
    DefaultView
  },
  data() {
    return {
    };
  },
  async created() {
    // await this.$store.dispatch('getAllData')
    // await this.$store.dispatch('getYoutubes')
    // await this.$store.dispatch('getLabels')
    // await this.$store.dispatch('getReleases')
  },
  watch: {
  },
};
</script>

