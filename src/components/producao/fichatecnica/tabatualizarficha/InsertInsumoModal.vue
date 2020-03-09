<template>
  <b-modal
    ref="modal"
    size="lg"
    scrollable
    ok-variant="success"
    title="Inserir Insumo"
    cancel-variant="danger"
    cancel-title="Cancelar"
    ok-title="Inserir Insumo"
    @ok="handleOk"
  >
    <div>
      <label for="insumo_id">ID Insumo</label>
      <input type="number" name="insumo_id" class="form-control" v-model="insumo_id" @input="searchInsumo" />

      <label for="desc" class="mt-3">Descrição</label>
      <input type="text" name="desc" disabled class="form-control" v-model="descricao" />

      <label for="quant" class="mt-3">Quantidade</label>
      <input
        v-model="quantidade"
        name="quant"
        type="number"
        class="form-control"
        :disabled="insumo_id === ''"
      />

      <label for="un_medida" class="mt-3">Unidade de Medida</label>
      <input type="text" name="un_medida" disabled class="form-control" v-model="un_medida" />

      <label for="perc_perda" class="mt-3">Percentual de perda</label>
      <input
        v-model="perc_perda"
        name="perc_perda"
        type="number"
        class="form-control"
        :disabled="insumo_id === ''"
      />

      <label for="valor_un" class="mt-3">Valor Unitário</label>
      <input type="text" name="valor_un" disabled class="form-control" v-model="valorUnitarioReais" />

      <label for="valor_total" class="mt-3">Valor Total</label>
      <input type="text" name="quant" disabled class="form-control" v-model="valorTotal" />
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "InsertInsumosModal",
  props: ["idFicha"],
  data: () => {
    return {
      insumo_id: null,
      descricao: "Digite o ID do insumo para procurar",
      quantidade: 1,
      perc_perda: 0,
      un_medida: null,
      valorUnitario: 0,
    };
  },
  computed: {
    valorTotal() {
      return this.toReais(this.quantidade * this.valorUnitario);
    },
    valorUnitarioReais() {
      return this.toReais(this.valorUnitario);
    }
  },
  methods: {
    searchInsumo() {
      if (this.insumo_id) {
        this.$http
          .get(this.$routes.insumo_select_by_pk, {
            params: {
              id: this.insumo_id
            }
          })
          .then(res => {
            let { produto_id, descricao, unidadesaida, precocusto } = res.data;
            if (res.data) {
              this.insumo_id = produto_id;
              this.descricao = descricao;
              this.un_medida = unidadesaida;
              this.valorUnitario = precocusto.toFixed(2);
            } else {
              this.descricao = "Produto não encontrado";
            }
          })
          .catch(error => {
            this.handleAxiosError(error);
            this.clearData();
          });
      } else {
        this.clearData();
      }
    },
    clearData() {
      this.insumo_id = null;
      this.un_medida = null;
      this.quantidade = 1;
      this.perc_perda = 0;
      this.valorUnitario = 0;
      this.descricao = "Produto não encontrado";
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.$http
        .post(this.$routes.fichatecnica_add_insumo, {
          fichaId: this.idFicha,
          insumoId: this.insumo_id,
          quantidade: this.quantidade,
          percentualPerda: this.perc_perda
        })
        .then(() => {
          this.$refs["modal"].hide();
          this.$parent.$emit("update-request");
          this.clearData();
        })
        .catch(err => {
          this.handleAxiosError(err);
          this.$swal({
            title: "Ops",
            text: "Erro ao inserir insumo",
            type: "error"
          });
        });
    }
  }
};
</script>
