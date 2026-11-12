const { Model, DataTypes } = require('sequelize');
const db = require('./conexao.js');

class Usuario extends Model {
    // 1. Atributos privados da classe
    #nome;
    #email;
    #perfil;
    #senha;

    constructor(...args) {
        super(...args);
        // Permite inicialização de variáveis locais em memória se necessário
        if (args.length > 0 && typeof args[0] === 'object') {
            const dados = args[0];
            this.#nome = dados.nome;
            this.#email = dados.email;
            this.#perfil = dados.perfil;
            this.#senha = dados.senha;
        }
    }

    // GETTERS
    get nome() { return this.getDataValue('nome') || this.#nome; }
    get email() { return this.getDataValue('email') || this.#email; }
    get perfil() { return this.getDataValue('perfil') || this.#perfil; }
    get senha() { return this.getDataValue('senha') || this.#senha; }

    // SETTERS
    set nome(valor) { this.#nome = valor; this.setDataValue('nome', valor); }
    set email(valor) { this.#email = valor; this.setDataValue('email', valor); }
    set perfil(valor) { this.#perfil = valor; this.setDataValue('perfil', valor); }
    set senha(valor) { this.#senha = valor; this.setDataValue('senha', valor); }

    static async criarNovo(novoUsuario) {
        try {
            const usuarioCriado = await super.create({
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                perfil: novoUsuario.perfil,
                senha: novoUsuario.senha
            });
            return usuarioCriado;
        } catch (error) {
            throw error;
        }
    }
    static async findOne(dados) {
        try {
            // Realiza a busca no MySQL usando o objeto enviado (ex: { email: ... })
            const resultado = await super.findOne({ where: dados });
            if (resultado) {
                return resultado;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
}

// 2. Mapeamento físico para colunas no MySQL
Usuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true, // Garante que não haja e-mails duplicados
        },
        perfil: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user', // Perfil padrão se nenhum for passado
        },
        senha: {
            type: DataTypes.STRING(200),
            allowNull: false,
        }
    },
    
    {
        sequelize: db,
        modelName: 'Usuario',
        tableName: 'usuario',
    }
);

module.exports = { Usuario };
