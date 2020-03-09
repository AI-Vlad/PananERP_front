const url = 'http://localhost:8000/';

const routes = {
    login: url + 'login',

    user_update: url + 'user/update',

    crud_insert: url + 'crud/insert',
    crud_select: url + 'crud/select',
    crud_delete: url + 'crud/delete',
    crud_update: url + 'crud/update',

    insumo_select_by_pk: url + 'producao/insumo/:id',

    fichatecnica_add_insumo: url + 'producao/fichatecnica/addInsumo',
    fichatecnica_remove_insumos: url + 'producao/fichatecnica/removeInsumos',

    fichatecnica_select_all: url + 'producao/fichatecnica',
    fichatecnica_select_by_pk: url + 'producao/fichatecnica/:id',

    ordem_producao_select_all: url + 'producao/ordemproducao',
}

module.exports = routes
