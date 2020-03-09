<template>
  <div>
    <div class="d-flex">
      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="mt-3"></b-pagination>
      <b-button
        variant="success"
        class="my-3 ml-auto"
        @click="showCreateModal"
      >Nova Ordem de Produção</b-button>
      <b-button variant="primary" class="my-3 mx-3" @click="showUpdateModal">Atualizar Selecionado</b-button>
      <b-button variant="danger" class="my-3 mr-3" @click="sendDeleteRequest">Deletar Selecionado</b-button>
      <table-generic-filter v-model="filter" class="mt-3"></table-generic-filter>
    </div>
    <!-- {{selected}} -->
    <b-table
      hover
      striped
      bordered
      outlined
      selectable
      sort-by="id"
      select-mode="single"
      selected-variant="primary"
      :fields="fields"
      :items="items"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :busy="isLoading"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
      <template v-slot:table-busy>
        <table-busy :hasError="hasError"></table-busy>
      </template>

      <template v-slot:cell(finalizada)="row">
        <b-button v-if="row.item.finalizada" size="sm" disabled class="mr-2" variant="success">Finalizada</b-button>
        <b-button v-else size="sm" disabled class="mr-2" variant="info">Em Aberto</b-button>
      </template>
    </b-table>
    <update-ordem-modal ref="update-modal" :ordem="selected[0]" @update-request="updateTable"></update-ordem-modal>
    <create-ordem-modal ref="create-modal" @update-request="updateTable"></create-ordem-modal>
  </div>
</template>

<script>
import UpdateOrdemModal from "./UpdateOrdemModal";
import CreateOrdemModal from "./CreateOrdemModal";
import tableUtils from "../../../mixins/table-utils";
import TableBusy from "../../common/table/TableBusy";
import TableGenericFilter from "../../common/table/TableGenericFilter";
export default {
  name: "OrdemDeProducaoTable",
  components: {
    TableBusy,
    TableGenericFilter,
    UpdateOrdemModal,
    CreateOrdemModal
  },
  mixins: [tableUtils],
  data: () => {
    return {
      items: [],
      selected: [],
      fields: [
        {
          key: "id",
          label: "Nº Ordem",
          sortable: true
        },
        {
          key: "fichatecnica",
          label: "Ficha Técnica",
          sortable: true
        },
        {
          key: "solicitado",
          label: "QTD Solicitada",
          sortable: true
        },
        {
          key: "produzido",
          label: "QTD Produzida",
          sortable: true
        },
        {
          key: "custounidadereais",
          label: "Custo UN",
          sortable: true
        },
        {
          key: "custototalreais",
          label: "Total",
          sortable: true
        },
        {
          key: "produto",
          label: "Produto"
        },
        {
          key: "abertura",
          label: "Data Abertura",
          sortable: true
        },
        {
          key: "conclusao",
          label: "Data Conclusão",
          sortable: true
        },
        {
          key: "finalizada",
          label: ""
        }
      ],
      filter: null,
      hasError: false,
      isLoading: true,
      perPage: 12,
      currentPage: 1,
      totalRows: null,
      today: new Date()
    };
  },
  methods: {
    isFinalizado(dtConclusao) {
      return dtConclusao ? this.today >  new Date(this.dmYtoYmd(dtConclusao)) : false
    },
    updateTable() {
      this.$http
        .get(this.$routes.ordem_producao_select_all)
        .then(res => {
          res.data.map(e => {
            e.finalizada = this.isFinalizado(e.conclusao);
            e.custounidadereais = this.toReais(e.custounidade);
            e.custototalreais = this.toReais(e.custototal);
          });
          this.items = res.data;
          this.isLoading = false;
          this.hasError = false;
          this.totalRows = this.items.length;
        })
        .catch(error => {
          this.handleAxiosError(error);
          this.hasError = true;
          this.totalRows = 0;
        });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onRowSelected(item) {
      this.selected = item;
    },
    sendDeleteRequest(){
      const items = []
      this.selected.map(e => {
        const ordemproducao_id = e.id;
        items.push({ ordemproducao_id });
      })
      if (this.tableHasSelected(this.selected, "Nenhum registro selecionado")) {
        this.$swal({
          title: "Deletar os Registros Selecionados?",
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
                table: "ordem_producao",
                items
              })
              .then(() => {
                this.updateTable();
                this.$swal("Registros deletados com sucesso !");
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
    showCreateModal() {
      this.$refs["create-modal"].$refs["modal"].show();
    },
    showUpdateModal() {
      if (
        this.tableHasOneSelected(this.selected, "Nenhum registro selecionado")
      ) {
        this.$refs["update-modal"].$refs["modal"].show();
      }
    }
  },
  mounted() {
    this.updateTable();
  }
};
</script>

<style scoped>
.valor-total-ficha {
  margin-right: 100px;
}

.insumo {
  padding: 3px 0;
}

.insumo:hover {
  background-color: #ffffff;
}
</style>
