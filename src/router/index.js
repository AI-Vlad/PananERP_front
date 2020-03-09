import VueRouter from 'vue-router';
import store from '../store';
import Vue from 'vue';

//-------------------------------- Produção --------------------------------
import OrdemDeProducao from '../views/producao/OrdemDeProducao';
import FichaTecnica from '../views/producao/FichaTecnica';
import Materiais from '../views/producao/Materiais';
import Produtos from '../views/producao/Produtos';

//--------------------------------- Usuário --------------------------------
import Usuarios from '../views/usuario/Usuarios';
import Login from '../views/usuario/Login';

//--------------------------------- Outros ---------------------------------
import Transportadoras from '../views/Transportadoras';
import Dashboard from '../views/Dashboard';
import Clientes from '../views/Clientes';
import Contato from '../views/Contato';

//--------------------------------- Geral ---------------------------------
import NotFound from '../views/utils/NotFound';
import Filler from '../views/utils/Filler';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/usuario/gerenciar',
    component: Usuarios,
    name: 'usuarios',
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard'
  },
  {
    path: '/estoque',
    component: NotFound
  },
  {
    path: '/producao',
    component: Filler,
    children: [
      {
        path: 'produtos',
        component: Produtos
      },
      {
        path: 'materiais',
        component: Materiais
      },
      {
        path: 'fichatecnica',
        component: FichaTecnica
      },
      {
        path: 'ordem',
        component: OrdemDeProducao
      },
    ],
  },
  {
    path: '/clientes',
    component: Clientes
  },

  {
    path: '/transportadoras',
    component: Transportadoras
  },
  {
    path: '/sped',
    component: Filler,
    children: [
      {
        path: 'bloco0',
        component: NotFound
      },
      {
        path: 'blocoh',
        component: NotFound
      },
      {
        path: 'blocok',
        component: NotFound
      },
    ],
  },
  {
    path: '/contato',
    component: Contato
  },
  {
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  let isLoggedIn = store.getters.isLoggedIn;

  if (to.path !== '/login') {

    if (!isLoggedIn) next('/login');
    else next();

  } else {

    if (isLoggedIn) next('/dashboard');
    else next();

  }

});

export default router;
