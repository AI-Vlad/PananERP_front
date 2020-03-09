<template>
  <b-tab title="Meu usuário" active>
    <h3 class="mt-3">Bem vindo: {{getUser.username}}</h3>
    <div class="mb-3 clearfix">
      <b-badge class="b-badge float-left" v-if="isAdmin" variant="success">admin</b-badge>
    </div>
    <b-card header="Alterar credenciais">
      <b-form>
        <b-form-group label="Senha Atual:">
          <b-form-input
            required
            v-model="password"
            type="password"
            placeholder="senha"
            :class="{ 'is-invalid': isSubmited && !isPasswordValid }"
          ></b-form-input>
          <div
            v-show="isSubmited && !isPasswordValid"
            class="invalid-feedback"
          >{{invalidPasswordMessage}}</div>
        </b-form-group>
        <b-form-group label="Novo nome de usuário:">
          <b-form-input
            required
            v-model="newUsername"
            type="text"
            placeholder="novo nome de usuário"
            :class="{ 'is-invalid': isSubmited && !isUsernameValid }"
          ></b-form-input>
          <div
            v-show="isSubmited && !isUsernameValid"
            class="invalid-feedback"
          >{{invalidUsernameMessage}}</div>
        </b-form-group>
        <b-form-group label="Nova senha:">
          <b-form-input
            required
            v-model="newPassword"
            type="password"
            placeholder="Nova Senha"
            :class="{ 'is-invalid': isSubmited && !isNewPasswordValid }"
          ></b-form-input>
          <div
            v-show="isSubmited && !isNewPasswordValid"
            class="invalid-feedback"
          >{{invalidNewPasswordMessage}}</div>
        </b-form-group>
        <b-form-group label="Confirmar nova senha:">
          <b-form-input
            type="password"
            required
            placeholder="Confirme a nova Senha"
            v-model="newPasswordConf"
            :class="{ 'is-invalid': isSubmited && !isPasswordConfirmed }"
          ></b-form-input>
          <div
            v-show="isSubmited && !isPasswordConfirmed"
            class="invalid-feedback"
          >{{passwordNotConfirmedMessage}}</div>
        </b-form-group>
        <b-button variant="primary" class @click="changeUserCredentials">Enviar</b-button>
      </b-form>
    </b-card>
  </b-tab>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";
export default {
  name: "TabMeuUsuario",
  data() {
    return {
      isSubmited: false,
      password: "",
      newUsername: "",
      newPassword: "",
      newPasswordConf: ""
    };
  },
  methods: {
    changeUserCredentials() {
      this.isSubmited = true;
      if (this.isChangeRequestValid) {
        this.$http
          .post(this.$routes.user_update, {
            oldPassword: this.password,
            newUsername: this.newUsername,
            newPassword: this.newPassword
          })
          .then(res => {
            let { newUser, token } = res.data;
            store.commit("auth_update", { newUser, token });
            this.$bvToast.toast(
              `Novo nome de usuario: ${this.getUser.username}`,
              {
                title: "Credenciais Atualizadas",
                autoHideDelay: 4000,
                appendToast: false,
                variant: "success"
              }
            );
          })
          .catch(error => {
            this.handleAxiosError(error);
            this.$bvToast.toast("Senha antiga não confere com seu cadastro", {
              title: "Erro ao atualizar usuário",
              autoHideDelay: 4000,
              appendToast: false,
              variant: "warning"
            });
          });
      }
    }
  },
  computed: {
    isUsernameValid() {
      return this.newUsername.length === 0 || (this.newUsername.length >= 4 && this.newUsername.length <= 20);
    },
    isPasswordValid() {
      return this.password.length >= 4 && this.password.length <= 20;
    },
    isNewPasswordValid() {
      return this.newPassword.length === 0 || (this.newPassword.length >= 4 && this.newPassword.length <= 20);
    },
    isPasswordConfirmed() {
      return this.newPassword === this.newPasswordConf;
    },
    invalidPasswordMessage() {
      return this.isPasswordValid
        ? ""
        : "Senha deve ter entre 4 e 20 caracteres alfanuméricos";
    },
    invalidNewPasswordMessage() {
      return this.isNewPasswordValid
        ? ""
        : "Senha nova deve ter entre 4 e 20 caracteres alfanuméricos";
    },
    invalidUsernameMessage() {
      return this.isUsernameValid
        ? ""
        : "Usuário deve ter entre 4 e 20 caracteres alfanuméricos";
    },
    passwordNotConfirmedMessage() {
      return this.isPasswordConfirmed
        ? ""
        : "Senha e sua Confirmação são diferentes";
    },
    isChangeRequestValid() {
      return (
        this.isUsernameValid &&
        this.isPasswordValid &&
        this.isNewPasswordValid &&
        this.isPasswordConfirmed
      )
    },
    ...mapGetters(["getUser", "isAdmin"]),
  }
};
</script>

<style scoped>
.b-badge {
  font-size: 18px;
  align-self: left !important;
  padding: 0.3em 0.4em !important;
}
</style>
