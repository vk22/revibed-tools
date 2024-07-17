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
                        <label>Label name</label> 
                        <input type="text" name="name" v-model="label.name"> 
                    </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                    <div class="form-group mr-3">
                        <!-- <input type="text" name="contacts" v-model="label.parent_label">  -->
                        <label>Parent label</label> 
                        <SearchAutocomplete
                          :items="allLabelsList"
                          :parent="label.parent_label"
                          @clicked="parentSelected"
                        />
                    </div>
                </v-col>
              </v-row>
          </v-container>
        <v-card-actions class="pr-4">
              <div variant="outlined" class="btn sm-btn ml-3" @click="removeParentLabel()">Remove parent</div>  
              <div variant="outlined" class="btn sm-btn ml-3" @click="sublabelsStatusUpdate()">Sublabels Status Update</div>  
              <v-spacer></v-spacer>
              <div variant="outlined" class="btn sm-btn" @click="panelIsOpen = false">Cancel</div>
              <div variant="outlined" class="btn sm-btn ml-3" @click="editLabel()">Save</div>  
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-responsive class="label-page align-top fill-height" v-if="label && notLoading">
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
                  <a :href="`https://www.discogs.com/label/${label.id}`" target="_blank" class="link"> <h2>{{ label.name }}</h2></a>
                  <span variant="outlined" class="btn sm-btn" @click="panelIsOpen = true">
                    Edit
                  </span>
                </div>
                <div v-if="label.images">
                  <img :src="label.images[0].uri" alt="" class="label-img">
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="label">Main status</div> 
                <CustomSelect
                    :options="labelsAllStatusesMain"
                    :default="label.status"
                    class="select"
                    @input="changeStatus($event)"
                  />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div class="label">Contact status</div> 
                <CustomSelect
                    :options="labelsAllStatusesContact"
                    :default="label.statusContact"
                    class="select"
                    @input="changeStatusContact($event)"
                  />
              </v-col>
            </v-row>
            <v-row v-if="label.sublabelsExist">
              <v-col>
                <div class="mb-3">
                  <div class="label">Sublabels</div>
                </div>
                <div class="mb-3">
                    <router-link v-for="(sublabel, index) in label.sublabels" :key="index" :to="`/labels/${sublabel.id}`"> {{ sublabel.name  }}<span>, </span> </router-link>
                    <!-- <a v-for="(sublabel, index) in label.sublabelsExist" :key="index" :href="`https://www.discogs.com/label/${sublabel.id}`" target="_blank">{{ sublabel.name }}, </a> -->
                </div>
              </v-col>
            </v-row>
            <v-row v-if="label.parent_label">
              <!-- {{label.parent_label}} -->
              <v-col>
                <div class="mb-3">
                  <div class="label">Parent label</div>
                </div>
                <div class="mb-3">
                    <router-link :to="`/labels/${label.parent_label.id}`"> {{ label.parent_label.name }},</router-link>
                    <!-- <a :href="`https://www.discogs.com/label/${label.parent_label.id}`" target="_blank">{{ label.parent_label.name }}, </a> -->
                </div>
              </v-col>
            </v-row>
            <v-row v-if="label.main_parent_label">
              <v-col>
                <div class="mb-3">
                  <div class="label">Main Parent label</div>
                </div>
                <div class="mb-3">
                    <router-link :to="`/labels/${label.main_parent_label.id}`"> {{ label.main_parent_label.name }},</router-link>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="mb-3">
                  <div class="label">Contact Information</div>
                </div>
                <div>
                  <v-textarea label="Contacts" variant="outlined" v-model="label.contacts[0]">{{ label.contacts[0] }}</v-textarea>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="label.lastUpdate">
                <div class="mb-3"><h4>Last update</h4></div>
                <div>
                    <div class="mb-1">User: {{ label.lastUpdate.user }}</div> 
                    <div>Date: {{ new Date(label.lastUpdate.date).toLocaleString("en-US") }}</div> 
                </div>
              </v-col>  
              <v-col>
                <div class="d-flex">
                  <div variant="outlined" class="btn" @click="editLabel()">
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
                  <div class="border-block">Releases: <b>{{ label.count }}</b></div>
              </v-col>
            </v-row> -->
            <v-row class="mb-1" v-if="label.releases">
              <v-col> <h3>Releases ({{ label.releases.length }}) </h3> </v-col>
            </v-row>
            <div class="table-block" v-if="label.releases">
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
                      <ReleasePreview v-for="(release, index) in label.releases" :key="index" :release="release"></ReleasePreview>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </div>

            <v-row class="mb-1" v-if="label.subreleases">
              <v-col> <h3>Sub Releases ({{ label.subreleases.length }}) </h3> </v-col>
            </v-row>
            <div class="table-block" v-if="label.subreleases">
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
                      <ReleasePreview v-for="(release, index) in label.subreleases" :key="index" :release="release"></ReleasePreview>
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
      // labels: [],
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
    async editLabel() {
      this.panelIsOpen = false
      this.notLoading = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('editLabel', {label: this.label, type: pageType})
      setTimeout(() => {
        this.notLoading = true
      }, 1000);
    },
    async removeParentLabel() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('removeParentLabel', {label: this.label, type: pageType})
    },
    async sublabelsStatusUpdate() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('sublabelsStatusUpdate', {label: this.label, type: pageType})
    },
    async changeStatus(event) {
      this.label.status = event
    },
    async changeStatusContact(event) {
      this.label.statusContact = event
    },
    parentSelected (value) {
      console.log('parentSelected ', value) // someValue
      this.label.parent_label = value
    }
  },
  computed: {
    label() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'labels') {
        return this.$store.getters.getLabel(this.$route.params.id);
      } else if (pageType === 'distributors') {
        return this.$store.getters.getDistributor(this.$route.params.id);
      } else if (pageType === 'owners') {
        return this.$store.getters.getOwner(this.$route.params.id);
      }
    },
    labelsAllStatusesContact() {
      return this.$store.getters.getAllLabelsStatuses('contact', false)
    },
    labelsAllStatusesMain() {
      return this.$store.getters.getAllLabelsStatuses('main', false)
    },
    allLabelsList() {
      return this.$store.getters.getAllLabelsList
    },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    }

  },
  watch: {
    // 'label.status': function (oldValue, newValue) {
    //   console.log('status newValue ', oldValue, newValue)
    //   if (newValue !== oldValue) {
    //     this.editLabel(newValue)
    //   }
      
    // },
  }     

};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.label-page {

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


  .label-img {
    width: 150px;
    padding: 1rem 0;
  }
  .label-release {
    display: flex;
    justify-content: space-between;
  }
}




</style>