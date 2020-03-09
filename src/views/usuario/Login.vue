<template>
  <div id="container" class="h-100 row">
    <div id="login-root" class="mx-auto my-auto shadow-sm">
      <img src="../../assets/user_icon.gif" alt id="user-icon" class="mx-auto d-block" />
      <div class="form-group">
        <label for="username">Usuário</label>
        <input
          id="username-input"
          v-model="username"
          type="text"
          name="username"
          class="form-control"
          :class="{ 'is-invalid': isSubmited && !isUsernameValid }"
          title="Entre 4 e 20 caracteres alfanuméricos"
        />
        <div v-show="isSubmited && !isUsernameValid" class="invalid-feedback">{{invalidUsernameMessage}}</div>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          id="password-input"
          v-model="password"
          type="password"
          name="password"
          class="form-control"
          :class="{ 'is-invalid': isSubmited && !isPasswordValid }"
          title="Entre 4 e 20 caracteres alfanuméricos, evite usar o nome de usuário dentro da senha !"
        />
        <div v-show="isSubmited && !isPasswordValid" class="invalid-feedback">{{invalidPasswordMessage}}</div>
      </div>

      <div class="form-group mb-0">
        <b-button variant="success" @click="handleSubmit" class="w-100">Login</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      isSubmited: false
    };
  },
  computed: {
    isUsernameValid() {
      return this.username.length >= 4 && this.username.length <= 20;
    },
    isPasswordValid() {
      return this.password.length >= 4 && this.password.length <= 20;
    },
    invalidPasswordMessage() {
      return this.isPasswordValid
        ? ""
        : "Senha deve ter entre 4 e 20 caracteres alfanuméricos";
    },
    invalidUsernameMessage() {
      return this.isUsernameValid
        ? ""
        : "Usuário deve ter entre 4 e 20 caracteres alfanuméricos";
    },
    ...mapGetters(["isLoggedIn"])
  },
  methods: {
    handleSubmit() {
      this.isSubmited = true;

      if (this.isUsernameValid && this.isPasswordValid) {
        let { username, password } = this;
        this.$http
          .post(this.$routes.login, {
            username,
            password
          })
          .then(res => {
            let { token, user } = res.data;
            store.commit("auth_success", { token, user });
          })
          .catch(err => {
            this.handleAxiosError(err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            this.showToastCredenciaisInvalidas(err.response.data);
          });
      }
    },
    showToastCredenciaisInvalidas(message) {
      this.$bvToast.toast(message, {
        title: "Erro ao realizar login",
        autoHideDelay: 5000,
        appendToast: false,
        variant: "warning"
      });
    }
  }
};
</script>

<style scoped>
#login-root {
  width: 400px;
  border: 1px solid #ced4da;
  padding: 30px;
  border-radius: 15px;
}

#user-icon {
  height: 200px;
  margin-bottom: 20px;
}
</style>
