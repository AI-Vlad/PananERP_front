<template>
  <b-modal id="details-modal" title="Detalhes" scrollable size="lg" ok-only>
    <div v-if="selected.length === 0">
      <h5>Nenhum registro selecionado</h5>
    </div>
    <div v-else>
      <template v-for="(item, index) in selected">
        <div :key="index" class="record mb-3">
          <template v-for="(value, key, index) in item">
            <div :key="index" class="d-flex">
              <div class="col-3 text-right">
                <span>{{labels[index]}}</span>
              </div>
              <div class="col-9">
                <span>{{value ? value : 'Vazio'}}</span>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "DetailsModal",
  props: ["selected", "fields", "detailsFields"],
  computed: {
    labels() {
      if (typeof this.detailsFields !== "undefined")
        return this.fields.concat(this.detailsFields).map(e => e.label);
      return this.fields.map(e => e.label);
    }
  }
};
</script>

<style scoped>
.record {
  padding-bottom: 10px;
}
.record:last-child {
  margin-bottom: 0 !important;
}
</style>
