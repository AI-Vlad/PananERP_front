<template>
  <div>
    <h1>Produtos</h1>
    <b-tabs id="tabs-root">
      <b-tab title="Registros" active class="b-tab">
        <crud-table :table="table" :fields="fields" :detailsFields="detailsFields" sortBy="produto_id"></crud-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CrudTable from "@/components/crud/Table";

export default {
  name: "ProdutosView",
  components: {
    CrudTable
  },
  data: () => {
    return {
      table: "produto",
      fields: [
        {
          key: "produto_id",
          label: "Código",
          sortable: true,
          type: "number",
          filter: null
        },
        {
          key: "descricao",
          label: "Descrição",
          sortable: false,
          type: "string",
          filter: null
        },
        {
          key: "ativo",
          label: "Ativo",
          sortable: false,
          type: "string",
          filter: null
        },
        {
          key: "prodbloqueado",
          label: "Bloqueado",
          sortable: false,
          type: "string",
          filter: null
        }
      ],
      detailsFields: [
        {
          key: "dt_cadastro",
          label: "Data Cadastro",
          filter: null,
          type: "string",
        },
        {
          key: "data_ult_alteracao",
          label: "Data Ultima Alteração",
          filter: null,
          type: "string"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
</style>
