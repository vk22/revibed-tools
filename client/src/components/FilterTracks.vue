<template>
  <div class="filter-popover text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn 
            color="#444" 
            variant="outlined"
            prepend-icon="mdi-filter-variant"
            v-bind="props"
            class=""
            :class="{'checked': filterStateStore.length}"
        > Filter </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
            <v-list-item>
                <div class="filter-item-wrap">
                    <!-- <label>Source</label> -->
                    <CustomSelect
                    :options="allSources"
                    :default="sourceSelected"
                    class="select"
                    @input="changeFilterSource($event)"
                    />
                </div>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-checkbox
              @change="changeFilterYoutube"
              v-model="filterYoutube"
              label="Youtube Copyrights"
            >
            </v-checkbox>
          </v-list-item>

          <v-list-item>
            <v-checkbox
              @change="changeFilterYoutube2"
              v-model="filterYoutube2"
              label="Youtube Not Uploaded"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              @change="changeFilterDiscogs"
              v-model="filterDiscogs"
              label="Discogs Warnings Labels"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              @change="changeFilterVarious"
              v-model="filterVarious"
              label="Various Artists"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              @change="changeFilterOnRevibed"
              v-model="filterOnRevibed"
              label="OnRevibed"
            >
            </v-checkbox>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        
        <v-list>
          <v-list-item>
            <v-checkbox
              class="filter-checkbox"
              @change="changeFilterGetGood"
              v-model="filterGetGood"
              label="Allowed For Sale"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              class="filter-checkbox"
              @change="changeFilterGetBlocked"
              v-model="filterGetBlocked"
              label="Blocked For Sale"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              class="filter-checkbox"
              @change="changeFilterGetGoodNotForSale"
              v-model="filterGetGoodNotForSale"
              label="Good Releases Not On Sale"
            >
            </v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              class="filter-checkbox"
              @change="changeFilterAddToRVBD"
              v-model="filterAddToRVBD"
              label="Add to RVBD"
            >
            </v-checkbox>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import CustomSelect from "@/components/CustomSelect.vue";
export default {
  name: "App",
  components: {
    CustomSelect,
  },
  data() {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
      filterState: [],
    //   filterYoutube: false,
    //   filterYoutube2: false,
    //   filterDiscogs: false,
    //   filterVarious: false,
    //   filterGetGood: false,
    //   filterAddToRVBD: false,
    //   filterOnRevibed: false,
      allSources: ["All", "KX", "Anton", "Revibed", "KX Balance"],
      sourceSelected: "All",
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
    changeFilterSource(event) {
      if (event) {
        console.log("changeFilterSource ", event);
        this.filterStatusContact = event;
        this.sourceSelected = event;

        if (event === "All") {
          let index = this.filterState.findIndex((item) => item.source);
          if (index !== -1) {
            this.filterState.splice(index, 1);
            this.$store.commit('setFilteredState', this.filterState)
          }
        } else {
          let index = this.filterState.findIndex((item) => item.source);
          if (index !== -1) {
            this.filterState.splice(index, 1);
            this.$store.commit('setFilteredState', this.filterState)
          }
          this.filterState.push({ source: event });
          this.$store.commit('setFilteredState', this.filterState)
        }
      }
    },
    changeFilterYoutube(event) {
      console.log("changeFilterYoutube ", event.target.checked);
      if (event.target.checked) {
        // this.clearFilters();
        // this.filterState.push("youtube");
        this.$store.commit('setFilteredState2', {action: 'add', value: 'youtube'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'youtube'})
      }
    },
    changeFilterYoutube2(event) {
      console.log("changeFilterYoutube2 ", event.target.checked);
      if (event.target.checked) {
        // this.clearFilters();
        // this.filterState.push("youtube");
        this.$store.commit('setFilteredState2', {action: 'add', value: 'youtube2'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'youtube2'})
      }
    },
    changeFilterDiscogs(event) {
      console.log("changeFilterDiscogs ", event.target.checked);
      if (event.target.checked) {
        // this.clearFilters();
        // this.filterState.push("youtube");
        this.$store.commit('setFilteredState2', {action: 'add', value: 'discogs'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'discogs'})
      }
    },
    changeFilterVarious(event) {
      console.log("changeFilterVarious ", event.target.checked);
      if (event.target.checked) {
        // this.clearFilters();
        // this.filterState.push("youtube");
        this.$store.commit('setFilteredState2', {action: 'add', value: 'various'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'various'})
      }
    },
    changeFilterOnRevibed(event) {
      console.log("changeFilterOnRevibed ", event.target.checked);
      if (event.target.checked) {
        // this.clearFilters();
        // this.filterState.push("youtube");
        this.$store.commit('setFilteredState2', {action: 'add', value: 'onRevibed'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'onRevibed'})
      }
    },

    changeFilterGetGood(event) {
    if (event.target.checked) {
        // this.$store.commit('resetReleasesFilter1')
        this.$store.commit('setFilteredState2', {action: 'add', value: 'goodReleases'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'goodReleases'})
      }
    },
    changeFilterGetBlocked(event) {
    if (event.target.checked) {
        // this.$store.commit('resetReleasesFilter1')
        this.$store.commit('setFilteredState2', {action: 'add', value: 'blockedReleases'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'blockedReleases'})
      }
    },
    changeFilterGetGoodNotForSale(event) {
    if (event.target.checked) {
        // this.$store.commit('resetReleasesFilter1')
        this.$store.commit('setFilteredState2', {action: 'add', value: 'goodButNotFoSale'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'goodButNotFoSale'})
      }
    },
    changeFilterAddToRVBD(event) {
    if (event.target.checked) {
        // this.$store.commit('resetReleasesFilter2')
        this.$store.commit('setFilteredState2', {action: 'add', value: 'addToRVBD'})
      } else {
        this.$store.commit('setFilteredState2', {action: 'remove', value: 'addToRVBD'})
      }
    },
    // clearFilters() {
    // //   this.filterGetGood = false;
    //   let index = this.filterState.indexOf("goodReleases");
    //   if (index !== -1) {
    //     this.filterState.splice(index, 1);
    //     this.$store.commit('setFilteredState', this.filterState)
    //   }
    //   let index2 = this.filterState.indexOf("addToRVBD");
    //   if (index2 !== -1) {
    //     this.filterState.splice(index2, 1);
    //     this.$store.commit('setFilteredState', this.filterState)
    //   }
    // },
    async exportReleases() {
      await this.$store.dispatch("exportReleases", this.selected);
    },
    async removeFromRevibedMany() {
      await this.$store.dispatch("removeFromRevibedMany", this.selected);
    },
  },
  computed: {
    allReleasesCount() {
      return this.$store.getters.getAllReleases.length;
    },
    releases() {
      return this.$store.getters.getReleases(this.filterState);
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
    filterStateStore() {
        return this.$store.getters.getFilterState
    },
    filterYoutube: {
        get () {
            return this.$store.getters.getReleasesFilter.youtube
        },
        set (value) {
            this.$store.commit('resetReleasesFilter3')
            this.$store.commit('setReleasesFilter', {item: 'youtube', value: value})
        }
    },
    filterYoutube2: {
        get () {
            return this.$store.getters.getReleasesFilter.youtube2
        },
        set (value) {
            this.$store.commit('resetReleasesFilter3')
            this.$store.commit('setReleasesFilter', {item: 'youtube2', value: value})
        }
    },
    filterDiscogs: {
        get () {
            return this.$store.getters.getReleasesFilter.discogs
        },
        set (value) {
            this.$store.commit('resetReleasesFilter3')
            this.$store.commit('setReleasesFilter', {item: 'discogs', value: value})
        }
    },
    filterVarious: {
        get () {
            return this.$store.getters.getReleasesFilter.various
        },
        set (value) {
            this.$store.commit('resetReleasesFilter3')
            this.$store.commit('setReleasesFilter', {item: 'various', value: value})
        }
    },
    filterOnRevibed: {
        get () {
            return this.$store.getters.getReleasesFilter.onRevibed
        },
        set (value) {
            this.$store.commit('resetReleasesFilter3')
            this.$store.commit('setReleasesFilter', {item: 'onRevibed', value: value})
        }
    },
    filterGetGood: {
        get () {
            return this.$store.getters.getReleasesFilter.goodReleases
        },
        set (value) {
            this.$store.commit('resetReleasesFilter1')
            this.$store.commit('setReleasesFilter', {item: 'goodReleases', value: value})
        }
    },
    filterGetBlocked: {
        get () {
            return this.$store.getters.getReleasesFilter.blockedReleases
        },
        set (value) {
            this.$store.commit('resetReleasesFilter1')
            this.$store.commit('setReleasesFilter', {item: 'blockedReleases', value: value})
        }
    },
    filterGetGoodNotForSale: {
        get () {
            return this.$store.getters.getReleasesFilter.goodButNotFoSale
        },
        set (value) {
            this.$store.commit('resetReleasesFilter4')
            this.$store.commit('setReleasesFilter', {item: 'goodButNotFoSale', value: value})
        }
    },
    filterAddToRVBD: {
        get () {
            return this.$store.getters.getReleasesFilter.addToRVBD
        },
        set (value) {
            this.$store.commit('resetReleasesFilter2')
            this.$store.commit('setReleasesFilter', {item: 'addToRVBD', value: value})
        }
    }



  },
  watch: {
    selected: function (newVal, oldVal) {
      console.log("watch selected", newVal, oldVal);
    },
  },
};
</script>


<style lang="scss">
    .checked {
        background: #2f2f2f!important;
        color: #fff !important;
    }
    .filter-popover {
        display: inline-block;
        margin-right: 10px;
    }

    .v-list-item--density-default.v-list-item--one-line {
        min-height: 40px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .v-checkbox {
        height: 35px;
        width: 230px;
    }
    .v-checkbox .v-selection-control {
        min-height: 34px!important;
    }
    .v-input__details {
        display: none;
    }

    .filter-item-wrap {
        margin: 7px 0 6px;
        padding: 3px;
    }

    .v-overlay-container {
          .custom-select .items {
            position: fixed!important;
            width: 540px!important;
            left: 29px!important;
            z-index: 99999!important;
          }

        .filter-item-wrap {
          .custom-select .items {
            position: fixed!important;
            width: 262px!important;
            left: 19px!important;
            right: 0!important;
            z-index: 99999!important;
          }
        }
        
    }

</style>