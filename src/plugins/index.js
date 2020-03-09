import Vue from 'vue';

//------------------------------------- Bootstrap Vue -------------------------------------
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

//-------------------------------------  Sweet Alert  -------------------------------------
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 
Vue.use(VueSweetalert2);

//-------------------------------------     Axios     -------------------------------------
import Axios from 'axios'
Vue.prototype.$http = Axios;
Vue.prototype.$routes = require('../utils/axios-routes');