<template>
  <b-modal
    ref="modal"
    size="lg"
    scrollable
    ok-variant="success"
    title="Atualizar Ficha Tecnica"
    cancel-variant="danger"
    cancel-title="Cancelar"
    ok-title="Atualizar"
    @ok="handleOk"
  >
    <div>
      <label for="produzido_id">Produto Produzido</label>
      <input
        type="number"
        name="produzido_id"
        class="form-control"
        v-model="produzido_id"
        @input="changeProduzido"
        :class="{ 'is-invalid': !hasProduzido }"
      />
      <div v-show="!hasProduzido" class="invalid-feedback">Selecione um produto válido</div>

      <label for="desc" class="mt-3">Descrição</label>
      <input type="text" name="desc" disabled class="form-control" v-model="produzido_descricao" />

      <label for="desc" class="mt-3">Unidade saída</label>
      <input
        type="text"
        name="desc"
        disabled
        class="form-control"
        v-model="produzido_unidade_saida"
      />

      <label for="desc" class="mt-3">Outras Despesas</label>
      <input type="number" name="desc" class="form-control" :class="{ 'is-invalid': !isDespesasValid }" v-model="ft_acrescimo"/>
      <div v-show="!isDespesasValid" class="invalid-feedback">Insira um número válido</div>

      <label for="desc" class="mt-3">Início Vigência</label>
      <input type="text" name="desc" disabled class="form-control" :value="ft_ini_vigencia" />

      <label for="desc" class="mt-3">Fim Vigência</label>
      <input type="date" name="desc" class="form-control" v-model="ft_fim_formatter" />
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "UpdateFichaModal",
  props: [
    "idFicha",
    "produzido",
    "idProduzido",
    "iniVigencia",
    "fimVigencia",
    "acrescimo",
    "unidadeSaida"
  ],
  data() {
    return {
      ft_id: null,
      ft_acrescimo: null,
      ft_ini_vigencia: null,
      ft_fim_vigencia: null,
      ft_fim_vigencia_yyyymmdd: null,

      hasProduzido: true,

      produzido_id: null,
      produzido_descricao: null,
      produzido_unidade_saida: null
    };
  },
  computed: {
    // Necessário pra formatar a data de fim de vigencia anterior pro formato Ymd
    ft_fim_formatter: {
      get: function() {
        return this.dmYtoYmd(this.ft_fim_vigencia);
      },
      set: function(newVal) {
        this.ft_fim_vigencia_yyyymmdd = newVal;
      }
    },
    isDespesasValid() {
      return this.ft_acrescimo !== "";
    }
  },
  methods: {
    changeProduzido() {
      if (this.produzido_id !== "") {
        this.$http
          .post(this.$routes.crud_select, {
            table: "produto",
            fields: [
              {
                key: "produto_id",
                type: "number",
                filter: this.produzido_id
              },
              {
                key: "descricao",
                type: "string",
                filter: null
              },
              {
                key: "unidadesaida",
                type: "string",
                filter: null
              }
            ]
          })
          .then(res => {
            if (res.data[0]) {
              this.hasProduzido = true;
              const newProduzido = res.data[0];
              this.produzido_descricao = newProduzido.descricao;
              this.produzido_unidade_saida = newProduzido.unidadesaida;
            } else {
              this.clearProduzidoData();
            }
          })
          .catch(err => {
            this.handleAxiosError(err);
            this.clearProduzidoData();
          });
      } else {
        this.clearProduzidoData();
      }
    },
    handleOk(event) {
      event.preventDefault();
      if (this.hasProduzido && this.isDespesasValid) {
        this.$http
          .post(this.$routes.crud_update, {
            table: "fichatecnica",
            data: [
              {
                keyName: "fichatecnica_id",
                keyValue: this.ft_id,
                values: {
                  produto_id: this.produzido_id,
                  valoracrescimo: this.ft_acrescimo,
                  dtfimvigencia: this.ft_fim_vigencia_yyyymmdd || null
                }
              }
            ]
          })
          .catch(err => {
            this.handleAxiosError(err);
          })
          .finally(() => {
            this.$emit("update-request");
          });
        this.$nextTick(() => {
          this.$refs.modal.hide();
        });
      }
    },
    clearProduzidoData() {
      this.hasProduzido = false;
      this.produzido_unidade_saida = null;
      this.produzido_descricao = "Não encontrado";
    },
  },
  // Quando a ficha é atualizada att toda a data() para as props
  watch: {
    idFicha(newId) {
      this.ft_id = newId;
      this.ft_acrescimo = this.acrescimo;
      this.ft_ini_vigencia = this.iniVigencia;
      this.ft_fim_vigencia = this.fimVigencia;

      this.produzido_id = this.idProduzido;
      this.produzido_descricao = this.produzido;
      this.produzido_unidade_saida = this.unidadeSaida;
    },
    fimVigencia(newFim) {
      this.ft_fim_vigencia = newFim;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
