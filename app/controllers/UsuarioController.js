const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ formats: { email: true } }); // Diz para o Ajv aceitar o formato "email"
// Importando o esquema de validação do usuário
const schema = require('../schemas/usuario/novoUsuario.js');
const validacao = ajv.compile(schema);
const { Usuario } = require('../models/Usuario.js');
const helper = require('../commons/helper.js');

class UsuarioController {

    // GET /usuarios
    async findAll(request, response) {
        try {
            const usuariosBanco = await Usuario.findAll();

            // Formata a resposta mapeando as colunas reais
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

    // POST /usuarios
    async create(request, response) {
        // 1. Validação estrutural do JSON via AJV
        let validacoes = validacao(request.body);

        if (!validacoes) {
            let mensagem = validacao.errors[0].instancePath.replace('/', '');
            mensagem += ' ' + validacao.errors[0].message;
            return response.status(400).json({
                message: mensagem,
            });
        }

        try {
            const dadosModel = {
                nome: request.body.nome,
                email: request.body.email,
                perfil: request.body.perfil,
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

            // Erro ao cadastrar um e-mail duplicado (regra UNIQUE do banco)
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

            // Atualiza dinamicamente os campos fornecidos ou mantém os antigos
            const atualizacao = {
                nome: request.body.nome !== undefined ? request.body.nome : usuario.nome,
                email: request.body.email !== undefined ? request.body.email : usuario.email,
                perfil: request.body.perfil !== undefined ? request.body.perfil : usuario.perfil
            };

            await usuario.update(atualizacao);

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

            // Deleta o registro. (configuração 'onDelete: SET NULL' feita no arquivo
            // de associações, se este usuário tiver produtos associados a eventos criados por ele, 
            // os produtos não serão apagados; apenas o vínculo id_usuario_evento vira NULL.)
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
                // Se o findOne retornar null, as credenciais estão incorretas
                return response.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            // Se encontrou o usuário, gera o token JWT usando o SECRET do .env
            const token = helper.gerarTokenAcesso(usuario.id_usuario, usuario.perfil);
            return response.status(200).json({
                auth: true,
                token: `Bearer ${token}`
            });

        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            return response.status(500).json({ error: 'Erro interno ao autenticar.' });
        }
    }

}

module.exports = new UsuarioController();
