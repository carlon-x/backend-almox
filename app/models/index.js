const conexao = require('./conexao.js');
const inicializarAdmin = require('../commons/inicializarAdmin.js');

// Importa os modelos reais com atributos privados
const { Local } = require('./Local.js');
const { Produto } = require('./Produto.js');
const { Usuario } = require('./Usuario.js');

const db = {
    sequelize: conexao,
    Local,
    Produto,
    Usuario
};

// CHAMA O ARQUIVO DE ASSOCIAÇÕES PASSANDO O OBJETO DB
require('./relations.js')(db);

// Sincronização centralizada das tabelas e criação do admin inicial
conexao
    .sync({ alter: true })
    .then(async () => {
        console.log('sincronizacao com bd...');
        await inicializarAdmin();
    })
    .catch((err) => {
        console.log('falha ao sincronizar: ' + err.message);
    });

module.exports = db;
