<template>
  <div>
    <h1>Clientes</h1>
    <b-tabs>
      <b-tab title="Registros" active>
        <crud-table :table="table" :fields="fields" :detailsFields="detailsFields" sortBy="cliente_id"></crud-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CrudTable from "@/components/crud/Table";

export default {
  name: "ClientesView",
  components: {
    CrudTable
  },
  data: () => {
    return {
      table: "cliente",
      fields: [
        {
          key: "cliente_id",
          label: "ID",
          sortable: true,
          filter: null,
          type: "number"
        },
        {
          key: "nome",
          label: "Nome",
          filter: null,
          type: "string"
        },
        {
          key: "nomefantasia",
          label: "Nome Fantasia",
          sortable: true,
          filter: null,
          type: "string"
        },
        {
          key: "endereco",
          label: "Endereço",
          filter: null,
          type: "string",
        },
        {
          key: "fone",
          label: "Telefone",
          filter: null,
          type: "string",
        }
      ],
      detailsFields: [
        {
          key: "cep",
          label: "CEP",
          filter: null,
          type: "number",
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
</style>
