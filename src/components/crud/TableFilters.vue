<template>
  <div inline class="mt-3 d-flex flex-row">
    <template v-for="(field, index) in fields_data">
      <div class="table-filter mb-3 mr-3" :key="index">
        <b-form-input
          v-if="field.type === 'number'"
          v-model="field.filter"
          type="number"
          :key="index"
          :placeholder="field.label"
          @keyup.enter="sendUpdateRequest"
          no-wheel
        ></b-form-input>

        <div v-else-if="field.type === 'boolean'" :key="index" class="d-flex align-items-center">
          <span>{{field.label}}</span>
          <b-form-select
            class="ml-2"
            v-model="field.filter"
            :options="options"
            @input="sendUpdateRequest"
          ></b-form-select>
        </div>

        <b-form-input
          v-else
          v-model="field.filter"
          :key="index"
          :placeholder="field.label"
          @keyup.enter="sendUpdateRequest"
        ></b-form-input>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CrudFilter",
  props: ["table", "fields"],

  data: () => {
    return {
      fields_data: null,
      options: [
        { value: null, text: "Indiferente" },
        { value: true, text: "Sim" },
        { value: false, text: "Não" }
      ]
    };
  },
  computed: {},
  methods: {
    sendUpdateRequest() {
      this.$emit("updateRequest");
    }
  },
  mounted() {
    this.fields_data = this.fields; //Passando os fields de props para data para utilizar no v-for
  }
};
</script>
