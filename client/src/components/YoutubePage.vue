<template>
  <div class="fixed-container">
    <v-responsive class="youtube-page align-top fill-height" v-if="youtube && notLoading">
      <!-- {{ youtube }} -->
      <v-row>
        <v-col>
          <div class="backBtn"><div @click="$router.go(-1);"><v-icon>mdi-chevron-left</v-icon> Back</div></div>
        </v-col>
      </v-row>        
        <v-row>
          <v-col cols="12">
            <div class="youtube-page__section">
              <div class="mb-5 d-flex justify-space-between">
                <div>
                  <div class="youtube-page__title">{{ youtube.title }}</div>
                </div>
              </div>
              <div class="youtube-page__details">
                <div>Youtube ID:</div> 
                <div>
                  <a :href="`https://www.youtube.com/watch?v=${youtube.videoId}`" target="_blank">{{ youtube.videoId }}</a>
                  
                </div>
              </div>     
            </div>
          </v-col>
          <v-col cols="12">
            <div class="mb-3"><h3>Discogs Release</h3></div>
            <div class="youtube-page__section">
              <div>
                <div class="form-group mr-3">
                    <input type="text" name="contacts" v-model="youtube.discogsRelease"> 
                  </div>
              </div>
              <div class="d-flex">
                  <div variant="outlined" class="btn sm-btn" @click="editYoutube()">
                     Save
                  </div>
                </div>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="youtube-page__section">
              <div class="d-flex">
                  <div variant="outlined" class="btn sm-btn" @click="deleteyoutube()">
                     Delete
                  </div>
                </div>
            </div>
          </v-col>
          
        </v-row>
      
      <!-- <v-row>
        <v-col>
          <div><b>{{ youtube.title }}</b></div>
          <div>{{ youtube.youtubeID }}</div>
          <div>{{ youtube.youtubeName}}</div>
          <div>{{ youtube.youtubeLink}}</div>
          
          
        </v-col>
      </v-row> -->
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
export default {
  name: "App",
  components: {
    DiscogsIcon,
    CustomSelect
  },
  data() {
    return {
      // youtubes: [],
      description: "",
      title: "",
      youtubeCopyrightOwnersToAdd: [],
      notLoading: true
    };
  },
  async mounted() {
  },
  methods: {
    async editYoutube() {
      this.notLoading = false
      await this.$store.dispatch('editYoutube', {youtube: this.youtube})
      setTimeout(() => {
        this.notLoading = true
      }, 1000);
    },
    async deleteyoutube() {
      await this.$store.dispatch('deleteyoutube', {youtube: this.youtube})
      this.$router.push({ path: '/youtubes' })
    }
  },
  computed: {
    youtube() {
      return this.$store.getters.getYoutube(this.$route.params.id);
    }
  },
  watch: {
    // 'youtube.status': function (oldValue, newValue) {
    //   console.log('status newValue ', oldValue, newValue)
    //   if (newValue !== oldValue) {
    //     this.edityoutube(newValue)
    //   }
      
    // },
  } 
};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.rvbd-btn {

}

.fixed-container {
  width: 920px;
  max-width: 920px;
  margin: 0 auto;
}

.youtube-page {

  &__artist {
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    a {
      margin-left: 8px;
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

  &__section {
    background: #fff;
    border: 1px solid #ddd;
    padding: 1.5rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  &__details {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    & > div {
      margin-right: 8px;
    }
    & > div:first-child {
      width: 100px;
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
  .label-youtube {
    display: flex;
    justify-content: space-between;
  }
}


.v-text-field input {
  background: #f6f8fa;
}

.one-claim {
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 1.5rem;
}




</style>