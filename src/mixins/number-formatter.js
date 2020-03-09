export default {
    methods: {
        toBRL(number) {
            return number ?
                number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : 'R$ 0,00'
        },
        toReais(number) {
            return number ? this.toBRL(number).substring(3) : '0,00'
        },
        round(number) {
            return number ? Math.round(number * 100) / 100 : 0
        },
        dmYtoYmd(date) {
            if (date) {
              let dia = date.split("/")[0];
              let mes = date.split("/")[1];
              let ano = date.split("/")[2];
              return `${ano}-${mes}-${dia}`;
            }
            return null;
          }
    }
};
