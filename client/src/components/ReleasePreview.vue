<template>
  <tr class="table-item">
    <td>
      <router-link :to="`/releases/${release._id}`" class="table-item__title">
        {{ release.artist }} - {{ release.title }}</router-link
      >
    </td>

    <td>
      <router-link
            :to="`/labels/${release.labelID}`"
            class="table-item__labelName"
            >{{ release.labelName }}</router-link
        >
    </td>    

    <td>
        <div v-if="release.labelParent">
            <router-link
            :to="`/labels/${release.labelParent.id}`"
            class="table-item__labelParent"
            >{{ release.labelParent.name }}</router-link
            >
        </div>
    </td>    

    <td>
      <span
        class="tag"
        :class="$getStatusColor(release.statusDiscogs)"
        v-if="release.statusDiscogs"
        >{{ release.statusDiscogs }}</span
      >
    </td>
    <td>
      <span
        class="tag"
        :class="$getStatusColor(release.statusArtist)"
        v-if="release.statusArtist"
        >{{ release.statusArtist }}</span
      >
    </td>    
    <td>
      <span
        class="tag"
        :class="$getStatusColor(release.statusYoutube)"
        v-if="release.statusYoutube"
        >{{ release.statusYoutube }}</span
      >
    </td>
    <td>
      <span
        class="tag"
        :class="$getStatusColor(release.statusVarious)"
        v-if="release.statusVarious"
        >{{ release.statusVarious }}</span
      >
    </td>
    <td>
      <a
        :href="` https://revibed.com/marketplace/${release.onRevibed.id}`"
        class="table-item__youtubeLink"
        target="_blank"
        v-if="release.onRevibed.forSale"
        >{{ release.onRevibed.id }}</a
      >
      <span v-else class="text-grey">
        {{ release.onRevibed.id }}
      </span>
    </td>
  </tr>
</template>
  
  <script>
export default {
  props: ["release"],
  name: "App",
  components: {},
  data() {
    return {
      // youtubes: [],
    };
  },
  async mounted() {},
  methods: {},
  computed: {
    //   youtube() {
    //     return this.$store.getters.getYoutube(this.$route.params.id);
    //   }
  },
  watch: {
    // 'youtube.status': function (oldValue, newValue) {
    //   console.log('status newValue ', oldValue, newValue)
    //   if (newValue !== oldValue) {
    //     this.edityoutube(newValue)
    //   }
    // },
  },
};
</script>
  
  <style lang="scss">
@import "../assets/scss/main.scss";
</style>