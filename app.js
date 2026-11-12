require('dotenv').config();
const express = require('express');
const config = require('./config.js');
const cors = require('cors');
const app = express();
//PRE-CONFIGURACAO
app.use(express.json()); //parser dados de requisicoes em JSON
app.use(
  cors({
    origin: '*',
  })
);
//BANCO DE DADOS
const conexao = require('./app/models'); //inicializa a config do BD com sequelize

//ROTAS
app.get('/', (request, response) => {
    response.json({
        //documento JSON
        message: 'API para almoxarifado',
        version: '1.0',
    });
});

const localRotas = require('./app/routes/local.routes.js');
const produtoRotas = require('./app/routes/produto.routes.js');
const usuarioRotas = require('./app/routes/usuario.routes.js');

app.use(localRotas);
app.use(produtoRotas);
app.use(usuarioRotas);

//RODANDO SERVER
app.listen(config.port, () => {
console.log('servidor on-line');
});
module.exports = app; //para testes unitarios