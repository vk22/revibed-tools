import axios from 'axios';

//const VITE_API_URL = 'http://localhost:3000/';
//const import.meta.env.VITE_API_URL = 'http://labels.kx-streams.com/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(import.meta.env.VITE_API_URL + '/auth/login', {
        username: user.username,
        password: user.password,
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data.username));
          localStorage.setItem('token', JSON.stringify(response.data.token));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(import.meta.env.VITE_API_URL + '/auth/register', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }

  getuser(token) {
    return axios.get(import.meta.env.VITE_API_URL + '/auth/user', {
      params: {
        token: token
      }
    });
  }
  getusers(token) {
    return axios.get(import.meta.env.VITE_API_URL + '/auth/users', {
      params: {
        token: token
      }
    });
  }
  getAdminLogs(token) {
    return axios.get(import.meta.env.VITE_API_URL + '/get-logs', {
      params: {
        token: token
      }
    });
  }

}

export default new AuthService();
