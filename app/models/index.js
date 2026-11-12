const conexao = require('./conexao.js');

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


// Sincronização centralizada das tabelas
conexao
    .sync({ alter: true })
    .then(() => {
        console.log('sincronizacao com bd...');
    })
    .catch((err) => {
        console.log('falha ao sincronizar: ' + err.message);
    });

module.exports = db;
