<template>
  <div>
    <table-filters :table="table" :fields="fields" @updateRequest="updateTable"></table-filters>

    <b-form inline>
      <b-pagination class="mb-3" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>

      <table-buttons
        class="ml-auto"
        :table="table"
        :fields="fields"
        :selected="selected"
        :detailsFields="detailsFields"
        @updateRequest="updateTable"
      ></table-buttons>
    </b-form>

    <b-table
      hover
      striped
      bordered
      outlined
      selectable
      selected-variant="primary"
      show-empty
      :busy="busy"
      :items="items"
      :fields="fields"
      :sort-by="sortBy"
      :per-page="perPage"
      :current-page="currentPage"
      @row-selected="onRowSelected"
    >
      <template v-slot:table-busy>
        <table-busy :hasError="hasError"></table-busy>
      </template>

      <template v-slot:empty="scope">
        <h4 class="text-center my-2">Nenhum registro encontrado</h4>
      </template>
    </b-table>
  </div>
</template>

<script>
import TableFilters from "./TableFilters";
import TableButtons from "./TableButtons";
import TableBusy from "../common/table/TableBusy";

export default {
  name: "CrudTable",
  props: ["table", "fields", "detailsFields", "sortBy"],
  components: {
    TableBusy,
    TableButtons,
    TableFilters
  },
  data: () => {
    return {
      items: [],
      selected: [],
      busy: true,
      perPage: 12,
      currentPage: 1,
      totalRows: null,
      hasError: false
    };
  },
  methods: {
    updateTable() {
      let fields =
        typeof this.detailsFields !== "undefined"
          ? this.fields.concat(this.detailsFields)
          : this.fields;
      this.$http
        .post(this.$routes.crud_select, {
          table: this.table,
          fields
        })
        .then(res => {
          this.busy = false;
          this.hasError = false;

          this.items = res.data;
          this.totalRows = res.data.length;
        })
        .catch(error => {
          this.totalRows = 0;
          this.hasError = true;
          this.handleAxiosError(error);
        });
    },
    onRowSelected(items) {
      this.selected = items;
    }
  },
  mounted() {
    this.updateTable();
  }
};
</script>
