const { Model, DataTypes } = require('sequelize');
const db = require('./conexao.js');

class Produto extends Model {
    // 1. Atributos privados da classe
    #nome;
    #descricao;
    #tipo;
    #quantidade_atual;
    #quantidade_minima;
    #id_local;
    #id_usuario_evento;
    #tipo_evento;

    constructor(...args) {
        super(...args);
        // O construtor alternativo pode inicializar os campos privados em memória se necessário
        if (args.length > 0 && typeof args[0] === 'object') {
            const dados = args[0];
            this.#nome = dados.nome;
            this.#descricao = dados.descricao;
            this.#tipo = dados.tipo;
            this.#quantidade_atual = dados.quantidade_atual;
            this.#quantidade_minima = dados.quantidade_minima;
            this.#id_local = dados.id_local;
        }
    }

    // --- GETTERS ---
    get nome() { return this.getDataValue('nome') || this.#nome; }
    get descricao() { return this.getDataValue('descricao') || this.#descricao; }
    get tipo() { return this.getDataValue('tipo') || this.#tipo; }
    
    get quantidade_atual() { 
        return this.getDataValue('quantidade_atual') !== undefined 
            ? this.getDataValue('quantidade_atual') 
            : this.#quantidade_atual; 
    }
    
    get quantidade_minima() { 
        return this.getDataValue('quantidade_minima') !== undefined 
            ? this.getDataValue('quantidade_minima') 
            : this.#quantidade_minima; 
    }
    
    get id_local() { 
        return this.getDataValue('id_local') !== undefined 
            ? this.getDataValue('id_local') 
            : this.#id_local; 
    }
    
    get id_usuario_evento() { return this.getDataValue('id_usuario_evento') || this.#id_usuario_evento; }
    get tipo_evento() { return this.getDataValue('tipo_evento') || this.#tipo_evento; }
    
    // Alerta calculado em tempo real
    get status_alerta() {
        return this.quantidade_atual < this.quantidade_minima;
    }

    // --- SETTERS ---
    set nome(valor) { this.#nome = valor; this.setDataValue('nome', valor); }
    set descricao(valor) { this.#descricao = valor; this.setDataValue('descricao', valor); }
    set tipo(valor) { this.#tipo = valor; this.setDataValue('tipo', valor); }
    set quantidade_atual(valor) { this.#quantidade_atual = valor; this.setDataValue('quantidade_atual', valor); }
    set quantidade_minima(valor) { this.#quantidade_minima = valor; this.setDataValue('quantidade_minima', valor); }
    set id_local(valor) { this.#id_local = valor; this.setDataValue('id_local', valor); }
    set id_usuario_evento(valor) { this.#id_usuario_evento = valor; this.setDataValue('id_usuario_evento', valor); }
    set tipo_evento(valor) { this.#tipo_evento = valor; this.setDataValue('tipo_evento', valor); }

    static async criarNovo(novoProduto) {
        try {
            const produtoCriado = await super.create({
                nome: novoProduto.nome,
                descricao: novoProduto.descricao,
                tipo: novoProduto.tipo,
                quantidade_atual: novoProduto.quantidade_atual,
                quantidade_minima: novoProduto.quantidade_minima,
                id_local: novoProduto.id_local,
                id_usuario_evento: novoProduto.id_usuario_evento,
                tipo_evento: novoProduto.tipo_evento
            });
            return produtoCriado;
        } catch (error) {
            throw error;
        }
    }
}

// 2. Mapeamento físico para colunas no MySQL
Produto.init(
    {
        id_item: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tipo: {
            type: DataTypes.ENUM('consumo', 'ferramenta'),
            allowNull: false,
        },
        quantidade_atual: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        quantidade_minima: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        id_local: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_usuario_evento: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tipo_evento: {
            type: DataTypes.ENUM('cautela', 'log_perda', 'log_dano', 'abastecimento'),
            allowNull: true,
        },
    },
    {
        sequelize: db,
        modelName: 'Produto',
        tableName: 'produto', 
    }
);

module.exports = { Produto };
