const config = require('../../config.js');
const dbconfig = config.dbconfig;
const Sequelize = require('sequelize');

const isPostgres = dbconfig.dialect === 'postgres';

const conexao = new Sequelize({
    host: dbconfig.host,
    port: dbconfig.port || (isPostgres ? 5432 : 3306),
    username: dbconfig.user,
    password: dbconfig.passwd,
    database: dbconfig.database,
    dialect: dbconfig.dialect || 'postgres',
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
    dialectOptions: isPostgres
        ? (dbconfig.dialectOptions || {})
        : {
              dateStrings: false,
              typeCast: function (field, next) {
                  if (field.type === 'DATETIME') {
                      return field.string();
                  }
                  return next();
              },
          },
    ...(isPostgres ? {} : { timezone: '-03:00' }),
});

async function inicializarBanco() {
    try {
        if (!isPostgres) {
            const mysql = require('mysql2/promise');
            const temporaria = await mysql.createConnection({
                host: dbconfig.host || 'localhost',
                port: dbconfig.port || 3306,
                user: dbconfig.user || 'root',
                password: dbconfig.passwd || '',
            });

            const nomeBanco = dbconfig.database || 'almoxarifadodb';
            await temporaria.query(`CREATE DATABASE IF NOT EXISTS \`${nomeBanco}\`;`);
            await temporaria.end();
            console.log(`[BD] Banco de dados "${nomeBanco}" verificado/criado com sucesso.`);
        }

        await conexao.authenticate();
        console.log(`Conexão com o BD (${dbconfig.dialect}) realizada com sucesso.`);
    } catch (error) {
        console.error('Falha crítica no ecossistema do Banco de Dados:', error);
    }
}

inicializarBanco();

module.exports = conexao;
