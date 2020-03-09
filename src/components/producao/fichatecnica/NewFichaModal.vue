<template>
  <b-modal
    ref="modal"
    size="lg"
    scrollable
    ok-variant="success"
    title="Nova Ficha Técnica"
    cancel-variant="danger"
    cancel-title="Cancelar"
    ok-title="Criar Ficha"
    @ok="handleOk"
  >
    <div>
      <label for="id_produzido">Produto Produzido</label>
      <input
        type="number"
        name="id_produzido"
        class="form-control"
        v-model="fields[0].filter"
        @input="searchProduto"
        :class="{ 'is-invalid': !isProduzidoValid }"
      />
      <div v-show="!isProduzidoValid" class="invalid-feedback">Selecione um Produto</div>

      <label for="desc" class="mt-3">Descrição</label>
      <input type="text" name="desc" disabled class="form-control" v-model="descricao" />

      <label for="un_medida" class="mt-3">Unidade Saída</label>
      <input type="text" name="un_medida" disabled class="form-control" v-model="un_medida" />

      <label for="dt_ini_vigencia" class="mt-3">Início Vigência</label>
      <input
        type="date"
        name="dt_ini_vigencia"
        class="form-control"
        v-model="dt_ini_vigencia"
        :class="{ 'is-invalid': !isDtIniValid }"
      />
      <div v-show="!isDtIniValid" class="invalid-feedback">Data Inválida</div>

      <label for="dt_fim_vigencia" class="mt-3">Fim vigência</label>
      <input type="date" name="dt_fim_vigencia" class="form-control" v-model="dt_fim_vigencia" />

      <label for="desc" class="mt-3">Outras Despesas</label>
      <input
        type="number"
        name="desc"
        class="form-control"
        v-model="ft_acrescimo"
        :class="{ 'is-invalid': !isDespesasValid }"
      />
      <div v-show="!isDespesasValid" class="invalid-feedback">Insira um número válido</div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "CreateFichaModal",
  data() {
    return {
      produto_iduzido: null,
      descricao: "Digite o ID do produto para procurar",
      un_medida: null,
      ft_acrescimo: 0,
      dt_ini_vigencia: null,
      dt_fim_vigencia: null,
      fields: [
        {
          key: "produto_id",
          filter: null,
          type: "number"
        },
        {
          key: "descricao",
          filter: null,
          type: "string"
        },
        {
          key: "unidadesaida",
          filter: null,
          type: "string"
        }
      ]
    };
  },
  computed: {
    isDtIniValid() {
      return !!this.dt_ini_vigencia;
    },
    isProduzidoValid() {
      return !!this.produto_iduzido;
    },
    // Input do html converte numeros inválidos como 23,,,23.23 para "" e 1,2 para 1.2
    isDespesasValid() {
      return this.ft_acrescimo !== '';
    }
  },
  methods: {
    searchProduto() {
      if (this.fields[0].filter) {
        this.$http
          .post(this.$routes.crud_select, {
            table: "produto",
            fields: this.fields
          })
          .then(res => {
            if (res.data.length > 0) {
              // Como estou procurando pelo ID pego apenas o primeiro e unico resultado
              let { produto_id, descricao, unidadesaida } = res.data[0];
              this.produto_iduzido = produto_id;
              this.descricao = descricao;
              this.un_medida = unidadesaida;
            } else {
              this.clearProduzidoData();
            }
          })
          .catch(error => {
            this.handleAxiosError(error);
            this.clearProduzidoData();
          });
      } else {
        this.clearProduzidoData();
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.isDtIniValid && this.isProduzidoValid && this.isDespesasValid) {
        this.$http
          .post(this.$routes.crud_insert, {
            table: "fichatecnica",
            data: {
              produto_id: this.produto_iduzido,
              valoracrescimo: this.ft_acrescimo,
              dtinivigencia: this.dt_ini_vigencia,
              dtfimvigencia: this.dt_fim_vigencia
            }
          })
          .then(res => {
            const fichaCriada = res.data;
            this.$refs["modal"].hide();
            this.$emit("update-request");
            this.$bvToast.toast(
              `Ficha Técnica ${fichaCriada.fichatecnica_id} Criada.
             Para atualizar detalhes e inserir ou remover insumos vá para a aba "Atualizar ficha"`,
              {
                title: "Ficha Criada com Sucesso",
                appendToast: true,
                variant: "success",
                noAutoHide: true
              }
            );
            this.clearProduzidoData();
            this.fields[0].filter = null;
          })
          .catch(err => {
            this.handleAxiosError(err);
            this.$swal({
              title: "Ops",
              text: "Erro ao Criar Ficcha",
              type: "error"
            });
          });
      }
    },
    clearProduzidoData() {
      this.un_medida = null;
      this.ft_acrescimo = 0;
      this.produto_iduzido = null;
      this.descricao = "Produto não encontrado";
    }
  },
  mounted() {
    let today = new Date();
    const day = ("0" + today.getDate()).slice(-2);
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    this.dt_ini_vigencia = `${today.getFullYear()}-${month}-${day}`;
  }
};
</script>
