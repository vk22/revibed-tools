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
                        <artist>Artist name</artist> 
                        <input type="text" name="name" v-model="artist.name"> 
                    </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                    <div class="form-group mr-3">
                        <!-- <input type="text" name="contacts" v-model="artist.parent_artist">  -->
                        <artist>Parent artist</artist> 
                        <SearchAutocomplete
                          :items="allArtistsList"
                          :parent="artist.parent_artist"
                          @clicked="parentSelected"
                        />
                    </div>
                </v-col>
              </v-row>
          </v-container>
        <v-card-actions class="pr-4">
              <div variant="outlined" class="btn sm-btn ml-3" @click="removeParentArtist()">Remove parent</div>  
              <v-spacer></v-spacer>
              <div variant="outlined" class="btn sm-btn" @click="panelIsOpen = false">Cancel</div>
              <div variant="outlined" class="btn sm-btn ml-3" @click="editArtist()">Save</div>  
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-responsive class="artist-page align-top fill-height" v-if="artist && notLoading">
      <v-row>
        <v-col>
          <div class="backBtn"><div @click="$router.go(-1);"><v-icon>mdi-chevron-left</v-icon> Back</div></div>
        </v-col>
      </v-row>
        <v-row>
          <v-col cols="4">
            <div class="top-block">
            <v-row>
              
              <v-col>
                <div class="mb-3 d-flex justify-space-between">
                  <a :href="`https://www.discogs.com/artist/${artist.id}`" target="_blank" class="link"> <h2>{{ artist.name }}</h2></a>
                  <!-- <span variant="outlined" class="btn sm-btn" @click="panelIsOpen = true">
                    Edit
                  </span> -->
                </div>
                <div v-if="artist.images">
                  <img :src="artist.images[0].uri" alt="" class="artist-img">
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="label">Main status</div> 
                <CustomSelect
                    :options="artistsAllStatusesMain"
                    :default="artist.status"
                    class="select"
                    @input="changeStatus($event)"
                  />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div class="label">Contact status</div> 
                <CustomSelect
                    :options="artistsAllStatusesContact"
                    :default="artist.statusContact"
                    class="select"
                    @input="changeStatusContact($event)"
                  />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="label">Aliases</div> 
                <div v-if="artist.aliases.length">
                  <router-link :to="`/artists/${alias.id}`" v-for="(alias, index) in artist.aliases" :key="index">{{ alias.name }}, </router-link>
                </div>
                <div v-else>
                  no aliases
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="mb-3">
                  <div class="label">Contact Information</div>
                </div>
                <div>
                  <v-textarea label="Contacts" variant="outlined" v-model="artist.contacts[0]">{{ artist.contacts[0] }}</v-textarea>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="artist.lastUpdate">
                <div class="mb-3"><h4>Last update</h4></div>
                <div>
                    <div class="mb-1">User: {{ artist.lastUpdate.user }}</div> 
                    <div>Date: {{ new Date(artist.lastUpdate.date).toLocaleString("en-US") }}</div> 
                </div>
              </v-col>  
            </v-row>
            <v-row>
              <v-col>
                <div class="d-flex">
                  <div variant="outlined" class="btn" @click="editArtist()">
                    Save
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          
          </v-col>
          <v-col>
            <!-- <v-row>
              <v-col>
                  <div class="border-block">Releases: <b>{{ artist.count }}</b></div>
              </v-col>
            </v-row> -->
            <v-row class="mb-1" v-if="artist.releases">
              <v-col> <h3>Releases ({{ artist.releases.length }}) </h3> </v-col>
            </v-row>
            <div class="table-block" v-if="artist.releases">
              <v-row>
                <v-col>
                  <v-table>
                    <thead>
                        <tr>
                          <td>Artist - Titles</td>
                          <td>Label</td>
                          <td>Parent Label</td>
                          <td>Discogs</td>
                          <td>Artist</td>
                          <td>Youtube</td>
                          <td>Various</td>
                          <td>onRevibed</td>
                        </tr>
                    </thead>
                    <tbody>
                      <ReleasePreview v-for="(release, index) in artist.releases" :key="index" :release="release"></ReleasePreview>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </div>

          </v-col>
        </v-row>

    </v-responsive>
    <v-responsive class="main-loader align-center fill-height" v-else>
      <div class="text-center">
        <v-progress-circular indeterminate color="#111"></v-progress-circular>
      </div>
    </v-responsive>
  </div>
</template>

<script>
import ReleasePreview from '@/components/ReleasePreview.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import SearchAutocomplete from '@/components/SearchAutocomplete.vue'
export default {
  name: "App",
  components: {
    CustomSelect,
    SearchAutocomplete,
    ReleasePreview
  },
  data() {
    return {
      // artists: [],
      description: "",
      title: "",
      panelIsOpen: false,
      notLoading: true,
    };
  },
  async mounted() {
    // console.log('this.$route.params.id ', this.$route.fullPath.split('/')[1])
  },
  methods: {
    pageType() {
      return this.$route.fullPath.split('/')[1]
    },
    async editArtist() {
      this.panelIsOpen = false
      this.notLoading = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('editArtist', {artist: this.artist, type: pageType})
      setTimeout(() => {
        this.notLoading = true
      }, 1000);
    },
    async removeParentArtist() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('removeParentArtist', {artist: this.artist, type: pageType})
    },
    async changeStatus(event) {
      this.artist.status = event
    },
    async changeStatusContact(event) {
      this.artist.statusContact = event
    },
    parentSelected (value) {
      console.log('parentSelected ', value) // someValue
      this.artist.parent_artist = value
    }
  },
  computed: {
    artist() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'artists') {
        return this.$store.getters.getArtist(this.$route.params.id);
      } else if (pageType === 'distributors') {
        return this.$store.getters.getDistributor(this.$route.params.id);
      } else if (pageType === 'owners') {
        return this.$store.getters.getOwner(this.$route.params.id);
      }
    },
    artistsAllStatusesContact() {
      return this.$store.getters.getAllArtistsStatuses('contact', false)
    },
    artistsAllStatusesMain() {
      return this.$store.getters.getAllArtistsStatuses('main', false)
    },
    allArtistsList() {
      return this.$store.getters.getAllArtistsList
    },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    }

  },
  watch: {
    // 'artist.status': function (oldValue, newValue) {
    //   console.log('status newValue ', oldValue, newValue)
    //   if (newValue !== oldValue) {
    //     this.editArtist(newValue)
    //   }
      
    // },
  }     

};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.artist-page {

  h2 {
    font-size: 1.65rem;
  }
  
  .top-block {
    background: #fff;
    border: 1px solid #ddd;
    padding: 2.5rem 2rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .border-block {
    background: #fff;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }


  .artist-img {
    width: 150px;
    padding: 1rem 0;
  }
  .artist-release {
    display: flex;
    justify-content: space-between;
  }
}




</style>