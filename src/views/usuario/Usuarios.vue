<template>
  <div>
    <h1>Gerenciar Usuários</h1>
    <b-tabs>
      <tab-meu-usuario></tab-meu-usuario>
      <tab-outros-usuarios v-if="isAdmin"></tab-outros-usuarios>
      <b-tab title="Logs de alterações"></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TabMeuUsuario from "../../components/usuario/TabMeuUsuario";
import TabOutrosUsuarios from "../../components/usuario/TabOutrosUsuarios";

export default {
  name: "UserConfigView",
    components: {
    TabMeuUsuario,
    TabOutrosUsuarios
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>

<style scoped lang="scss">
</style>

