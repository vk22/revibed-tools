<template>
  <div class="mb-6">
  <v-responsive class="align-top fill-height" v-if="logs.length">
    <v-row>
      <v-col> <h2>Revibed Goods Updated Logs</h2> </v-col>
    </v-row>
    <v-row>
      <v-col>
      </v-col>
    </v-row>
    <div class="items-list">
      <v-row>
        <v-col cols="12" md="6">
          <div class="item mb-3" v-for="(log,index) in logs" :key="index">
            <div>{{ formatDateEn(log.date) }}</div>
            <div>{{ log.message }}</div>
          </div>
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
      logs: [],
    };
  },
  async mounted() {
    this.getAdminLogs()
  },
  methods: {
    async getAdminLogs() {
      const response = await this.$store.dispatch('auth/getAdminLogs')
      console.log('response getAdminLogs', response)
      this.logs = response.logs
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