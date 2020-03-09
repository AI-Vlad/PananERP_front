<template>
  <div>
    <h1>Materiais</h1>
    <b-tabs id="tabs-root">
      <b-tab title="Registros" active class="b-tab">
        <crud-table :table="table" :fields="fields" sortBy="material_id"></crud-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CrudTable from "@/components/crud/Table";

export default {
  name: "MateriaisView",
  components: {
    CrudTable
  },
  data: () => {
    return {
      table: "material",
      fields: [
        {
          key: "material_id",
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
          key: "unidadeent",
          label: "UN Entrada",
          sortable: false,
          type: "string",
          filter: null
        },
        {
          key: "unidadesaida",
          label: "UN Saída",
          sortable: false,
          type: "string",
          filter: null
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
</style>
