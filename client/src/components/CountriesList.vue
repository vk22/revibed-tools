<template>
  <div>
    <v-dialog
      v-model="panelIsOpen"
      persistent
      max-width="600px"
    >
      <v-card class="edit-panel">
          <v-container>
              <v-row>
                <v-col>
                    <div class="form-group mr-3">
                        <label>Artist name</label> 
                        <input type="text" name="name" v-model="newArtist.name"> 
                    </div>
                </v-col>
              </v-row>
          </v-container>
        <v-card-actions class="pr-4">
              <v-spacer></v-spacer>
              <div variant="outlined" class="btn sm-btn" @click="panelIsOpen = false">Cancel</div>
              <div variant="outlined" class="btn sm-btn ml-3" @click="addArtist()">Save</div>  
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-responsive class="align-top fill-height" v-if="allDataReady">
    <v-row>
      <v-col> <h2>{{ pageTitle }} ({{ countries.length }}) </h2> </v-col>
    </v-row>
    <v-row>
      <v-col>

      </v-col>
    </v-row>
    <div class="table-block">
      <v-row>
        <v-col>
          <v-card
            flat
          >
            <template v-slot:text>
              <v-text-field
                v-model="search"
                artist="Search"
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
              :items="countries"
              :search="search"
              items-per-page="50"
            >
            <template v-slot:item="{ item }">
              <tr>
                <td> <router-link :to="{ name: `CountryPage`, params: { id: item.name } }" class="table-item__title">{{ item.name }}</router-link></td>
                <td>{{ item.count }}</td>
              </tr>
            </template>
          

          </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-responsive>
  <v-responsive class="main-loader align-center fill-height" v-else>
    <div class="text-center">
      <v-progress-circular indeterminate color="#111"></v-progress-circular>
    </div>
  </v-responsive>
</div>
</template>

<script>
import CustomSelect from '@/components/CustomSelect.vue'
export default {
  name: "App",
  components: {
    CustomSelect
  },
  data() {
    return {
      search: '',
      selected: [],
      description: "",
      title: "",
      readyToShow: false,
      artistsOnPage: [],
      artistsInStoreFiltered: [],
      artistsToAddOnPage: [],
      artistsForGettingCount: 50,
      artistsOnPageCount: 0,
      headers: [
          { key: 'name', title: 'name' },
          { key: 'count', title: 'count' }

          
      ],
      selectedStatus: undefined,
      sortBy: [{ key: 'count', order: 'desc' }],
      //filterStatusContact: 'All',
      // filterStatusMain: 'All',
      // filterStatusContacts: false,
      hasContacts: false,
      panelIsOpen: false,
      newArtist: {
        name: ''
      }
    };
  },
  async mounted() {
    //window.addEventListener("scroll", this.handleScroll);
    // if (this.artists) {
    //   this.getartistsByPage(this.artists, "start");
    // }
    console.log('this.$route.params.id ', this.$route.fullPath.split('/')[1])
  },
  methods: {
    async exportArtists() {
      await this.$store.dispatch('exportArtists', this.selected)
    },
    async editartists() {
      await this.$store.dispatch('editartists')
    },
    async changeFilterStausContact(event) {
      if (event) {
        console.log('changeFilterStausContact ', event)
        this.$store.commit('setArtistsFilters', [event, this.filterStatusMain, this.filterStatusYoutube, this.filterStatusHasContacts])
      } 
    },
    async changeFilterStausMain(event) {
      if (event) {
        console.log('changeFilterStausMain ', event)
        this.$store.commit('setArtistsFilters', [this.filterStatusContact, event, this.filterStatusYoutube, this.filterStatusHasContacts])
      } 
    },
    async changeFilterStausYoutube(event) {
      if (event) {
        console.log('changeFilterStausYoutube ', event)
        this.$store.commit('setArtistsFilters', [this.filterStatusContact,this.filterStatusMain, event, this.filterStatusHasContacts])
      } 
    },
    filterStatusHasContactsChecked(event) {
      if (event) {
        console.log('filterStatusHasContactsChecked ', event.target.checked)
        this.$store.commit('setArtistsFilters', [this.filterStatusContact, this.filterStatusMain, this.filterStatusYoutube, event.target.checked])
      } 
    },
    async addArtist() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('addArtist', {artist: this.newArtist, type: pageType})
    },
  },
  computed: {
    ArtistPage() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'artists') {
        return 'ArtistPage';
      } else if (pageType === 'distributors') {
        return 'DistributorPage';
      } else if (pageType === 'owners') {
        return 'OwnerPage';
      }  
    },
    pageTitle() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'countries') {
        return 'Countries';
      }
    },
    pageType() {
      return this.$route.fullPath.split('/')[1]
    },
    countries() {
      return this.$store.getters.getCountriesList;     
    },
    // artists() {
    //   let pageType = this.$route.fullPath.split('/')[1]
    //   if (pageType === 'artists') {
    //     return this.$store.getters.getArtistsList(this.filterState);
    //   } else if (pageType === 'distributors') {
    //     return this.$store.getters.getDistributors;
    //   } else if (pageType === 'owners') {
    //     return this.$store.getters.getOwners;
    //   }      
    // },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    },
    artistsAllStatusesContact() {
      return this.$store.getters.getAllArtistsStatuses('contact', true)
    },
    filterStatusContact() {
      return this.$store.getters.getArtistFilterStatusContact
    },
    filterStatusMain() {
      return this.$store.getters.getArtistFilterStatusMain
    },
    filterStatusYoutube() {
      return this.$store.getters.getArtistFilterStatusYoutube
    },
    filterStatusHasContacts: {
      get(){
        return this.$store.getters.getArtistFilterStatusHasContacts
      },
      set(value){
          return value
      }
      
    },
    artistsAllStatusesMain() {
      return this.$store.getters.getAllArtistsStatuses('main', true)
    },
    artistsAllStatusesYoutube() {
      return this.$store.getters.getAllArtistsStatuses('youtube', true)
    }
    
  },
  watch: {
    selected: function (newVal, oldVal) {
      console.log('watch selected', newVal, oldVal)
    },
  },
};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.artist-row {
  &__title {
    color: #000;
    font-weight: 600;
  }
}

.status {
  background: #ebebeb;
  padding: 3px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  .default {
    background: #ebebeb;
    width: 75px;
  }
}

.table-actions {
  display: flex;
}
</style>