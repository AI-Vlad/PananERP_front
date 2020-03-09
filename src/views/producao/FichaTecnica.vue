<template>
  <div>
    <h1>Fichas Técnicas</h1>
    <b-tabs id="tabs-root">
      <b-tab title="Registros" active>
        <ficha-tecnica-table></ficha-tecnica-table>
      </b-tab>
      <b-tab title="Atualizar Ficha">
        <tab-atualizar-ficha></tab-atualizar-ficha>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import FichaTecnicaTable from "@/components/producao/fichatecnica/TableFichaTecnica";
import TabAtualizarFicha from "@/components/producao/fichatecnica/tabatualizarficha/TabAtualizarFicha";

export default {
  name: "FichaTecnicaView",
  components: {  FichaTecnicaTable, TabAtualizarFicha },
};
</script>
