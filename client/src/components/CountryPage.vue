<template>
  <div>

    <v-responsive class="country-page align-top fill-height" v-if="allDataReady">
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
                    <h2>{{ country.name }}</h2>
                  <!-- <span variant="outlind" class="btn sm-btn" @click="panelIsOpen = true">
                    Edit
                  </span> -->
                </div>
              </v-col>
            </v-row>
          </div>
          
          </v-col>
          <v-col>
            <!-- <v-row>
              <v-col>
                  <div class="border-block">Releases: <b>{{ country.count }}</b></div>
              </v-col>
            </v-row> -->
            <v-row class="mb-1" v-if="country.releases">
              <v-col> <h3>Releases ({{ country.releases.length }}) </h3> </v-col>
            </v-row>
            <div class="table-block" v-if="country.releases">
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
                      <ReleasePreview v-for="(release, index) in country.releases" :key="index" :release="release"></ReleasePreview>
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
      // countrys: [],
      description: "",
      title: "",
      panelIsOpen: false
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
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('editArtist', {country: this.country, type: pageType})
    },
    async removeParentArtist() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('removeParentArtist', {country: this.country, type: pageType})
    },
    async changeStatus(event) {
      this.country.status = event
    },
    async changeStatusContact(event) {
      this.country.statusContact = event
    },
    parentSelected (value) {
      console.log('parentSelected ', value) // someValue
      this.country.parent_country = value
    }
  },
  computed: {
    country() {
      return this.$store.getters.getCountry(this.$route.params.id);
    },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    }

  },
  watch: {
    // 'country.status': function (oldValue, newValue) {
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

.country-page {

  h2 {
    font-size: 1.65rem;
  }
  
  .top-block {
    background: #fff;
    border: 1px solid #ddd;
    padding: 2rem;
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


  .country-img {
    width: 150px;
    padding: 1rem 0;
  }
  .country-release {
    display: flex;
    justify-content: space-between;
  }
}




</style>