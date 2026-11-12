module.exports = {
    port: process.env.PORT || 3000,
    dbconfig: {
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        user: process.env.DBUSER,
        passwd: process.env.DBPASS,
        dialect: process.env.DBDIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            underscored: true, //usa underline para separacao de palavras = createdAt fica created_at
            freezeTableName: true, //bloqueia a adicao de s para o plural em ingles pelo processador do sequelize
            timestamps: true, //habilita/desabilita timestamps
            paranoid: false, //habilita soft delete
        },
    },
};