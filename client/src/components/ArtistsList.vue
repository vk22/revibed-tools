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
      <v-col> <h2>{{ pageTitle }} ({{ artists.length }}) </h2> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <v-row>
          <v-col>
            <h3>Filters</h3>
          </v-col>
        </v-row> -->
        <!-- <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <div class="filter-row">
              <div class="filter-item-wrap">
                <artist>Contact status</artist>
                <CustomSelect
                  :options="artistsAllStatusesContact"
                  :default="filterStatusContact"
                  class="select"
                  @input="changeFilterStausContact($event)"
                />
              </div>
              <div class="filter-item-wrap">
                <artist>Main status</artist>
                <CustomSelect
                  :options="artistsAllStatusesMain"
                  :default="filterStatusMain"
                  class="select"
                  @input="changeFilterStausMain($event)"
                />
              </div>
              <div class="filter-item-wrap">
                <artist>Youtube status</artist>
                <CustomSelect
                  :options="artistsAllStatusesYoutube"
                  :default="filterStatusYoutube"
                  class="select"
                  @input="changeFilterStausYoutube($event)"
                />
              </div>
              <div class="filter-item-wrap">
                <v-checkbox
                  v-model="filterStatusHasContacts"
                  artist="Has Contacts"
                  @change="filterStatusHasContactsChecked($event)"
                  >
                </v-checkbox>
              </div>
            </div>
          </v-col>
        </v-row> -->
      </v-col>
    </v-row>
    <v-row class="mb-3">
      <v-col> 
        <div class="table-actions">
          <v-btn class="mr-3" color="#444" variant="outlined" :disabled="selected.length === 0" @click="exportArtists()">Export</v-btn>
          <v-btn class="mr-3" color="#444" variant="outlined" @click="panelIsOpen = true">Add Artist</v-btn>
          <!-- <div style="width: 200px;" class="mr-3">
            <v-select
              artist="Status"
              density="compact"
              :items="['default', 'in progress', 'rejected', 'success']"
              v-model="selectedStatus"
              variant="outlined"
            ></v-select>
          </div> -->
          <!-- <v-btn variant="outlined" :disabled="selected.length === 0" @click="exportArtists()">Change status</v-btn> -->
        </div>
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
              v-model="selected"
              :headers="headers"
              :items="artists"
              :search="search"
              items-per-page="50"
              show-select
            >
          
            <template v-slot:item.name="{ item }">
                <router-link :to="{ name: `${ArtistPage}`, params: { id: item.id } }" class="table-item__title">{{ item.name }}</router-link>
            </template>

            <!-- <template v-slot:item.status="{ item }">
              <div class="text-end">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :text="item.status"
                  artist
                ></v-chip>
              </div>
            </template> -->

            <template v-slot:item.releases="{ item }">
              <span>{{ item.releases.length }}</span>
            </template>

            <template v-slot:item.contacts="{ item }">
              <span>{{ item.contacts[0] }}</span>
            </template>


            <template v-slot:item.statusContact="{ item }">
              <span class="tag" :class="$getStatusColor(item.statusContact)">{{ item.statusContact }}</span>
            </template>

            <template v-slot:item.status="{ item }">
              <span class="tag" :class="$getStatusColor(item.status)">{{ item.status }}</span>
            </template>

            <template v-slot:item.statusYoutube="{ item }">
              <span class="tag" :class="$getStatusColor(item.statusYoutube)">{{ item.statusYoutube }}</span>
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
          { key: 'name', title: 'name', width: '400px' },
          { key: 'releases', title: 'releases', width: '100px' },
          { key: 'contacts', title: 'contacts', width: '200px' },
          { key: 'statusContact', title: 'status Contact', align: 'end' },
          { key: 'status', title: 'status', align: 'end' },
          { key: 'statusYoutube', title: 'statusYoutube', align: 'end' },

          
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
      if (pageType === 'artists') {
        return 'Artists';
      } else if (pageType === 'distributors') {
        return 'Distributors';
      } else if (pageType === 'owners') {
        return 'Owners';
      }  
    },
    pageType() {
      return this.$route.fullPath.split('/')[1]
    },
    artists() {
      return this.$store.getters.getArtistsList;     
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