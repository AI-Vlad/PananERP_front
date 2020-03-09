<template>
  <div>
    <h1>Transportadoras</h1>
    <b-tabs id="tabs-root">
      <b-tab title="Registros" active class="b-tab">
        <crud-table :table="table" :fields="fields" sortBy="transportadora_id"></crud-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CrudTable from "@/components/crud/Table";

export default {
  name: "TransportadorasView",
  components: {
    CrudTable
  },
  data: () => {
    return {
      table: "transportadora",
      fields: [
        {
          key: "transportadora_id",
          label: "ID",
          sortable: true,
          type: "number",
          filter: null
        },
        {
          key: "nome",
          label: "Nome",
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
