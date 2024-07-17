<template>
  <div class="filter-popover text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn 
            color="#444" 
            variant="outlined"
            prepend-icon="mdi-filter-variant"
            v-bind="props"
            :class="{'checked': filterStateStore}"
        > Filter </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
            <v-list-item>
              <div class="filter-item-wrap">
                <label>Contact status</label>
                <CustomSelect
                  :options="labelsAllStatusesContact"
                  :default="filterStatusContact"
                  class="select"
                  @input="changeFilterStausContact($event)"
                />
              </div>
            </v-list-item>
            <v-list-item>
              <div class="filter-item-wrap">
                <label>Main status</label>
                <CustomSelect
                  :options="labelsAllStatusesMain"
                  :default="filterStatusMain"
                  class="select"
                  @input="changeFilterStausMain($event)"
                />
              </div>
            </v-list-item>
            <v-list-item>
              <div class="filter-item-wrap">
                <label>Youtube status</label>
                <CustomSelect
                  :options="labelsAllStatusesYoutube"
                  :default="filterStatusYoutube"
                  class="select"
                  @input="changeFilterStausYoutube($event)"
                />
              </div>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>
        
        <v-list>
          <v-list-item>
            <v-checkbox
              v-model="filterStatusHasContacts"
              label="Has Contacts"
              @change="filterStatusHasContactsChecked($event)"
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
      filterYoutube: false,
      filterYoutube2: false,
      filterDiscogs: false,
      filterVarious: false,
      filterGetGood: false,
      filterAddToRVBD: false,
      filterOnRevibed: false,
      allSources: ["All", "KX", "Anton", "KX Balance"],
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
    async changeFilterStausContact(event) {
      if (event) {
        console.log('changeFilterStausContact ', event)
        this.$store.commit('setLabelsFilters', [event, this.filterStatusMain, this.filterStatusYoutube, this.filterStatusHasContacts])
      } 
    },
    async changeFilterStausMain(event) {
      if (event) {
        console.log('changeFilterStausMain ', event)
        this.$store.commit('setLabelsFilters', [this.filterStatusContact, event, this.filterStatusYoutube, this.filterStatusHasContacts])
      } 
    },
    async changeFilterStausYoutube(event) {
      if (event) {
        console.log('changeFilterStausYoutube ', event)
        this.$store.commit('setLabelsFilters', [this.filterStatusContact,this.filterStatusMain, event, this.filterStatusHasContacts])
      } 
    },
    filterStatusHasContactsChecked(event) {
      if (event) {
        console.log('filterStatusHasContactsChecked ', event.target.checked)
        this.$store.commit('setLabelsFilters', [this.filterStatusContact, this.filterStatusMain, this.filterStatusYoutube, event.target.checked])
      } 
    },
  },
  computed: {
    labelsAllStatusesContact() {
      return this.$store.getters.getAllLabelsStatuses('contact', true)
    },
    filterStatusContact() {
      return this.$store.getters.getLabelFilterStatusContact
    },
    filterStatusMain() {
      return this.$store.getters.getLabelFilterStatusMain
    },
    filterStatusYoutube() {
      return this.$store.getters.getLabelFilterStatusYoutube
    },
    filterStatusHasContacts: {
      get(){
        return this.$store.getters.getLabelFilterStatusHasContacts
      },
      set(value){
          return value
      }
    },
    labelsAllStatusesMain() {
      return this.$store.getters.getAllLabelsStatuses('main', true)
    },
    labelsAllStatusesYoutube() {
      return this.$store.getters.getAllLabelsStatuses('youtube', true)
    },
    filterStateStore() {
        return this.$store.getters.getFilterStateLabels
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
            width: 262px!important;
            left: 19px!important;
            right: 0!important;
            z-index: 99999!important;
        }
    }

</style>