<template>
  <v-navigation-drawer>
    <div class="sidebar">
      <div class="logo">
        <img src="/img/logo.svg" alt="">
      </div>
      <div class="sidebar-nav">
        <router-link to="/">Releases</router-link>
        <router-link to="/releases-not-goods">Releases Not Goods</router-link>
        <router-link to="/labels">Labels</router-link>
        <router-link to="/artists">Artists</router-link>
        <router-link to="/countries">Countries</router-link>
        <router-link to="/distributors">Distributors</router-link>
        <router-link to="/owners">Owners</router-link>
        <router-link to="/youtubes">Youtubes</router-link>
      </div>

    </div>
      <!-- <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list> -->
    </v-navigation-drawer>

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

.v-navigation-drawer {
  background: transparent!important;
  border-right: none!important;
  padding: 0 1rem;
}

.sidebar {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  //background: $lightBackground;
  flex-direction: column;
  height: 100%;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  .logo {
    width: 100%;
    font-weight: 700;
    padding: 2rem 1rem;
    margin-bottom: 0rem;

    img {
      width: 75%;
    }
  }

  .sidebar-nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    a {
      color: #555;
      font-weight: 400;
      font-size: 1.1rem;
      padding: 1rem;
      border-radius: 8px;

      &.router-link-active.router-link-exact-active {
        color: #111;
        font-weight: 600;
        background: #ebebeb;
      }
      &:hover {
        background: #f1f1f1;
        text-decoration: none;
      }
    }
  }
  .user {
    .menu-item {
      padding: .75rem 1.4rem;
      background: #ebebeb;
      cursor: pointer;
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