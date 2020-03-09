<template>
  <div>
    <div class="text-center my-4" v-if="hasError">
      <strong>Erro ao carregar dados</strong>
    </div>
    <div v-else class="my-4 text-center text-primary">
      <b-spinner class="align-middle"></b-spinner>
      <strong class="ml-2">Carregando...</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: ["hasError"]
};
</script>
