<template>
  <div class="fixed-container">
    <v-dialog v-model="panelTrackIsOpen" persistent max-width="600px">
      <v-card class="set-authors-panel">
        <v-container>
          <v-row>
            <v-col cols="6">
              <div class="release-page__section">
                <div class="mb-3">
                  <h3>Authors</h3>
                </div>
                <div class="mb-3">
                  <div class="form-group mr-3" v-for="(note, index) in selectedTrack.authors" :key="index">
                    <input type="text" name="contacts" v-model="selectedTrack.authors[index]">
                    <!-- <v-textarea variant="outlined" v-model="release.notes[index]">{{ release.notes[index] }}</v-textarea> -->
                  </div>
                </div>
                <div class="mb-3">
                  <div variant="outlined" class="btn sm-btn no-full-w" style="font-size: 16px; line-height: 19px;"
                    @click="addTextField('authors')">
                    +
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="release-page__section">
                <div class="mb-3">
                  <h3>Composers</h3>
                </div>
                <div class="mb-3">
                  <div class="form-group mr-3" v-for="(note, index) in selectedTrack.composers" :key="index">
                    <input type="text" name="contacts" v-model="selectedTrack.composers[index]">
                    <!-- <v-textarea variant="outlined" v-model="release.notes[index]">{{ release.notes[index] }}</v-textarea> -->
                  </div>
                </div>
                <div class="mb-3">
                  <div variant="outlined" class="btn sm-btn no-full-w" style="font-size: 16px; line-height: 19px;"
                    @click="addTextField('composers')">
                    +
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pr-4">
          <v-spacer></v-spacer>
          <div variant="outlined" class="btn sm-btn" @click="panelTrackIsOpen = false">Cancel</div>
          <div variant="outlined" class="btn sm-btn ml-3" @click="editTrack()">Save</div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="panelIsOpen2" persistent max-width="600px">
      <v-card class="edit-panel">
        <v-container>
          <v-row>
            <v-col>
              <div class="form-group mr-3">
                <!-- <input type="text" name="contacts" v-model="label.parent_label">  -->
                <label>Select label</label>
                <SearchAutocomplete :items="allLabelsList" :parent="release.labelName" @clicked="newLabelSelected" />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pr-4">
          <v-spacer></v-spacer>
          <div variant="outlined" class="btn sm-btn" @click="panelIsOpen2 = false">Cancel</div>
          <div variant="outlined" class="btn sm-btn ml-3" @click="editRelease()">Save</div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="panelIsOpen" persistent max-width="600px">
      <v-card class="add-playlist-panel">
        <v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <div class="add-playlist-panel__title">Delete forever?</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-actions class="pr-10">
          <v-spacer></v-spacer>
          <div variant="outlined" class="btn sm-btn" @click="panelIsOpen = false">Cancel</div>
          <div variant="outlined" class="btn sm-btn error ml-3" @click="deleteRelease()">Delete</div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-responsive class="release-page align-top fill-height" v-if="release && notLoading">
      <!-- {{ release }} -->
      <v-row>
        <v-col>
          <div class="backBtn">
            <div @click="$router.go(-1);"><v-icon>mdi-chevron-left</v-icon> Back</div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <div class="release-page__container">
          <v-col cols="12">
            <div class="release-page__section">
              <div class="mb-5 d-flex justify-space-between align-center top-row">
                <div>
                  <div class="release-page__artist"><router-link :to="`/artists/${release.artists[0].id}`"
                      class="table-item__labelName">{{ release.artist }}</router-link> <a
                      :href="`https://www.discogs.com/release/${release.releaseID}`" target="_blank"
                      class="discogs-link">
                      <DiscogsIcon />
                    </a></div>
                  <div class="release-page__title">{{ release.title }}</div>
                </div>

                <div class="d-flex align-center">
                  <a :href="` https://revibed.com/marketplace/${release.onRevibed.id}`" class="mr-2" target="_blank"
                    v-if="release.onRevibed.forSale">
                    <DiscogsIcon />
                  </a>
                  <div v-if="release.statusMain === 'allowed' && !release.onRevibed.forSale && release.type === 'goods'"
                    class="btn put-on-sale mr-2" @click="putOnSale()"> Put On Sale </div>
                  <span class="tag big mr-3" :class="$getStatusColor(release.statusMain)" v-if="release.statusMain">{{
                    release.statusMain }}
                  </span>
                </div>

              </div>
              <v-row>
                <v-col>
                  <div class="release-page__details">
                    <div>Release ID:</div>
                    <div>
                      {{ release.releaseID }}
                    </div>
                  </div>
                  <div class="release-page__details">
                    <div>Label:</div>
                    <div>
                      <router-link :to="`/labels/${release.labelID}`" class="table-item__labelName">{{ release.labelName
                        }}</router-link>
                    </div>
                    <div><a :href="`https://www.discogs.com/label/${release.labelID}`" target="_blank"
                        class="discogs-link">
                        <DiscogsIcon />
                      </a></div>
                    <span variant="outlined" class="btn sm2-btn ml-3" @click="panelIsOpen2 = true">
                      Edit label
                    </span>
                  </div>
                  <div class="release-page__details">
                    <div>Parent Label:</div>
                    <div v-if="release.labelParent">
                      <router-link :to="`/labels/${release.labelParent.id}`" class="table-item__labelName">{{
                        release.labelParent.name }}</router-link>
                    </div>
                    <div v-else class="text-grey">
                      No parent label
                    </div>
                    <div v-if="release.labelParent"><a :href="`https://www.discogs.com/label/${release.labelParent.id}`"
                        target="_blank" class="discogs-link">
                        <DiscogsIcon />
                      </a></div>
                  </div>
                  <div class="release-page__details">
                    <div>Country:</div>
                    <div>
                      <router-link :to="{ name: `CountryPage`, params: { id: release.country } }"
                        class="table-item__title">{{ release.country }}</router-link>
                    </div>
                  </div>
                  <div class="release-page__details">
                    <div>Source:</div>
                    <div>
                      <CustomSelect :options="releasesAllSources" :default="release.source" class="select select-sm2"
                        @input="changeSelect($event, 'source')" />
                    </div>
                  </div>
                  <div class="release-page__details" v-if="release.sourceCondition">
                    <div>Source Condition:</div>
                    <div>
                      {{ release.sourceCondition }}
                    </div>
                  </div>
                  <div class="release-page__details" v-if="release.quality">
                    <div>Rip Quality:</div>
                    <div>
                      {{ release.quality }}
                    </div>
                  </div>
                  <div class="release-page__details">
                    <div>Type:</div>
                    <div>
                      <CustomSelect :options="releasesAllTypes" :default="release.type" class="select select-sm2"
                        @input="changeSelect($event, 'type')" />
                    </div>
                  </div>
                </v-col>
                <v-col md="3">
                  <div class="release-page__details justify-space-between pa-1">
                    <div>Discogs:</div>
                    <div>
                      <span class="tag" :class="$getStatusColor(release.statusDiscogs)" v-if="release.statusDiscogs">{{
                        release.statusDiscogs }}
                      </span>
                    </div>
                  </div>
                  <div class="release-page__details justify-space-between pa-1">
                    <div>Artist:</div>
                    <div>
                      <span class="tag" :class="$getStatusColor(release.statusArtist)" v-if="release.statusArtist">{{
                        release.statusArtist }}
                      </span>
                    </div>
                  </div>
                  <div class="release-page__details justify-space-between pa-1">
                    <div>Youtube:</div>
                    <div>
                      <span class="tag" :class="$getStatusColor(release.statusYoutube)" v-if="release.statusYoutube">{{
                        release.statusYoutube }}
                      </span>
                    </div>
                  </div>
                  <!-- <div class="release-page__details justify-space-between">
                      <div>Distributor:</div> 
                      <div>
                        <span
                          class="tag"
                          :class="$getStatusColor(release.statusDistributor)"
                          v-if="release.statusDistributor"
                          >{{ release.statusDistributor }}
                        </span>
                      </div>
                    </div>
                    <div class="release-page__details justify-space-between">
                      <div>Owner:</div> 
                      <div>
                        <span
                          class="tag"
                          :class="$getStatusColor(release.statusOwner)"
                          v-if="release.statusOwner"
                          >{{ release.statusOwner }}
                        </span>
                      </div>
                    </div> -->
                  <div class="release-page__details justify-space-between pa-1">
                    <div>Release:</div>
                    <div>
                      <CustomSelect :options="releasesAllStatuses" :default="release.status" class="select select-sm"
                        @input="changeSelect($event, 'status')" />
                    </div>
                  </div>


                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="release-page__section tracklist">
            <div class="mb-3">
              <h3>Tracklist</h3>
            </div>
            <div v-if="tracks">
              <div class="track-item">
                  <div class="position mr-3">
                    <b></b>
                  </div>
                  <div class="title mr-3">
                    <b>title</b>
                  </div>
                  <div class="authors mr-3">
                    <b>authors</b>
                  </div>
                  <div class="composers mr-3">
                    <b>composers</b>
                  </div>
                  <div class="open-panel">
                  </div>
              </div>
              <div class="track-item" v-for="(track, _id) in tracks" :key="_id">
                  <div class="position mr-3">
                    {{ track.position }}
                  </div>
                  <div class="title mr-3">
                    {{ track.title }}
                  </div>
                  <div class="authors mr-3">
                   <div v-if="track.authors.length">{{ track.authors.join(', ') }}</div> 
                  </div>
                  <div class="composers mr-3">
                    <div v-if="track.composers.length">{{ track.composers.join(', ') }}</div>
                  </div>

                  <div class="open-panel">
                    <div variant="outlined" class="btn sm2-btn no-full-w" style="font-size: 14px; line-height: 12px;"
                      @click="openTrackEditPanel(track)">
                      +
                    </div>
                  </div>
              </div>
            </div>
            <div v-else>
              <v-progress-circular :size="20" :width="2" indeterminate color="#111"></v-progress-circular>
            </div>
          </div>
          </v-col>
          <v-col cols="12">
            <div class="release-page__section">
              <div class="mb-3">
                <h3>Youtube</h3>
              </div>
              <div>
                <div v-if="release.youtubeVideoID">
                  <a :href="'https://www.youtube.com/watch?v=' + release.youtubeVideoID" class="table-item__title"
                    target="_blank">{{ release.youtubeVideoID }}</a>
                </div>
                <div v-else class="text-grey">
                  Not on Youtube
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" v-if="release.youtubeVideoID">
            <div class="release-page__section">
              <div class="mb-3">
                <h3>Youtube Copyright claims</h3>
              </div>
              <div>
                <div>
                  <div v-for="(item, index) in release.youtubeCopyrightOwners" :key="index"
                    class="d-flex align-top justify one-claim">
                    <div class="form-groups-wrap mr-3">
                      <label for="distributor">Distributor</label>
                      <div class="form-group" v-for="(distributor, index) in item.distributor" :key="index">
                        <input type="text" name="distributor" v-model.trim="item.distributor[index]">
                      </div>
                      <div variant="outlined" class="btn sm-btn no-full-w" style="font-size: 16px; line-height: 19px;"
                        @click="addField(index, 'distributor')">
                        +
                      </div>
                    </div>
                    <div class="form-groups-wrap">
                      <label for="label">Owner</label>
                      <div class="form-group" v-for="(label, index) in item.label" :key="index">
                        <input type="text" name="label" v-model.trim="item.label[index]">
                      </div>
                      <div>
                        <div variant="outlined" class="btn sm-btn no-full-w" style="font-size: 16px; line-height: 19px;"
                          @click="addField(index, 'label')">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div variant="outlined" class="btn sm-btn mr-3" @click="addCopyrightOwner()">
                      Add claim
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="release-page__section">
              <div class="mb-3">
                <h3>Notes</h3>
              </div>
              <div class="mb-3" v-if="release.notes.length">
                <div class="form-group mr-3" v-for="(note, index) in release.notes" :key="index">
                  <!-- <input type="text" name="contacts" v-model="release.notes[index]">  -->
                  <v-textarea variant="outlined" v-model="release.notes[index]">{{ release.notes[index] }}</v-textarea>
                </div>
              </div>
              <div class="mb-3">
                <div variant="outlined" class="btn sm-btn no-full-w" style="font-size: 16px; line-height: 19px;"
                  @click="addNote()">
                  +
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" v-if="release.lastUpdate">
            <div class="mb-3">
              <h4>Last update</h4>
            </div>
            <div class="release-page__section">
              <div class="mb-1">User: {{ release.lastUpdate.user }}</div>
              <div>Date: {{ new Date(release.lastUpdate.date).toLocaleString("en-US") }}</div>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="release-page__section">
              <div class="d-flex">
                <div variant="outlined" class="btn mr-2" @click="editRelease()">
                  Save
                </div>
                <div variant="outlined" class="btn error" @click="panelIsOpen = true">
                  Delete
                </div>
              </div>

            </div>
          </v-col>
        </div>
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
import DiscogsIcon from '@/components/DiscogsIcon.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import SearchAutocomplete from '@/components/SearchAutocomplete.vue'
export default {
  name: "App",
  components: {
    DiscogsIcon,
    CustomSelect,
    SearchAutocomplete
  },
  data() {
    return {
      // releases: [],
      description: "",
      title: "",
      youtubeCopyrightOwnersToAdd: [],
      notLoading: true,
      panelIsOpen: false,
      panelIsOpen2: false,
      panelTrackIsOpen: false,
      selectedTrack: undefined
    };
  },
  async mounted() {
  },
  methods: {
    openTrackEditPanel(track) {
      this.selectedTrack = track;
      this.panelTrackIsOpen = true;
    },
    async editTrack() {
      console.log('selectedTrack ', this.selectedTrack)
      this.selectedTrack.authors = this.selectedTrack.authors.filter(element => {
        return element !== ''
      });
      this.selectedTrack.composers = this.selectedTrack.composers.filter(element => {
        return element !== ''
      });
      const response = await this.$store.dispatch('editTrack', { track: this.selectedTrack })
      console.log('response ', response)
      if (response.success) {
        this.panelTrackIsOpen = false;
        //this.selectedTrack = undefined;
        
      } else {
        alert ('Something wrong')
      }
    },
    addCopyrightOwner() {
      this.release.youtubeCopyrightOwners.push({ distributor: [''], label: [''] });
    },
    addField(index, property) {
      console.log('index, property ', index, property)
      console.log('111 ', this.release.youtubeCopyrightOwners)
      console.log('111 ', this.release.youtubeCopyrightOwners[0]['distributor'])

      this.release.youtubeCopyrightOwners[index][property].push('')
    },
    addNote() {
      if (this.release.notes) {
        this.release.notes.push('')
      } else {
        this.release.notes = []
        this.release.notes.push('')
      }
    },
    addTextField(field) {
      if (this.selectedTrack[field]) {
        this.selectedTrack[field].push('')
      } else {
        this.selectedTrack[field] = []
        this.selectedTrack[field].push('')
      }
    },
    newLabelSelected(value) {
      console.log('newLabelSelected ', value) // someValue
      this.release.labelID = value.id
      this.release.labelName = value.name
    },
    async editRelease() {
      this.panelIsOpen = false
      this.panelIsOpen2 = false
      this.notLoading = false
      let youtubeCopyrightOwners = []
      this.release.youtubeCopyrightOwners.map(function (row) {
        console.log('row ', row)
        row.distributor = row.distributor.filter(element => {
          console.log('element ', element)
          return element !== ''
        });
        row.label = row.label.filter(element => {
          console.log('element ', element)
          return element !== ''
        });
        console.log('row.distributor.length ', row.distributor.length)
        console.log('row.label.length ', row.label.length)
        if (row.distributor.length && row.label.length) {
          console.log('1')
          youtubeCopyrightOwners.push(row)
          //return row
        } else if (!row.distributor.length && row.label.length) {
          console.log('2')
          row.distributor.push('')
          youtubeCopyrightOwners.push(row)
          //return row
        } else if (row.distributor.length && !row.label.length) {
          console.log('3')
          row.label.push('')
          youtubeCopyrightOwners.push(row)
          //return row
        }

      });
      this.release.youtubeCopyrightOwners = youtubeCopyrightOwners
      // this.release.youtubeCopyrightOwners = []
      console.log('youtubeCopyrightOwners ', youtubeCopyrightOwners)
      this.release.notes = this.release.notes.filter(element => {
        return element !== ''
      });
      this.release.authors = this.release.authors.filter(element => {
        return element !== ''
      });
      this.release.composers = this.release.composers.filter(element => {
        return element !== ''
      });
      await this.$store.dispatch('editRelease', { release: this.release })
      setTimeout(() => {
        this.notLoading = true
      }, 1000);

    },
    async putOnSale() {
      this.notLoading = false
      await this.$store.dispatch('putOnSale', { release: this.release })
      setTimeout(() => {
        this.notLoading = true
      }, 1000);
    },
    async changeSelect(event, field) {
      console.log('changeStatus ', event)
      this.release[field] = event
    },
    async deleteRelease() {
      await this.$store.dispatch('deleteRelease', { release: this.release })
      this.panelIsOpen = false
      this.$router.push({ path: '/releases' })
    }
  },
  computed: {
    release() {
      return this.$store.getters.getRelease(this.$route.params.id);
    },
    tracks() {
      return this.$store.getters.getReleaseTracks(this.release.releaseID)
    },
    allLabelsList() {
      return this.$store.getters.getAllLabelsList
    },
    releasesAllStatuses() {
      return this.$store.getters.getAllReleasesStatuses
    },
    releasesAllTypes() {
      return this.$store.getters.getAllReleasesTypes
    },
    releasesAllSources() {
      return this.$store.getters.getAllReleasesSources
    },
  },
  watch: {
    // 'release.status': function (oldValue, newValue) {
    //   console.log('status newValue ', oldValue, newValue)
    //   if (newValue !== oldValue) {
    //     this.editRelease(newValue)
    //   }

    // },
  }
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

.rvbd-btn {}

.fixed-container {
  width: 920px;
  max-width: 920px;
  margin: 0 auto;
}

.release-page {

  .top-row {
    border-bottom: 1px solid #ddd;
    padding-bottom: 1rem;
  }

  &__container {
    /* border: 1px solid #ddd; */
    border-radius: 10px;
    padding: 2rem;
    background: #fff;
    box-shadow: 1px 1px 10px #00000012;
    margin: 1rem;
    width: 100%;
  }

  &__section {
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    /* padding: 1.5rem; */
    /* border-radius: 6px; */
    padding-bottom: 2rem;
  }

  &__artist {
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;

    a {
      margin-right: 8px;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 400;
  }

  a {
    // color: blue;
    // text-decoration: underline;
    font-weight: 600;
  }

  .text-grey {
    color: #ddd;
  }

  .discogs-link {
    position: relative;
    display: flex;
    // &:before {
    //   position: absolute;
    //   content: "\0000a0";
    //   background: url("../assets/img/discogs-icon.svg") 0px 0px no-repeat;
    // }
  }

  &__details {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    &>div {
      margin-right: 8px;
    }

    &>div:first-child {
      width: 145px;
    }
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

  .tracklist {
    border-bottom: 0;
    padding-bottom: 1rem;
    .track-item {
      display: flex;
      // justify-content: space-between;
      padding: .5rem 0;
      border-bottom: 1px solid #ddd;

      .left-side,
      .right-side {
        display: flex;
      }

      .position {
        flex-basis: 50px;
      }
      .title {
        flex-basis: 300px;
      }
      .authors {
        flex-basis: 200px;
      }
      .composers {
        flex-basis: 200px;
      }
      .open-panel {
        flex-basis: 24px;
      }
    }
  }
}


.v-text-field input {
  background: #f6f8fa;
}

.one-claim {
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 1.5rem;
}

.v-card-actions {
  padding-bottom: 25px !important;
}

.put-on-sale {
  padding: 0.35rem 1rem !important;
}
</style>