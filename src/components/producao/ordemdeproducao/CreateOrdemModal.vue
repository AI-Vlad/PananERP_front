<template>
  <b-modal
    id="modal"
    ref="modal"
    size="lg"
    scrollable
    ok-variant="success"
    title="Criar Ordem de Produção"
    cancel-variant="danger"
    cancel-title="Cancelar"
    ok-title="Criar"
    @ok="handleOk"
  >
    <div>
      <label for="id_ft" class="mt-3">Ficha Técnica</label>
      <input
        type="text"
        name="id_ft"
        class="form-control"
        v-model="id_ft_search"
        @input="searchFichaById"
        :class="{ 'is-invalid': !isFichaValid }"
        v-b-tooltip.hover title="Digite o ID da ficha técnica para procurar"
      />
      <div v-show="!isFichaValid" class="invalid-feedback">Escolha uma ficha técnica válida</div>

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

      <label for="cuto_un" class="mt-3">Custo Unidade</label>
      <input type="text" name="custo_un" disabled class="form-control" v-model="custo_un" v-b-tooltip.hover title="Custo em reais para produzir cada unidade do produto"/>

      <label for="custo_previsto" class="mt-3">Custo Previsto</label>
      <input disabled type="text" name="custo_previsto" class="form-control" v-model="custoPrevisto" v-b-tooltip.hover title="Quantidade Solicitada x Custo UN"/>

      <label for="custo_total" class="mt-3">Custo Total</label>
      <input disabled type="text" name="custo_total" class="form-control" v-model="custoTotal" v-b-tooltip.hover title="Quantidade Produzida x Custo UN"/>

      <label for="dt_abertura" class="mt-3">Data Abertura</label>
      <input
        type="date"
        name="dt_abertura"
        class="form-control"
        v-model="dt_abertura"
        :class="{ 'is-invalid': !isDtAberturaValid }"
      />
      <div v-show="!isDtAberturaValid" class="invalid-feedback">Data de Abertura Vazia ou Inválida</div>

      <label for="dt_conclusao" class="mt-3">Data Conclusão</label>
      <input type="date" name="dt_conclusao" class="form-control" v-model="dt_conclusao" />

      <b-button v-if="isFinalizada" size="sm" class="mt-3" variant="success">Finalizada</b-button>
      <b-button v-else size="sm" class="mt-3" variant="info">Em Aberto</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "CreateOrdemModal",
  props: ["ordem"],
  data: () => {
    return {
      id_ft: null,
      id_ft_search: null,

      has_ficha: false,
      desc_produzido: null,

      qtd_produzida: "0",
      qtd_solicitada: "0",

      custo_un: 0,

      custo_insumos: 0,
      custo_acrescimo: 0,

      dt_abertura: null,
      dt_conclusao: null,
      isFinalizada: false,
      today: new Date()
    };
  },
  watch: {
    dt_conclusao(newVal) {
      this.isFinalizada = new Date(newVal) < this.today;
    }
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
    isQtdSolicitadaValid() {
      return !!this.qtd_solicitada;
    },
    isQtdProduzidaValid() {
      return !!this.qtd_produzida;
    },
    isDtAberturaValid() {
      return !!this.dt_abertura;
    },
    isFichaValid() {
      return !!this.has_ficha;
    },
    custoTotal() {
      return this.round(this.custo_un * this.qtd_produzida);
    },
    custoPrevisto() {
      return this.round(this.custo_un * this.qtd_solicitada);
    }
  },
  methods: {
    searchFichaById() {
      if (this.id_ft_search) {
        this.$http
          .get(this.$routes.fichatecnica_select_by_pk, {
            params: {
              id: this.id_ft_search
            }
          })
          .then(res => {
            const ficha = res.data;
            if (ficha.ficha) {
              this.has_ficha = true;
              this.id_ft = ficha.ficha;
              this.desc_produzido = ficha.produzido;
              this.custo_acrescimo = ficha.valoracrescimo;
              let custo_insumos = 0;
              if (ficha.insumos) {
                ficha.insumos.map(insm => {
                  custo_insumos += insm.quantidade * insm.preco;
                });
              }
              this.custo_insumos = custo_insumos;
              this.custo_un = this.round(custo_insumos + this.custo_acrescimo);
            } else {
              this.id_ft = null;
              this.desc_produzido = "Ficha não encontrada";
              this.has_ficha = false;
            }
          });
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.isDtAberturaValid && this.id_ft) {
        this.$http
          .post(this.$routes.crud_insert, {
            table: "ordem_producao",
            data: {
              fichatecnica_id: this.id_ft,

              dtabertura: this.dt_abertura,
              dtconclusao: this.dt_conclusao,

              qtdeproduzida: this.qtd_produzida,
              qtdesolicitada: this.qtd_solicitada
            }
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
      } else {
        this.$bvToast.toast("Ficha Técnica e/ou Data de Abertura inválidas", {
          title: "Erro",
          variant: "warning"
        });
      }
    },
    clearData(){
      this.id_ft = null
      this.id_ft_search = null,

      this.has_ficha = false
      this.desc_produzido = null,

      this.qtd_produzida = "0"
      this.qtd_solicitada = "0"

      this.custo_un = 0

      this.custo_insumos = 0
      this.custo_acrescimo = 0

      this.dt_abertura = null
      this.dt_conclusao = null
      this.isFinalizada = false
    }
  },
  mounted() {
    const day = ("0" + this.today.getDate()).slice(-2);
    const month = ("0" + (this.today.getMonth() + 1)).slice(-2);
    this.dt_abertura = `${this.today.getFullYear()}-${month}-${day}`;
  }
};
</script>

<style scoped lang="scss">
</style>
