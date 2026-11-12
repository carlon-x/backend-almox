const { Model, DataTypes } = require('sequelize');
const db = require('./conexao.js');

class Local extends Model {
    // 1. Atributos privados da classe
    #area;
    #estante;
    #prateleira;

    // Construtor compatível com o Sequelize para permitir a inicialização via ORM
    constructor(...args) {
        super(...args);
    }

    // --- GETTERS ---
    // Buscam os valores vindos do banco via Sequelize ou recorrem aos campos privados em memória
    get area() {
        return this.getDataValue('area') || this.#area;
    }

    get estante() {
        return this.getDataValue('estante') || this.#estante;
    }

    get prateleira() {
        return this.getDataValue('prateleira') || this.#prateleira;
    }

    // SETTERS
    // Atualizam as propriedades privadas em memória e notificam as colunas do Sequelize
    set area(valor) {
        this.#area = valor;
        this.setDataValue('area', valor);
    }

    set estante(valor) {
        this.#estante = valor;
        this.setDataValue('estante', valor);
    }

    set prateleira(valor) {
        this.#prateleira = valor;
        this.setDataValue('prateleira', valor);
    }

    static async criarNovo(novoLocal) {
        try {
            // Model diretamente na classe, chamada super.create
            // para acessar o método pronto de inserção do Sequelize sem gerar loop infinito.
            const localCriado = await super.create({
                area: novoLocal.area,
                estante: novoLocal.estante,
                prateleira: novoLocal.prateleira
            });
            return localCriado;
        } catch (error) {
            throw error;
        }
    }
}


// 2. Mapeamento físico das propriedades para colunas no MySQL
Local.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        area: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        estante: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        prateleira: {
            type: DataTypes.STRING(80),
            allowNull: true
        }
    },
    {
        sequelize: db,
        modelName: 'Local',
        tableName: 'local' 
    }
);

module.exports = { Local };
