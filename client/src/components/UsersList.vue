<template>
  <div>
  <v-responsive class="align-top fill-height" v-if="users.length">
    <v-row>
      <v-col> <h2>Users</h2> </v-col>
    </v-row>
    <v-row>
      <v-col>
      </v-col>
    </v-row>
    <div class="table-block">
      <v-row>
        <v-col v-for="user in users" :key="user.username" cols="12" md="6">
          <v-card class="user-item" :title="user.username">
          <div class="logs" v-if="user.logs.length">
            <div class="log-item" v-for="(log, index) in user.logs" :key="index">
              <span>{{ log.section }}</span>
              <span><a :href="'/'+log.section+'/'+log.pageID"> {{ log.pageID }}</a></span>
              <span>{{ formatDateEn(log.date) }}</span>
            </div>
          </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-responsive>
  <v-responsive class="align-center fill-height" v-else>
    <div class="text-center">
      <v-progress-circular indeterminate color="#111"></v-progress-circular>
    </div>
  </v-responsive>
</div>
</template>

<script>
import CustomSelect from '@/components/CustomSelect.vue'
import axios from 'axios'
export default {
  name: "App",
  components: {
    CustomSelect
  },
  data() {
    return {
      search: '',
      users: [],
    };
  },
  async mounted() {
    console.log('2121')
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const response = await this.$store.dispatch('auth/getusers')
      console.log('response ', response)
      this.users = response.users
    },
    formatDateEn(date) {
      //console.log('formatDate locale ', state.locale)
      var monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      date = new Date(date);
      const dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
      const MM = monthsArr[date.getMonth()];
      const yyyy = date.getFullYear();
      const h = date.getHours()
      const min = date.getMinutes()
      return dd + " " + MM + " " + yyyy + ", " + h + ":" + min;
    },

  },
  computed: {

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

.user-item {
  margin: 1rem;

  .log-item {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }
}


</style>