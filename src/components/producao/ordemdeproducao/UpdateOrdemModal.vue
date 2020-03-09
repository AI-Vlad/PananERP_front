<template>
  <b-modal
    id="modal"
    ref="modal"
    size="lg"
    scrollable
    ok-variant="success"
    title="Atualizar Ordem de Produção"
    cancel-variant="danger"
    cancel-title="Cancelar"
    ok-title="Atualizar"
    @ok="handleOk"
  >
    <!-- {{ordem}} -->
    <div>
      <label for="id" class="mt-3">ID</label>
      <input type="text" name="id" disabled class="form-control" v-model="id" />

      <label for="id_ft" class="mt-3">ID Ficha Técnica</label>
      <input type="text" name="id_ft" disabled class="form-control" v-model="id_ft" />

      <label for="desc_produzido" class="mt-3">Produto Produzido</label>
      <input
        type="text"
        name="desc_produzido"
        disabled
        class="form-control"
        v-model="desc_produzido"
      />

      <label for="qtd_solicitada" class="mt-3">Quantiadade Solicitada</label>
      <input
        v-model="qtd_solicitada"
        type="number"
        name="qtd_solicitada"
        class="form-control"
        :class="{ 'is-invalid': !isQtdSolicitadaValid }"
      />
      <div v-show="!isQtdSolicitadaValid" class="invalid-feedback">Insira um número válido</div>

      <label for="qtd_produzida" class="mt-3">Quantidade Produzida</label>
      <input
        v-model="qtd_produzida"
        type="number"
        name="qtd_produzida"
        class="form-control"
        :class="{ 'is-invalid': !isQtdProduzidaValid }"
      />
      <div v-show="!isQtdProduzidaValid" class="invalid-feedback">Insira um número válido</div>

      <label class="mt-3">Porcentagem Produzida</label>
      <b-progress :max="100" height="25px" class="mt-1">
        <b-progress-bar
          :value="this.porcentagemProduzido"
          :label="`${this.porcentagemProduzido.toFixed(0)}%`"
          :variant="this.progressVariant"
        ></b-progress-bar>
      </b-progress>

      <label for="custo_un" class="mt-3">Custo Unidade</label>
      <input type="text" name="custo_un" disabled class="form-control" v-model="custo_un" />

      <label for="custo_total" class="mt-3">Custo Total</label>
      <input type="text" name="custo_total" disabled class="form-control" v-model="custoTotalComputed" />

      <label for="dt_abertura" class="mt-3">Data Abertura</label>
      <input type="text" name="dt_abertura" disabled class="form-control" v-model="dt_abertura" />

      <label for="dt_conclusao" class="mt-3">Data Conclusão</label>
      <input type="date" name="dt_conclusao" class="form-control" v-model="dt_conclusao_formatter" />
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "UpdateOrdemModal",
  props: ["ordem"],
  data: () => {
    return {
      id: null,
      id_ft: null,
      desc_produzido: null,

      qtd_solicitada: 0,
      qtd_produzida: 0,

      custo_un: 0,
      custo_total: 0,

      dt_abertura: null,
      dt_conclusao: null,
      dt_conclusao_yyyymmdd: null,
    };
  },
  computed: {
    porcentagemProduzido() {
      return (this.qtd_produzida / this.qtd_solicitada) * 100;
    },
    progressVariant() {
      if (this.porcentagemProduzido < 40) return "danger";
      if (this.porcentagemProduzido < 70) return "warning";
      return "success";
    },
    dt_conclusao_formatter: {
      get: function() {
        return this.dt_conclusao;
      },
      set: function(newVal) {
        this.dt_conclusao_yyyymmdd = newVal;
      }
    },
    isQtdSolicitadaValid() {
      return this.qtd_solicitada !== "";
    },
    isQtdProduzidaValid() {
      return this.qtd_produzida !== "";
    },
    custoTotalComputed() {
      return this.custo_un * this.qtd_produzida;
    }
  },
  methods: {
    clearData() {},
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.$http
        .post(this.$routes.crud_update, {
          table: "ordem_producao",
          data: [
            {
              keyName: "ordemproducao_id",
              keyValue: this.id,
              values: {
                dtconclusao: this.dt_conclusao_yyyymmdd,
                qtdesolicitada: this.qtd_solicitada,
                qtdeproduzida: this.qtd_produzida
              }
            }
          ]
        })
        .then(() => {
          this.$refs["modal"].hide();
          this.$emit("update-request");
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
  },
  watch: {
    ordem(newOrdem) {
      if (typeof newOrdem !== "undefined") {
        this.id = newOrdem.id;
        this.id_ft = newOrdem.fichatecnica;

        this.dt_abertura = newOrdem.abertura;
        this.dt_conclusao = this.dmYtoYmd(newOrdem.conclusao);
        
        this.desc_produzido = newOrdem.produto;
        this.qtd_solicitada = newOrdem.solicitado;
        this.qtd_produzida = newOrdem.produzido;
        
        this.custo_un = newOrdem.custounidade;
        this.custo_total = newOrdem.custototal;
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
