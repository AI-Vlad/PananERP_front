import Vue from 'vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from "@fortawesome/free-solid-svg-icons";
import Sidebar from '../components/Sidebar';
library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('sidebar', Sidebar);
