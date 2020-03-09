<template>
  <div>
    <h1>Ordens de Produção</h1>
    <b-tabs id="tabs-root">
      <b-tab title="Registros" active>
        <ordem-de-producao-table></ordem-de-producao-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import OrdemDeProducaoTable from "@/components/producao/ordemdeproducao/TableOrdem";

export default {
  name: "OrdemDeProducaoView",
  components: { OrdemDeProducaoTable },
};
</script>

<style scoped lang="scss">
</style>
