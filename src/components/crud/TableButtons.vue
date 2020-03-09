<template>
  <div>
    <b-button v-b-modal.details-modal variant="primary" class="mx-3 mb-3">Ver Detalhes</b-button>
    <b-button variant="danger" class="mb-3" @click="deleteRows">Deletar Selecionados</b-button>
    <details-modal :selected="selected" :fields="fields" :detailsFields="detailsFields"></details-modal>
  </div>
</template>

<script>
import DetailsModal from "./DetailsModal";

export default {
  name: "Control",
  props: ["table", "fields", "selected", "detailsFields"],
  components: { DetailsModal },
  methods: {
    deleteRows() {
      if (this.selected.length === 0) {
        this.$swal("Nenhum registro selecionado");
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
        .post(this.$routes.crud_delete, {
          table: this.table,
          items: this.selected
        })
        .then(() => {
          this.$emit("updateRequest");
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
    }
  }
};
</script>
