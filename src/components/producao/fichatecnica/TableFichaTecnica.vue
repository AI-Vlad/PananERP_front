<template>
  <div>
    <div class="d-flex">
      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="mt-3"></b-pagination>
      <b-button variant="success" class="my-3 ml-auto" @click="showCreateModal">Nova Ficha Técnica</b-button>
      <b-button variant="danger" class="my-3 mx-3" @click="sendDeleteRequest">Deletar Selecionados</b-button>
      <table-generic-filter v-model="filter" class="mt-3"></table-generic-filter>
    </div>
    <b-table
      striped
      bordered
      outlined
      selectable
      sort-by="ficha"
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

      <template v-slot:cell(show_details)="row">
        <b-button size="sm" class="mr-2" @click="row.toggleDetails" variant="info">Detalhes</b-button>
      </template>

      <template v-slot:row-details="row" selectRow>
        <div v-if="row.item.insumos">
          <template class="mb-2" v-for="(insumo, index) in row.item.insumos">
            <div :key="index" class="d-flex p-1">
              <div class="col-5">{{ insumo.insumo }}</div>
              <div class="col-1">
                % perda:
                <b>{{ insumo.percentualperda }}</b>
              </div>
              <div class="col-1">
                UN:
                <b>{{ insumo.unidade }}</b>
              </div>
              <div class="col-2">
                Preço UN:
                <b>{{ insumo.preco }}</b>
              </div>
              <div class="col-1">
                QTD:
                <b>{{ insumo.quantidade }}</b>
              </div>
              <div class="col-2">
                Preço final:
                <b>{{ insumo.valorTotal }}</b>
              </div>
            </div>
          </template>
          <hr />
        </div>

        <div>
          <span class="float-left ml-4">
            Despesas:
            {{row.item.valoracrescimo}}
          </span>
          <span class="float-left ml-4">
            Insumos:
            {{row.item.valorInsumos}}
          </span>
          <span text-right class="float-left ml-4">
            Total:
            <b>{{row.item.valorTotal}}</b>
          </span>
        </div>
      </template>
      <template v-slot:cell(vigente)="row">
        <b-button v-if="row.item.vigente" size="sm" class="label-vigencia" disabled variant="success">Vigente</b-button>
        <b-button
          v-else
          size="sm"
          class="label-vigencia"
          variant="danger"
          disabled
        >Expirada</b-button>
      </template>
    </b-table>
    <new-ficha-modal ref="create-ficha-modal" @update-request="updateTable"></new-ficha-modal>
  </div>
</template>

<script>
import NewFichaModal from "./NewFichaModal";
import TableBusy from "../../common/table/TableBusy";
import tableUtils from "../../../mixins/table-utils";
import TableGenericFilter from "../../common/table/TableGenericFilter";
export default {
  name: "FichaTecnicaTable",
  components: { TableBusy, TableGenericFilter, NewFichaModal },
  mixins: [tableUtils],
  data: () => {
    return {
      items: [],
      selected: [],
      fields: [
        {
          key: "ficha",
          label: "Ficha Técnica",
          sortable: true
        },
        {
          key: "produzido",
          label: "Produto Produzido",
          sortable: true
        },
        {
          key: "datainivigencia",
          label: "Início Vigência"
        },
        {
          key: "datafimvigencia",
          label: "Fim Vigência"
        },
        {
          key: "vigente",
          label: "Vigência"
        },
        {
          key: "show_details",
          label: ""
        }
      ],
      filter: null,
      hasError: false,
      isLoading: true,
      perPage: 12,
      currentPage: 1,
      totalRows: 0,
      today: new Date()
    };
  },
  methods: {
    updateTable() {
      this.$http
        .get(this.$routes.fichatecnica_select_all)
        .then(res => {
          this.items = res.data;
          this.calcTotalInsumos();
          this.calcVigencia();
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
    calcTotalInsumos() {
      this.items.map(ficha => {
        let valorInsumos = 0;
        if (ficha.insumos) {
          ficha.insumos.map(insumo => {
            let valorTotalInsumo = insumo.preco * insumo.quantidade;
            valorInsumos += valorTotalInsumo;
            this.$set(insumo, "preco", this.toReais(insumo.preco));
            this.$set(insumo, "valorTotal", this.toReais(valorTotalInsumo));
          });
        }
        const valorFicha = valorInsumos + ficha.valoracrescimo;
        this.$set(ficha, "valorTotal", this.toBRL(valorFicha));
        this.$set(ficha, "valorInsumos", this.toBRL(valorInsumos));
        this.$set(ficha, "valoracrescimo", this.toBRL(ficha.valoracrescimo));
      });
    },
    calcVigencia() {
      this.items.map(item => {
        item.vigente = item.datafimvigencia
          ? this.today < new Date(this.dmYtoYmd(item.datafimvigencia))
          : true;
      });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    showCreateModal() {
      this.$refs["create-ficha-modal"].$refs["modal"].show();
    },
    onRowSelected(items) {
      this.selected = items;
    },
    sendDeleteRequest() {
      const items = [];
      this.selected.map(e => {
        const fichatecnica_id = e.ficha;
        items.push({ fichatecnica_id });
      });
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
                table: "fichatecnica",
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
    }
  },
  mounted() {
    this.updateTable();
  }
};
</script>

<style scoped>
.label-vigencia {
  width: 75px !important;
}
</style>
