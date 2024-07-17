<template>
    <v-responsive class="align-top fill-height" v-if="youtubes.length">

    <v-row class="mb-5">
      <v-col> 
        <h2>Youtubes ({{ youtubes.length  }})</h2> 
      </v-col>
      <v-col>
        <div class="stats-block">
          <!-- <div>Total releases: <b>{{ releases.length  }}</b> </div>
          <div>Uploaded on Youtube: <b>{{ onYoutubeCount }}</b> </div> -->
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
              :headers="headers"
              :items="youtubes"
              :search="search"
              items-per-page="200"
            >
          

            <template v-slot:item.title="{ item }">
                <router-link :to="{ name: 'YoutubePage', params: { id: item.videoId } }" class="table-item__title">{{ item.title }}</router-link>
            </template>

            <template v-slot:item.videoId="{ item }">
              <a :href="`https://www.discogs.com/youtubes/${item.videoId}`" class="table-item__videoId" target="_blank">{{ item.videoId }}</a>
            </template>

            <template v-slot:item.discogsRelease="{ item }">
               {{ item.discogsRelease }}
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
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      // releases: [],
      search: '',
      description: "",
      title: "",
      readyToShow: false,
      releasesOnPage: [],
      releasesInStoreFiltered: [],
      releasesToAddOnPage: [],
      releasesForGettingCount: 50,
      releasesOnPageCount: 0,
      headers: [ 
          { key: 'videoId', title: 'videoId' },
          { key: 'title', title: 'Title'},
          { key: 'discogsRelease', title: 'Discogs Release' },
      ],
      sortBy: [{ key: 'title', order: 'asc' }],
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
    getreleasesByPage(releasesInStore, action) {
      if (action !== 'scroll') {
        this.releasesOnPageCount = 0
        this.releasesForGettingCount = 50
      }
      this.releasesToAddOnPage = releasesInStore.slice(
        this.releasesOnPageCount,
        this.releasesOnPageCount + this.releasesForGettingCount
      );
      this.releasesOnPageCount = this.releasesOnPageCount + this.releasesForGettingCount;
      if (!this.releasesOnPage.length) {
        this.releasesOnPage = [].concat(this.releasesToAddOnPage)
      } else {
        if (action === 'scroll') {
          this.releasesOnPage = this.releasesOnPage.concat(this.releasesToAddOnPage)
        } else {
          this.releasesOnPage = [].concat(this.releasesToAddOnPage)
        }
      }
    },
    handleScroll () {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        console.log('подгрузка')
        //this.$store.commit('getreleasesByPage', 'scroll')
        this.getreleasesByPage(this.releases, 'scroll')
      }
    },
    formatDateEn(date) {
        //console.log('formatDate locale ', state.locale)
        var monthsArr = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ]
        date = new Date(date)
        const dd = (date.getDate() < 10 ? '0' : '') + date.getDate()
        const MM = monthsArr[date.getMonth()]
        const yyyy = date.getFullYear()
        return (dd + ' ' + MM + ' ' + yyyy)
    },
    getStatusColor(status) {
      switch (status) {
        case 'default':
          return 'grey'
          break;
        case 'in progress':
          return 'blue'
          break;
        case 'rejected':
          return 'red'
          break;
        case 'success':
          return 'green'
          break;          
        default:
          return 'grey'
          break;
      }
    },
  },
  computed: {
    youtubes() {
      return this.$store.getters.getYoutubes;
    },
    onYoutubeCount() {
      return this.$store.getters.getOnYoutubeCount;
    },
    
  },
  watch: {
    releases: function (query) {
      //this.$store.commit(query, 'filter')
      this.getreleasesByPage(this.releases, 'start')
    },
  }
};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.width-400 {
  width: 400px;
}

.stats-block {
  text-align: right;

  b {
    width: 38px;
    display: inline-block;
  }
}



</style>