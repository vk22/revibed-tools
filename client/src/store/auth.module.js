import AuthService from '../services/auth.service';
import router from '@/router'

const user = JSON.parse(localStorage.getItem('user'));
const token = JSON.parse(localStorage.getItem('token'));
// console.log('user ', user)
const initialState = user
  ? { status: { loggedIn: true }, user: user, token: token}
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    getuser({ commit, state }, token) {
     
      return AuthService.getuser(state.token).then(
        response => {
          // console.log('response.data ', response.data)
          //commit('registerSuccess');
          if (!response.data.success) {
            AuthService.logout();
            commit('logout');
          }
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          console.log('aaaaaaaaaa')
          return Promise.reject(error);
        }
      );
    },
    getusers({ commit, state }, token) {
      // console.log('getusers store ')
      return AuthService.getusers(state.token).then(
        response => {
          console.log('response.data ', response.data)
          //commit('registerSuccess');
          if (!response.data.success) {
            AuthService.logout();
            commit('logout');
          }
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    getAdminLogs({ commit, state }, token) {
      // console.log('getusers store ')
      return AuthService.getAdminLogs(state.token).then(
        response => {
          console.log('response.data ', response.data)
          //commit('registerSuccess');
          if (!response.data.success) {
            AuthService.logout();
            commit('logout');
          }
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    loginSuccess(state, user) {
      console.log('loginSuccess ', user)
      state.status.loggedIn = true;
      state.user = user.username;
      state.token = user.token
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      document.location.reload();
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  },
  getters: {
    getUserToken(state) {
      return state.token;
  },
  }
};
