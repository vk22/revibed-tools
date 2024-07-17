<template>
    <div class="top-bar">
      
      <div class="user" v-if="currentUser">
        <!-- {{ currentUser }} -->
        <v-menu
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ props }">
              <span class="menu-item" v-bind="props"><v-icon icon="mdi-account"></v-icon> {{ currentUser }}</span>
            </template>
            <v-list class="dropdown text-center">
              <v-list-item>
                <v-list-item-title>
                  <div class="dropdown-item" v-if="currentUser==='admin'">
                    <router-link :to="`/admin`">Admin Page</router-link>
                  </div>
                  <div class="dropdown-item" @click="logout">Logout</div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
      </div>
    </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      loading: false,
    };
  },
  async mounted() {
  },
  methods: {
    login(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", this.user).then(
        () => {
          this.$router.push("/login");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    logout() {
      this.$store.dispatch("auth/logout", this.user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    allDataReady() {
      return this.$store.getters.getAllDataReady
    },
  },
  watch: {
  },
};
</script>

<style lang="scss">

@import '../../assets/scss/main.scss'; 

.top-bar {
  width: 100%;
  padding: 1rem 0;
  margin-bottom: 0rem;
  display: flex;
  justify-content: flex-end;
  //background: $lightBackground;
  height: 100%;
  align-items: center;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  .logo {
    font-weight: 700;
  }

  .top-nav {
    a {
      margin: 0 1rem;
      color: #555;
      font-weight: 400;
      font-size: 1.1rem;

      &.router-link-active.router-link-exact-active {
        color: #111;
        font-weight: 600;
      }
    }
  }
  .user {

    .menu-item {
      padding: .75rem 1.25rem;
      //border: 1px solid #ebebeb;
      cursor: pointer;
      border-radius: 2px;
      margin-left: .5rem;
    }
  }
}

.dropdown {
  .dropdown-item {
    cursor: pointer;
  }
}
.v-menu > .v-overlay__content > .v-list {
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.10)!important;
}
</style>