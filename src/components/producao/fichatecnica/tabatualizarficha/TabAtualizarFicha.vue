<template>
  <div class="my-3">
    <b-card>
      <div class="mb-3 d-flex align-itens-center">
        <h3>Detalhes</h3>
        <b-button variant="primary" class="ml-auto" @click="showAttModal">Alterar Detalhes</b-button>
      </div>

      <div class="d-flex align-items-center mb-4 mt-1">
        <font-awesome-icon icon="search" size="2x" class="mr-4" />
        <b-form-input
          v-model="ft_id_search"
          placeholder="Procurar por ID"
          @keyup.enter="searchFichaById"
        ></b-form-input>
      </div>

      <b-form inline class="mt-3">
        <span class="col-2 p-0">Produto Produzido</span>
        <b-form-input :value="ft_prod" readonly class="col-4"></b-form-input>

        <span class="col-2 text-right">Medida de Unidade</span>
        <b-form-input :value="ft_prod_un" readonly class="col-4"></b-form-input>
      </b-form>

      <b-form inline class="mt-3">
        <span class="col-2 p-0">Data Início Vigência</span>
        <b-form-input :value="ft_ini_vigencia" readonly class="col-4"></b-form-input>

        <span class="col-2 text-right">Data Fim Vigência</span>
        <b-form-input deactivated :value="ft_fim_vigencia" readonly class="col-4"></b-form-input>
      </b-form>
      <b-form inline class="mt-3">
        <span class="col-2 p-0">Valor Insumos</span>
        <b-form-input :value="ft_valor_insumos" readonly class="col-4"></b-form-input>

        <span class="col-2 text-right">Outras Despesas</span>
        <b-form-input :value="ft_valor_acrescimo" readonly class="col-4"></b-form-input>
      </b-form>

      <h2 class="text-right mt-4">Valor total: {{ft_valor_total || 'R$ 0,00'}}</h2>

      <hr />

      <table-insumos
        :items="items"
        :isBusy="isBusy"
        :isEmpty="isEmpty"
        :hasError="hasError"
        :notFound="notFound"
        :idFicha="ft_id"
        @update-request="searchFichaById"
      ></table-insumos>
    </b-card>

    <update-ficha-modal
      ref="update-modal"
      :idFicha="ft_id"
      :produzido="ft_prod"
      :idProduzido="ft_prod_id"
      :iniVigencia="ft_ini_vigencia"
      :fimVigencia="ft_fim_vigencia"
      :acrescimo="ft_valor_acrescimo"
      :unidadeSaida="ft_prod_un"
      @update-request="searchFichaById"
    ></update-ficha-modal>
  </div>
</template>

<script>
import TableInsumos from "./TableInsumos";
import UpdateFichaModal from "./UpdateFichaModal";
import tableUtils from "../../../../mixins/table-utils";
export default {
  name: "TabAtualizarFicha",
  components: { TableInsumos, UpdateFichaModal },
  mixins: [tableUtils],
  data: () => {
    return {
      ft_id: null,
      ft_id_search: null,

      ft_prod: null,
      ft_prod_id: null,
      ft_prod_un: null,
      ft_ini_vigencia: null,
      ft_fim_vigencia: null,

      ft_valor_total: null,
      ft_valor_insumos: null,
      ft_valor_acrescimo: null,

      items: [],

      isBusy: true,
      isEmpty: true,
      hasError: false,
      notFound: false
    };
  },
  methods: {
    searchFichaById() {
      this.$http
        .get(this.$routes.fichatecnica_select_by_pk, {
          params: {
            id: this.ft_id_search
          }
        })
        .then(res => {
          if (typeof res.data.ficha !== "undefined") {
            this.hasError = false;

            const {
              ficha,
              produzido,
              unidadeproduzido,
              dtinivigencia,
              dtfimvigencia,
              valoracrescimo,
              idproduzido
            } = res.data;

            this.ft_id = ficha;
            this.ft_prod = produzido;
            this.ft_prod_id = idproduzido;
            this.ft_prod_un = unidadeproduzido;
            this.ft_ini_vigencia = dtinivigencia;
            this.ft_fim_vigencia = dtfimvigencia;
            this.ft_valor_acrescimo = valoracrescimo;

            if (res.data.insumos) {
              this.items = res.data.insumos;
              this.calcularValoresFicha();

              this.isBusy = false;
              this.isEmpty = false;
              this.notFound = false;
            } else {
              this.items = null;
              this.ft_valor_insumos = null;
              this.ft_valor_total = this.toReais(valoracrescimo);
              this.ft_valor_acrescimo = valoracrescimo;

              this.isBusy = true;
              this.isEmpty = true;
              this.notFound = false;
            }
          } else {
            this.clearData();

            this.isBusy = true;
            this.notFound = true;
            this.isEmpty = false;
          }
        })
        .catch(error => {
          this.handleAxiosError(error);
          this.clearData();
          this.isBusy = true;
          this.hasError = true;
        });
    },
    clearData() {
      this.items = null;
      this.ft_id = null;

      this.ft_prod = null;
      this.ft_prod_id = null;
      this.ft_prod_un = null;

      this.ft_ini_vigencia = null;
      this.ft_fim_vigencia = null;

      this.ft_valor_total = null;
      this.ft_valor_insumos = null;
      this.ft_valor_acrescimo = null;
    },
    calcularValoresFicha() {
      let valorInsumos = 0;
      this.items.map(insumo => {
        const valorInsumo = insumo.preco * insumo.quantidade;
        valorInsumos += valorInsumo;
        this.$set(insumo, "preco", this.toReais(insumo.preco));
        this.$set(insumo, "valorTotal", this.toReais(valorInsumo));
      });
      this.ft_valor_total = this.toReais(
        valorInsumos + this.ft_valor_acrescimo
      );
      this.ft_valor_insumos = this.toReais(valorInsumos);
      this.ft_valor_acrescimo = this.ft_valor_acrescimo;
    },
    showAttModal() {
      if (this.tableHasSelected(this.ft_id, "Nenhuma ficha selecionada")) {
        this.$refs["update-modal"].$refs["modal"].show();
      }
    }
  }
};
</script>
