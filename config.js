module.exports = {
    port: process.env.PORT || 3000,
    dbconfig: {
        host: process.env.DBHOST,
        port: process.env.DBPORT || 5432,
        database: process.env.DBNAME,
        user: process.env.DBUSER,
        passwd: process.env.DBPASS,
        dialect: process.env.DBDIALECT || 'postgres',
        dialectOptions: process.env.DBSSL === 'true' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            paranoid: false,
        },
    },
};
