<template>
  <b-form-input id="genericFilter" v-model="filterVal" placeholder="Busca Genérica" debounce="300"></b-form-input>
</template>

<script>
export default {
  props: ["filter"],
  computed: {
    filterVal: {
      get() {
        return this.filter;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style scoped>
#genericFilter {
  max-width: 250px;
}
</style>
