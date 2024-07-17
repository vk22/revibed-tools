<template>

  <v-responsive class="align-top fill-height" v-if="allDataReady">
    <v-row class="mb-5">
      <v-col>
        <h2>Releases Not Goods</h2>
      </v-col>
    </v-row>
    <!-- <div> {{ sortBy }}</div> -->

    <div class="table-block">
      <v-row>
        <v-col>
          <v-card flat>
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                hide-details
                density="compact"
              ></v-text-field>
            </template>

            <v-data-table
             v-model:sort-by="sortBy"
              v-model="selected"
              :headers="headers"
              :items="releases"
              :search="search"
              items-per-page="200"
              show-select
              item-value="_id"
              v-model:page="pageNum"
              :show-current-page="true"
              @click="tableClick"
            >

            <!-- <template #[`item.data-table-select`]="{ item, isSelected }">
              <v-checkbox
                :value="isSelected"
                color="primary"
                :ripple="false"
                @input="setSelected(item, isSelected)"
              />

            </template> -->

              <template v-slot:item.title="{ item }">
                <router-link
                  :to="{ name: 'ReleasePage', params: { id: item._id } }"
                  class="table-item__title"
                  :class="{'text-grey': item.type!=='goods'}"
                  >{{ item.title }}</router-link
                >
              </template>

            
              <template v-slot:item.artist="{ item }">
                <router-link
                  v-if="item.artists[0]"
                  :to="{ name: 'ArtistPage', params: { id: item.artists[0].id } }"
                  class="table-item__title"
                  :class="{'text-grey': item.type!=='goods'}"
                  >{{ item.artist }}</router-link
                >
                <div v-else>{{ item.artist }}</div>
              </template>


              <template v-slot:item.releaseID="{ item }">
                <a
                  :href="`https://www.discogs.com/release/${item.releaseID}`"
                  class="table-item__releaseID"
                  target="_blank"
                  >{{ item.releaseID }}</a
                >
              </template>

              <template v-slot:item.labelName="{ item }">
                <router-link
                  :to="`/labels/${item.labelID}`"
                  class="table-item__labelName"
                  >{{ item.labelName }}</router-link
                >
              </template>

              <template v-slot:item.labelParent="{ item }">
                <div v-if="item.labelParent">
                  <router-link
                    :to="`/labels/${item.labelParent.id}`"
                    class="table-item__labelParent"
                    >{{ item.labelParent.name }}</router-link
                  >
                </div>
              </template>

              <template v-slot:item.youtubeVideoID="{ item }">
                <a
                  :href="`https://www.youtube.com/watch?v=${item.youtubeVideoID}`"
                  class="table-item__youtubeLink"
                  target="_blank"
                  v-if="item.youtubeVideoID"
                  >link</a
                >
              </template>

              <template v-slot:item.youtubeCopyrightOwners="{ item }">
                <div v-if="item.youtubeCopyrightOwners">
                  <span
                    v-for="(item, index) in item.youtubeCopyrightOwners"
                    :key="index"
                  >
                    {{ item.distributor }} + {{ item.label }}<span>, </span>
                  </span>
                </div>
              </template>

              <template v-slot:item.onRevibed="{ item }">
                <a
                  :href="` https://revibed.com/marketplace/${item.onRevibed.id}`"
                  class="table-item__youtubeLink"
                  target="_blank"
                  v-if="item.onRevibed.forSale"
                  >{{ item.onRevibed.id }}</a
                >
                <span v-else class="text-grey">
                  {{ item.onRevibed.id }}
                </span>
              </template>

              <template v-slot:item.updated="{ item }">
                {{ formatDateEn(item.updated) }}
              </template>

              <template v-slot:item.statusDiscogs="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusDiscogs)"
                  v-if="item.statusDiscogs"
                  >{{ item.statusDiscogs }}</span
                >
              </template>

              <template v-slot:item.statusArtist="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusArtist)"
                  v-if="item.statusArtist"
                  >{{ item.statusArtist }}</span
                >
              </template>

              <template v-slot:item.statusYoutube="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusYoutube)"
                  v-if="item.statusYoutube"
                  >{{ item.statusYoutube }}</span
                >
              </template>

              <template v-slot:item.statusDistributor="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusDistributor)"
                  v-if="item.statusDistributor"
                  >{{ item.statusDistributor }}</span
                >
              </template>

              <template v-slot:item.statusOwner="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusOwner)"
                  v-if="item.statusOwner"
                  >{{ item.statusOwner }}</span
                >
              </template>

              <template v-slot:item.statusMain="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusMain)"
                  v-if="item.statusMain"
                  >{{ item.statusMain }}</span
                >
              </template>

              <template v-slot:item.statusVarious="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.statusVarious)"
                  v-if="item.statusVarious"
                  >{{ item.statusVarious }}</span
                >
              </template>

              <template v-slot:item.status="{ item }">
                <span
                  class="tag"
                  :class="$getStatusColor(item.status)"
                  v-if="item.status"
                  >{{ item.status }}</span
                >
              </template>
              
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-responsive>
  <v-responsive class="align-center fill-height" v-else>
    <div class="main-loader text-center">
      <v-progress-circular indeterminate color="#111"></v-progress-circular>
    </div>
  </v-responsive>
</template>

<script>
import CustomSelect from "@/components/CustomSelect.vue";
import FilterTracks from "@/components/FilterTracks.vue";
export default {
  name: "App",
  components: {
    CustomSelect,
    FilterTracks
  },
  data() {
    return {
      // releases: [],
      checkReleasePanelIsOpen: false,
      discogsLink: undefined,
      discogsLinkReleaseID: null,
      newReleaseResult: undefined,
      addReleasePanelIsOpen: false,
      addReleaseData: {
        releaseID: undefined,
        type: 'goods',
        source: 'No'
      },
      releasesTypes: ['goods', 'preorder', 'openToBuy'],
      sources: ['Anton', 'Revibed', 'No'],
      selected: [],
      releasesFiltered: [],
      search: "",
      description: "",
      title: "",
      readyToShow: false,
      releasesOnPage: [],
      releasesInStoreFiltered: [],
      releasesToAddOnPage: [],
      releasesForGettingCount: 50,
      releasesOnPageCount: 0,
      headers: [
        { key: "title", title: "Title" },
        { key: "artist", title: "Artist" },
        
        { key: "releaseID", title: "Discogs Release" },
        { key: "source", title: "Source" },
        { key: "youtubeVideoID", title: "Youtube Link" },
        {
          key: "youtubeCopyrightOwnersString.distributor",
          title: "Youtube (Distributor)",
        },
        { key: "youtubeCopyrightOwnersString.label", title: "Youtube (Owners)" },
        { key: "labelName", title: "Discogs Label" },
        { key: "labelParent", title: "Discogs Parent Label" },
        
        { key: "status", title: "Release" },
        { key: "statusDiscogs", title: "Discogs" },
        { key: "statusArtist", title: "Artist" },
        { key: "statusYoutube", title: "Youtube" },
        // { key: "statusDistributor", title: "Distributor" },
        // { key: "statusOwner", title: "Owner" },
        { key: "statusMain", title: "General" },
        { key: "onRevibed", title: "Revibed" },
        { key: "updated", title: "Date" }
        
      ],
      //sortBy: [{ key: "updated", order: "desc" }],
    };
  },
  async mounted() {
    //window.addEventListener('scroll', this.handleScroll)
    //this.$store.commit('getRipsByPage', 'start')
    // setTimeout(() => {
    //   if (this.releases) {
    //     this.getreleasesByPage(this.releases, 'start')
    //   }
    // }, 2000);
    // if (this.releases) {
    //     this.getreleasesByPage(this.releases, 'start')
    // }
  },
  methods: {
    setSelected() {

    },
    tableClick() {
      console.log('tableClick ')
      this.isHuman = true
    },
    getreleasesByPage(releasesInStore, action) {
      if (action !== "scroll") {
        this.releasesOnPageCount = 0;
        this.releasesForGettingCount = 50;
      }
      this.releasesToAddOnPage = releasesInStore.slice(
        this.releasesOnPageCount,
        this.releasesOnPageCount + this.releasesForGettingCount
      );
      this.releasesOnPageCount =
        this.releasesOnPageCount + this.releasesForGettingCount;
      if (!this.releasesOnPage.length) {
        this.releasesOnPage = [].concat(this.releasesToAddOnPage);
      } else {
        if (action === "scroll") {
          this.releasesOnPage = this.releasesOnPage.concat(
            this.releasesToAddOnPage
          );
        } else {
          this.releasesOnPage = [].concat(this.releasesToAddOnPage);
        }
      }
    },
    handleScroll() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        console.log("подгрузка");
        //this.$store.commit('getreleasesByPage', 'scroll')
        this.getreleasesByPage(this.releases, "scroll");
      }
    },
    formatDateEn(date) {
      //console.log('formatDate locale ', state.locale)
      var monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      date = new Date(date);
      const dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
      const MM = monthsArr[date.getMonth()];
      const yyyy = date.getFullYear();
      return dd + " " + MM + " " + yyyy;
    },
    async exportReleases() {
      await this.$store.dispatch("exportReleases", this.selected);
    },
    async removeFromRevibedMany() {
      await this.$store.dispatch("removeFromRevibedMany", this.selected);
    },
    async checkRelease() {
      this.discogsLinkReleaseID = this.parseDiscogsLink()
      if (!this.discogsLinkReleaseID) return
      this.newReleaseResult = await this.$store.dispatch("checkRelease", this.discogsLinkReleaseID);
    },
    parseDiscogsLink(link) {
      const arr = this.discogsLink.split('/')
      const releaseIndex = arr.indexOf('release')
      if (releaseIndex < 0) {
        console.log('Incorrect link')
        alert('Incorrect link')
      } else {
        const idIndex = releaseIndex + 1
        const id = arr[idIndex].split('-')[0]
        return id
      }
    },
    closeCheckReleasePanel() {
      this.checkReleasePanelIsOpen = false; 
      this.newReleaseResult = undefined; 
      this.discogsLink = undefined;
    },
    closeAddReleasePanel() {
      this.addReleasePanelIsOpen = false; 
      this.discogsLink = undefined;
    },
    changeReleaseType(event) {
      if (event) {
        console.log("changeReleaseType ", event);      
        this.addReleaseData.type = event
      }
    },
    changeReleaseSources(event) {
      if (event) {
        console.log("changeReleaseSources ", event);      
        this.addReleaseData.source = event
      }
    },
    async addRelease() {
      this.addReleaseData.releaseID = this.parseDiscogsLink()
      if (!this.addReleaseData.releaseID) return
      await this.$store.dispatch("addRelease", this.addReleaseData);
      this.closeAddReleasePanel()
    },
  },
  computed: {
    sortBy: {
      get(){
        return this.$store.getters.getTableState({name: 'releases', type: 'sortBy'})
      },
      set(value){
        this.$store.commit('setTableState', {name: 'releases', type: 'sortBy', value: value})
      }
    },
    pageNum: {
      get(){
        return this.$store.getters.getTableState({name: 'releases', type: 'pageNum'})
      },
      set(value){
        if (this.isHuman) {
          this.$store.commit('setTableState', {name: 'releases', type: 'pageNum', value: value})
        } else {
          setTimeout(() => {
            if (this.isHuman) {
              this.$store.commit('setTableState', {name: 'releases', type: 'pageNum', value: value})
            }
          }, 250);
        }
      }
    },
    pageType() {
      return this.$route.fullPath.split('/')[1]
    },
    allReleasesCount() {
      return this.$store.getters.getAllReleases.length;
    },
    releases() {
      return this.$store.getters.getReleasesNotGoods();
    },
    onYoutubeCount() {
      return this.$store.getters.getOnYoutubeCount;
    },
    onRevibedCount() {
      return this.$store.getters.getOnRevibedCount;
    },
    allDataReady() {
      return this.$store.getters.getAllDataReady;
    },
  },
  watch: {
    selected: function (newVal, oldVal) {
      console.log("watch selected", newVal, oldVal);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

.width-400 {
  width: 400px;
}

.stats-block {
  text-align: right;
  width: 400px;

  b {
    width: 38px;
    display: inline-block;
  }
}

.isDisabled {
  pointer-events: none;
  opacity: 0.25;
  text-decoration: none;
}

.preorder {
  color: #ddd;
}

</style>