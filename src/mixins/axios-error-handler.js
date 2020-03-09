import { log } from "util";

export default {
    methods: {
        handleAxiosError(error) {
            if (error.response) {
                /*
                 * A request foi feita mas o servidor respondeu com status
                 * fora de 2xx (erro)
                 */
                log(error.response.data);
                log(error.response.status);
                log(error.response.headers);
            } else if (error.request) {
                /*
                 * O request foi feito mas nenhuma resposta foi recebida. 
                 * error.request é uma instancia de XMLHttpRequest no browser
                 * e uma instancia de http.ClientRequest no Node.js
                 */
                log(error.request);
            } else {
                // Algo aconteceu ao preparar a request e um erro ocorreu
                log("Error", error.message);
            }
            log(error.config);
        }
    },
};
