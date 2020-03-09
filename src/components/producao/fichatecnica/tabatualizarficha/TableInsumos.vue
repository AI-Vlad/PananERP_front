<template>
  <div>
    <div class="mb-3 d-flex align-itens-center">
      <h3 class="d-inline my-1">Composição</h3>
      <b-button
        variant="success"
        class="ml-auto"
        @click="showInsertModal"
      >Adicionar Insumo</b-button>
      <b-button variant="danger" class="ml-3" @click="deleteRows">Remover Selecionados</b-button>
    </div>

    <b-table
      hover
      striped
      bordered
      outlined
      selectable
      selected-variant="primary"
      :items="items"
      :fields="fields"
      :busy="isBusy"
      @row-selected="onRowSelected"
    >
      <template v-slot:table-busy>
        <div class="text-center my-4">
          <strong v-if="isEmpty">Ficha tecnica sem insumos</strong>
          <strong v-else-if="hasError">Erro ao carregar os insumos</strong>
          <strong v-else-if="notFound">Ficha técnica não encontrada</strong>
          <div v-else class="my-4 text-center text-primary">
            <b-spinner class="align-middle"></b-spinner>
            <strong class="ml-2">Carregando...</strong>
          </div>
        </div>
      </template>
    </b-table>
    <insert-insumos-modal ref="insert-modal" :idFicha="idFicha"></insert-insumos-modal>
  </div>
</template>

<script>
import InsertInsumosModal from "./InsertInsumoModal";
export default {
  name: "InsumosTable",
  props: ["items", "isBusy", "isEmpty", "hasError", "notFound", "idFicha"],
  components: { InsertInsumosModal },
  data: () => {
    return {
      selected: [],
      fields: [
        {
          key: "insumo",
          label: "Insumo"
        },
        {
          key: "percentualperda",
          label: "% Perda",
          sortable: true
        },
        {
          key: "unidade",
          label: "UN"
        },
        {
          key: "preco",
          label: "Preço UN",
          sortable: true
        },
        {
          key: "quantidade",
          label: "Quantidade",
          sortable: true
        },
        {
          key: "valorTotal",
          label: "Valor Total",
          sortable: true
        }
      ]
    };
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
    },
    deleteRows() {
      if (this.selected.length === 0) {
        this.$bvToast.toast("Nenhum insumo selecionado", {
          title: "Erro ao remover insumos",
          appendToast: true,
          variant: "warning"
        });
      } else {
        this.$swal({
          title: "Deletar os Registros Selecionados?",
          text: `Esta ação é irreversível`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C82333",
          cancelButtonColor: "#0069D9",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Deletar"
        }).then(result => {
          if (result.value) {
            this.sendDeleteRequest();
          } else {
            this.$swal("Deleção cancelada");
          }
        });
      }
    },
    sendDeleteRequest() {
      this.$http
        .post(this.$routes.fichatecnica_remove_insumos, {
          fichaId: this.idFicha,
          items: this.selected
        })
        .then(() => {
          this.$emit("update-request");
          this.$swal("Insumos removidos com sucesso !");
        })
        .catch(error => {
          this.handleAxiosError(error);
          this.$swal({
            title: "Erro :(",
            text: "Veja o console para mais detalhes",
            type: "error"
          });
        });
    },
    showInsertModal() {
      if (!this.idFicha) {
        this.$bvToast.toast("Nenhuma ficha selecionada", {
          title: "Erro",
          appendToast: true,
          variant: "warning"
        });
      } else {
        this.$refs["insert-modal"].$refs["modal"].show();
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
