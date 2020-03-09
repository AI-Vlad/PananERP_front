export default {
    // The idea here is to have a set of common utilities for the table
    methods: {
        tableHasSelected(selected, errorMessage) {
            if(!selected || (Array.isArray(selected) && selected.length === 0)){
                this.$bvToast.toast(errorMessage, {
                    title: "Erro",
                    variant: "warning"
                });
                return false
            }
            return true
        },
        tableHasOneSelected(selected, errorMessage) {
            if(!selected || (Array.isArray(selected) && selected.length !== 1)){
                this.$bvToast.toast(errorMessage, {
                    title: "Erro",
                    variant: "warning"
                });
                return false
            }
            return true
        }
    },
};
