<template>
  <b-tab title="Outros usuários">

    <div class="d-flex">
      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="mt-3"></b-pagination>
      <b-button variant="success" class="my-3 ml-auto">Criar Usuário</b-button>
      <b-button variant="danger" class="my-3 mx-3" @click="sendDeleteRequest">Deletar Selecionado</b-button>
      <table-generic-filter v-model="filter" class="mt-3"></table-generic-filter>
    </div>

    <b-table
      hover
      striped
      bordered
      outlined
      selectable
      sort-by="usuario_id"
      select-mode="single"
      selected-variant="primary"
      :items="items"
      :fields="fields"
      :filter="filter"
      :busy="isLoading"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
      <template v-slot:table-busy>
        <table-busy :hasError="hasError"></table-busy>
      </template>

      <template v-slot:cell(admin)="row">
        <b-button
          size="sm"
          class="mr-2 label-permissoes"
          :variant="(row.item.admin) ? 'success' : 'info'"
          @click="sendChangeAdminRequest(row.item)"
        >{{ (row.item.admin) ? 'Administrador' : 'Usuário Comum'}}</b-button>
      </template>

      <template v-slot:cell(active)="row">
        <b-button
          size="sm"
          class="mr-2 label-ativo"
          :variant="(row.item.active) ? 'primary' : 'dark'"
          @click="sendChangeActiveRequest(row.item)"
        >{{ (row.item.active) ? 'Ativo' : 'Inativo'}}</b-button>
      </template>
    </b-table>
  </b-tab>
</template>

<script>
import { mapGetters } from "vuex";
import TableBusy from "../common/table/TableBusy";
import tableUtils from "../../mixins/table-utils";
import TableGenericFilter from "../common/table/TableGenericFilter";
export default {
  name: "TabOutrosUsuarios",
  components: { TableBusy, TableGenericFilter },
  mixins: [tableUtils],
  data() {
    return {
      perPage: 12,
      totalRows: 0,
      currentPage: 1,

      hasError: false,
      isLoading: true,
      items: [],
      selected: [],

      filter: null,
      table: "usuario",
      fields: [
        {
          key: "usuario_id",
          label: "ID",
          sortable: true,
          type: "number",
          filter: null
        },
        {
          key: "username",
          label: "Nome de usuário",
          type: "string",
          filter: null
        },
        {
          key: "admin",
          label: "Permissão",
          type: "boolean",
          filter: null
        },
        {
          key: "active",
          label: "Status",
          type: "boolean",
          filter: null
        }
      ]
    };
  },
  methods: {
    updateTable() {
      this.$http
        .post(this.$routes.crud_select, {
          table: this.table,
          fields: this.fields
        })
        .then(res => {
          this.isLoading = false;

          // O usuário Atual não deve ser exibido
          this.items = res.data.filter(user => {
            return user.usuario_id !== this.getUser.usuario_id;
          });
        })
        .catch(err => {
          this.handleAxiosError(err);
          this.hasError = true;
          this.totalRows = 0;
        });
    },
    sendChangeActiveRequest(user) {
      this.$http
        .post(this.$routes.crud_update, {
          table: "usuario",
          data: [
            {
              keyName: "usuario_id",
              keyValue: user.usuario_id,
              values: {
                active: !user.active
              }
            }
          ]
        })
        .then(() => {
          this.updateTable();
        })
        .catch(error => {
          this.handleAxiosError(error);
          this.$bvToast.toast("Confira o log para mais detalhes", {
            title: "Erro ao Ativar/Desativar Usuário",
            variant: "warning"
          });
        });
    },
    sendChangeAdminRequest(user) {
      this.$http
        .post(this.$routes.crud_update, {
          table: "usuario",
          data: [
            {
              keyName: "usuario_id",
              keyValue: user.usuario_id,
              values: {
                admin: !user.admin
              }
            }
          ]
        })
        .then(() => {
          this.updateTable();
        })
        .catch(error => {
          this.handleAxiosError(error);
          this.$bvToast.toast("Confira o log para mais detalhes", {
            title: "Erro ao Alterar Permissões do Usuário",
            variant: "warning"
          });
        });
    },
    sendDeleteRequest() {
      // Envia apenas o ID como filtro pro back
      const items = [];
      this.selected.map(e => {
        const usuario_id = e.usuario_id;
        items.push({ usuario_id });
      });
      if (this.tableHasSelected(this.selected, "Nenhum registro selecionado")) {
        this.$swal({
          title: "Deletar os Usuários Selecionados ?",
          text: `Esta ação é irreversível`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C82333",
          cancelButtonColor: "#0069D9",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Deletar"
        }).then(alertResponse => {
          if (alertResponse.value) {
            this.$http
              .post(this.$routes.crud_delete, {
                table: "usuario",
                items
              })
              .then(() => {
                this.updateTable();
                this.$swal("Usuários deletados com sucesso !");
              })
              .catch(error => {
                this.handleAxiosError(error);
                this.$swal({
                  title: "Erro :(",
                  text: "Veja o console para mais detalhes",
                  type: "error"
                });
              });
          } else {
            this.$swal("Deleção cancelada");
          }
        });
      }
    },
    onRowSelected(items) {
      this.selected = items;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  mounted() {
    this.updateTable();
  }
};
</script>

<style scoped>
.label-permissoes {
  width: 120px !important;
}
.label-ativo {
  width: 80px !important;
}
</style>