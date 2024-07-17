<template>
  <v-main>
    <v-container fill-height fluid>
      <AppBar />
      <router-view />
    </v-container>
  </v-main>
</template>

<script>
import AppBar from "./AppBar.vue";
export default {
  components: {
    AppBar
  },
  data() {
    return {
    };
  },
  async created() {
  },
  watch: {
  },
};
</script>