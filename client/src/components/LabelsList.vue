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
                        <input type="text" name="name" v-model="newLabel.name"> 
                    </div>
                </v-col>
              </v-row>
          </v-container>
        <v-card-actions class="pr-4">
              <v-spacer></v-spacer>
              <div variant="outlined" class="btn sm-btn" @click="panelIsOpen = false">Cancel</div>
              <div variant="outlined" class="btn sm-btn ml-3" @click="addLabel()">Save</div>  
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-responsive class="align-top fill-height" v-if="allDataReady">
    <v-row>
      <v-col> <h2 @click="editlabels()">{{ pageTitle }} ({{ labels.length }}) </h2> </v-col>
    </v-row>

    <v-row class="mb-3">
      <v-col> 
        <div class="table-actions">
          <FilterLabels></FilterLabels>
          <v-btn class="mr-3" color="#444" variant="outlined" :disabled="selected.length === 0" @click="exportLabels()">Export</v-btn>
          <v-btn class="mr-3" color="#444" variant="outlined" @click="panelIsOpen = true">Add Label</v-btn>

          <!-- <div style="width: 200px;" class="mr-3">
            <v-select
              label="Status"
              density="compact"
              :items="['default', 'in progress', 'rejected', 'success']"
              v-model="selectedStatus"
              variant="outlined"
            ></v-select>
          </div> -->
          <!-- <v-btn variant="outlined" :disabled="selected.length === 0" @click="exportLabels()">Change status</v-btn> -->
        </div>
        <!-- <div> {{ sortBy }}</div>
        <div>{{ pageNum }}</div> -->
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
              v-model="selected"
              :headers="headers"
              :items="labels"
              :search="search"
              :items-per-page="itemsPerPage"
              v-model:page="pageNum"
              :show-current-page="true"
              @click="tableClick"
              show-select
            >
          
            <template v-slot:item.name="{ item }">
                <router-link :to="{ name: `${LabelPage}`, params: { id: item.id } }" class="table-item__title">{{ item.name }}</router-link>
            </template>

            <!-- <template v-slot:item.status="{ item }">
              <div class="text-end">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :text="item.status"
                  label
                ></v-chip>
              </div>
            </template> -->

            <template v-slot:item.count="{ item }">
              <span>{{ item.count }}</span>
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

<!-- 
            <template v-slot:bottom>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="pageNum"
                  :length="pageCount"
                ></v-pagination>
              </div>
            </template> -->

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
import FilterLabels from "@/components/FilterLabels.vue";
export default {
  name: "App",
  components: {
    CustomSelect,
    FilterLabels
  },
  data() {
    return {
      search: '',
      selected: [],
      description: "",
      title: "",
      readyToShow: false,
      labelsOnPage: [],
      labelsInStoreFiltered: [],
      labelsToAddOnPage: [],
      labelsForGettingCount: 50,
      labelsOnPageCount: 0,
      headers: [
          { key: 'name', title: 'name', width: '400px' },
          { key: 'count', title: 'count', width: '100px' },
          { key: 'contacts', title: 'contacts', width: '200px' },
          { key: 'statusContact', title: 'status Contact', align: 'end' },
          { key: 'status', title: 'status', align: 'end' },
          { key: 'statusYoutube', title: 'statusYoutube', align: 'end' },

          
      ],
      selectedStatus: undefined,
      itemsPerPage: 50,
      //sortBy: [{ key: 'count', order: 'desc' }],
      //filterStatusContact: 'All',
      // filterStatusMain: 'All',
      // filterStatusContacts: false,
      hasContacts: false,
      panelIsOpen: false,
      newLabel: {
        name: ''
      },
      isHuman: false
    };
  },
  async mounted() {
    console.log('this.$refs.myTable ', this.$refs.myTable)

  },
  methods: {
    // pageChange(newPage) {
    //   console.log('newPage ', newPage)
    // },
    tableClick() {
      console.log('tableClick ')
      this.isHuman = true
    },
    async exportLabels() {
      await this.$store.dispatch('exportLabels', this.selected)
    },
    async editlabels() {
      await this.$store.dispatch('editlabels')
    },
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
    async addLabel() {
      this.panelIsOpen = false
      let pageType = this.$route.fullPath.split('/')[1]
      await this.$store.dispatch('addLabel', {label: this.newLabel, type: pageType})
    },
  },
  computed: {
    sortBy: {
      get(){
        return this.$store.getters.getTableState({name: 'labels', type: 'sortBy'})
      },
      set(value){
        this.$store.commit('setTableState', {name: 'labels', type: 'sortBy', value: value})
      }
    },
    pageNum: {
      get(){
        return this.$store.getters.getTableState({name: 'labels', type: 'pageNum'})
      },
      set(value){
        if (this.isHuman) {
          this.$store.commit('setTableState', {name: 'labels', type: 'pageNum', value: value})
        } else {
          setTimeout(() => {
            if (this.isHuman) {
              this.$store.commit('setTableState', {name: 'labels', type: 'pageNum', value: value})
            }
          }, 250);
        }
      }
    },
    pageCount () {
        return Math.ceil(this.labels.length / this.itemsPerPage)
    },
    LabelPage() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'labels') {
        return 'LabelPage';
      } else if (pageType === 'distributors') {
        return 'DistributorPage';
      } else if (pageType === 'owners') {
        return 'OwnerPage';
      }  
    },
    pageTitle() {
      let pageType = this.$route.fullPath.split('/')[1]
      if (pageType === 'labels') {
        return 'Labels';
      } else if (pageType === 'distributors') {
        return 'Distributors';
      } else if (pageType === 'owners') {
        return 'Owners';
      }  
    },
    pageType() {
      return this.$route.fullPath.split('/')[1]
    },
    labels() {
      let pageType = this.$route.fullPath.split('/')[1]
      return this.$store.getters.getLabelsList(pageType);     
    },
    // labels() {
    //   let pageType = this.$route.fullPath.split('/')[1]
    //   if (pageType === 'labels') {
    //     return this.$store.getters.getLabelsList(this.filterState);
    //   } else if (pageType === 'distributors') {
    //     return this.$store.getters.getDistributors;
    //   } else if (pageType === 'owners') {
    //     return this.$store.getters.getOwners;
    //   }      
    // },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    },
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
    }
    
  },
  watch: {
    selected: function (newVal, oldVal) {
      console.log('watch selected', newVal, oldVal)
    },
    // labels: function (newVal, oldVal) {
    //   console.log('watch labels', newVal)
    // },
  },
};
</script>

<style lang="scss">

@import "../assets/scss/main.scss";

.label-row {
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