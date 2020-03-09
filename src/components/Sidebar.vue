<template>
  <div id="sidebar">
    <div id="sidebar-header">
      <img src="../assets/logo.png" class="d-block mx-auto my-3" />
    </div>
    <div id="user-presentation" class="mt-4 text-center">
      <template v-if="isLoggedIn">
        <span>Bem vindo</span>
        <h3 id="username">{{getUser.username}}</h3>
      </template>
      <template v-else>
        <font-awesome-icon icon="user-lock" class="mb-3 w-100" size="3x" />
        <span class="d-block mb-2" id="login-message">realize login para utilizar o sistema</span>
      </template>
    </div>

    <ul id="main-list" class="list-unstyled components">
      <li v-for="(item, index) in navList" :key="index" @click="checkAuthToast">
        <template v-if="item.children">
          <b-button v-b-toggle="'sub-list-' + index" block class="b-button dropdown-toggle">
            <font-awesome-icon :icon="item.icon" fixed-width class="mx-1" />
            {{ item.name }}
          </b-button>

          <b-collapse :id="'sub-list-' + index">
            <ul v-for="(child, index) in item.children" :key="index" class="list-unstyled sub-list">
              <li v-if="child.url !== '/logout'">
                <router-link :to="child.url" :title="child.name">{{ child.name }}</router-link>
              </li>

              <a v-else :title="child.name" @click="logout">{{ child.name }}</a>
            </ul>
          </b-collapse>
        </template>

        <router-link v-else :to="item.url" :title="item.name" @click="checkAuthToast">
          <font-awesome-icon :icon="item.icon" fixed-width class="mx-1" />
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
export default {
  data: () => ({
    navList: [
      { url: "/dashboard", name: "Dashboard", icon: ["fas", "industry"] },
      {
        name: "Usuários",
        icon: ["fas", "user"],
        children: [
          {
            url: "/usuario/gerenciar",
            name: "Gerenciar Usuários"
          },
          {
            url: "/logout",
            name: "Logout"
          }
        ]
      },
      { url: "/estoque", name: "Estoque", icon: ["fas", "boxes"] },
      {
        name: "Produção",
        icon: ["fas", "hammer"],
        children: [
          {
            url: "/producao/produtos",
            name: "Produtos"
          },
          {
            url: "/producao/materiais",
            name: "Materiais"
          },
          {
            url: "/producao/fichatecnica",
            name: "Fichas Técnicas"
          },
          {
            url: "/producao/ordem",
            name: "Ordens de Produção"
          }
        ]
      },
      { url: "/clientes", name: "Clientes", icon: ["fas", "users"] },
      {
        url: "/notas-fiscais",
        name: "Notas Fiscais",
        icon: ["fas", "file-alt"]
      },
      {
        url: "/transportadoras",
        name: "Transportadoras",
        icon: ["fas", "truck"]
      },
      {
        name: "Sped Fiscal",
        icon: ["fas", "paste"],
        children: [
          {
            url: "/sped/bloco0",
            name: "Bloco 0"
          },
          {
            url: "/sped/blocoh",
            name: "Bloco H"
          },
          {
            url: "/sped/blocok",
            name: "Bloco K"
          }
        ]
      },
      { url: "contato", name: "Contato", icon: ["fas", "envelope"] }
    ]
  }),
  methods: {
    logout() {
      store.commit("auth_logout");
    },
    checkAuthToast() {
      if (!this.getUser)
        this.$bvToast.toast("realize login para utilizar o sistema.", {
          title: "Usuário não identificado",
          autoHideDelay: 5000,
          appendToast: false,
          variant: "warning"
        });
    }
  },
  computed: {
    ...mapGetters(["getUser", "isLoggedIn"])
  }
};
</script>

<style scoped lang="scss">
.router-link-exact-active {
  background-color: #41b883 !important;
  padding-right: 0px !important;
}

#sidebar {
  height: 100vh;
  width: 230px;
  overflow: hidden;

  color: #fff;
  background: #7386d5;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  transition: all 0.3s;

  a {
    color: #ffffff;
    text-decoration: none;
  }

  a:hover {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
  }

  #login-message {
    font-size: 18px;
  }

  #sidebar-header {
    padding: 20px;
    background: #636ccc;

    img {
      height: 70px;
    }
  }

  #user-presentation {
    padding: 0 20px 0 20px;
  }

  #username {
    font-size: 35px;
    text-align: center;
  }

  #main-list {
    margin-top: 20px;

    li a {
      padding: 10px;
      display: block;
      font-size: 1.1em;
    }

    li a:hover {
      color: #7386d5;
      background: #fff !important;
    }
  }

  .sub-list a {
    font-size: 1em !important;
    padding-left: 53px !important;
    background: #465697;
  }

  .b-button:hover {
    color: #465697;
    background: #fff !important;
  }
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 24px;
  right: 25px;
  transform: translateY(-50%);
}

.b-button {
  background-color: #7386d5;
  font-size: 1.1em;
  padding: 10px;
  border: none;
  border-radius: 0;
  box-shadow: none !important;
  position: relative !important;
  text-align: left;
}

.b-button[aria-expanded="true"],
.b-button:active {
  background: #636ccc !important;
}

.b-button:active:hover {
  color: #7386d5 !important;
}
</style>
