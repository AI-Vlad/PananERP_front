import router from '../router';
import axios from "axios";
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
  },

  mutations: {
    // This is called whenever the app renders, we can set the app defaults here
    initialize(state) {
      axios.defaults.headers.common["auth-token"] = state.token;
    },
    auth_success(state, payload) {
      let { token, user } = payload;
      axios.defaults.headers.common["auth-token"] = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      state.token = token;
      state.user = user;
      router.push("dashboard");
    },
    auth_update(state, payload) {
      let { newUser, token } = payload;
      axios.defaults.headers.common["auth-token"] = token;
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", token);
      state.user = newUser;
      state.token = token;
    },
    auth_logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      if (router.currentRoute.path !== '/login') router.push("/login");
    },
  },

  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    isAdmin(state) {
      return state.user.admin;
    },
    getUser(state) {
      return state.user;
    }
  },
});
