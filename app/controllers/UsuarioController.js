const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ formats: { email: true } });
addFormats(ajv);

const schema = require('../schemas/usuario/novoUsuario.js');
const validacao = ajv.compile(schema);
const { Usuario } = require('../models/Usuario.js');
const helper = require('../commons/helper.js');

class UsuarioController {

    // GET /usuarios
    async findAll(request, response) {
        try {
            const usuariosBanco = await Usuario.findAll();

            const resultado = usuariosBanco.map(usuario => ({
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }));

            return response.status(200).json(resultado);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return response.status(500).json({ message: 'Erro interno no servidor ao buscar usuários.' });
        }
    }

    // GET /usuarios/:id
    async find(request, response) {
        try {
            const { id } = request.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return response.status(404).json({ message: 'Usuário inexistente.' });
            }

            return response.status(200).json({
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return response.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    // POST /usuarios (público) e POST /usuarios/admin (restrito)
    async create(request, response) {
        const corpoValidacao = {
            ...request.body,
            perfil: request.body.perfil || 'user'
        };

        let validacoes = validacao(corpoValidacao);

        if (!validacoes) {
            let mensagem = validacao.errors.instancePath.replace('/', '');
            mensagem += ' ' + validacao.errors.message;
            return response.status(400).json({
                message: mensagem,
            });
        }

        try {
            const ehAdminLogado = request.usuarioLogado && request.usuarioLogado.perfil === 'admin';

            const dadosModel = {
                nome: request.body.nome,
                email: request.body.email,
                perfil: ehAdminLogado && request.body.perfil === 'admin' ? 'admin' : 'user',
                senha: helper.hashSenha(request.body.senha)
            };

            const novoUsuario = await Usuario.criarNovo(dadosModel);

            return response.status(201).json({
                id_usuario: novoUsuario.id_usuario,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                perfil: novoUsuario.perfil
            });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                return response.status(400).json({ message: 'Este e-mail já está cadastrado no sistema.' });
            }

            return response.status(500).json({ message: 'Erro interno ao salvar o usuário.' });
        }
    }

    // PUT /usuarios/:id
    async update(request, response) {
        try {
            const { id } = request.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return response.status(404).json({ message: 'Usuário inexistente.' });
            }

            const dadosParaAtualizar = {
                nome: request.body.nome,
                email: request.body.email,
                perfil: request.body.perfil,
            };

            if (request.body.senha && request.body.senha.trim() !== '') {
                dadosParaAtualizar.senha = helper.hashSenha(request.body.senha);
            }

            await usuario.atualizarDados(dadosParaAtualizar);

            return response.status(200).json({ message: 'Usuário atualizado.' });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                return response.status(400).json({ message: 'Este e-mail já está sendo utilizado por outro usuário.' });
            }

            return response.status(500).json({ message: 'Erro interno ao modificar o usuário.' });
        }
    }



    // DELETE /usuarios/:id
    async delete(request, response) {
        try {
            const { id } = request.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return response.status(404).json({ message: 'Usuário inexistente.' });
            }

            await usuario.destroy();

            return response.status(200).json({ message: 'Usuário removido do sistema.' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return response.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    // POST /login
    async login(request, response) {
        try {
            const { email, senha } = request.body;

            if (!email || !senha) {
                return response.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
            }

            const senhaCriptografada = helper.hashSenha(senha);

            const usuario = await Usuario.findOne({
                email: email,
                senha: senhaCriptografada
            });

            if (!usuario) {
                return response.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            const token = helper.gerarTokenAcesso(usuario.id_usuario, usuario.perfil);

            return response.status(200).json({
                auth: true,
                token: token,
                perfil: usuario.perfil
            });

        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            return response.status(500).json({ error: 'Erro interno ao autenticar.' });
        }
    }

}

module.exports = new UsuarioController();
