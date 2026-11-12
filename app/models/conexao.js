const config = require('../../config.js');
const dbconfig = config.dbconfig;
const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

const conexao = new Sequelize({
    host: dbconfig.host,
    username: dbconfig.user,
    password: dbconfig.passwd,
    database: dbconfig.database,
    dialect: dbconfig.dialect || 'mysql',
    pool: {
        max: dbconfig.pool.max,
        min: dbconfig.pool.min,
        acquire: dbconfig.pool.acquire,
        idle: dbconfig.pool.idle,
    },
    define: {
        underscored: dbconfig.define.underscored,
        freezeTableName: dbconfig.define.freezeTableName,
        timestamps: dbconfig.define.timestamps || false,
        paranoid: dbconfig.define.paranoid,
    },
    dialectOptions: {
        dateStrings: false,
        typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
                return field.string();
            }
            return next();
        },
    },
    timezone: '-03:00',
});

// FUNÇÃO ASSÍNCRONA QUE OBRIGA A EXECUÇÃO EM ORDEM
async function inicializarBanco() {
    try {
        // 1. Cria a conexão temporária e aguarda ela abrir
        const temporaria = await mysql.createConnection({
            host: dbconfig.host || 'localhost',
            user: dbconfig.user || 'root',
            password: dbconfig.passwd || ''
        });

        // 2. Executa a query de criação e aguarda (await) o MySQL confirmar a gravação em disco
        const nomeBanco = dbconfig.database || 'almoxarifadodb';
        await temporaria.query(`CREATE DATABASE IF NOT EXISTS \`${nomeBanco}\`;`);
        await temporaria.end();
        console.log(`[BD] Banco de dados "${nomeBanco}" verificado/criado com sucesso.`);

        // 3. Sequelize tenta autenticar
        await conexao.authenticate();
        console.log('Conexao com o BD realizada com sucesso.');

    } catch (error) {
        console.error('Falha crítica no ecossistema do Banco de Dados:', error);
    }
}

// Dispara o fluxo ordenado
inicializarBanco();

module.exports = conexao;
