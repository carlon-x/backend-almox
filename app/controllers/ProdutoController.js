const Ajv = require('ajv');
const ajv = new Ajv();
// Importando o esquema de validação do produto
const schema = require('../schemas/produto/novoProduto.js'); 
const validacao = ajv.compile(schema);

// Importa a Model orientada a objetos usando desestruturação
const { Produto } = require('../models/Produto.js');

class ProdutoController {
  
  // GET /produtos
  async findAll(request, response) {
    try {
      const produtosBanco = await Produto.findAll();

      // Formata a resposta JSON
      const resultado = produtosBanco.map(produto => ({
        id_item: produto.id_item,
        nome: produto.nome,
        descricao: produto.descricao,
        tipo: produto.tipo,
        quantidade_atual: produto.quantidade_atual,
        quantidade_minima: produto.quantidade_minima,
        status_alerta: produto.status_alerta, // Getter calcula dinamicamente quantidade_atual < quantidade_minima
        id_local: produto.id_local,
        id_usuario_evento: produto.id_usuario_evento,
        tipo_evento: produto.tipo_evento
      }));

      return response.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return response.status(500).json({ message: 'Erro interno no servidor ao buscar produtos.' });
    }
  }

  // GET /produtos/:id
  async find(request, response) {
    try {
      const { id } = request.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return response.status(404).json({ message: 'Item não encontrado no estoque.' });
      }

      return response.status(200).json({
        id_item: produto.id_item,
        nome: produto.nome,
        descricao: produto.descricao,
        tipo: produto.tipo,
        quantidade_atual: produto.quantidade_atual,
        quantidade_minima: produto.quantidade_minima,
        status_alerta: produto.status_alerta,
        id_local: produto.id_local,
        id_usuario_evento: produto.id_usuario_evento,
        tipo_evento: produto.tipo_evento
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  // POST /produtos
  async create(request, response) {
    // 1. Validação estrutural do JSON recebido via AJV
    let validacoes = validacao(request.body);
    
    if (!validacoes) {
      let mensagem = validacao.errors[0].instancePath.replace('/', '');
      mensagem += ' ' + validacao.errors[0].message;
      return response.status(400).json({
        message: mensagem,
      });
    }

    try {
      // 2. Coleta os dados limpos do request.body
      const dadosModel = {
        nome: request.body.nome,
        descricao: request.body.descricao,
        tipo: request.body.tipo,
        quantidade_atual: request.body.quantidade_atual,
        quantidade_minima: request.body.quantidade_minima,
        id_local: request.body.id_local,
        id_usuario_evento: request.body.id_usuario_evento || null,
        tipo_evento: request.body.tipo_evento || null
      };

      // 3. Salva de forma encapsulada
      const novoProduto = await Produto.criarNovo(dadosModel);

      // 4. Retorna a resposta de sucesso com o id_item gerado pelo BD
      return response.status(201).json({
        id_item: novoProduto.id_item,
        nome: novoProduto.nome,
        descricao: novoProduto.descricao,
        tipo: novoProduto.tipo,
        quantidade_atual: novoProduto.quantidade_atual,
        quantidade_minima: novoProduto.quantidade_minima,
        status_alerta: novoProduto.status_alerta,
        id_local: novoProduto.id_local,
        id_usuario_evento: novoProduto.id_usuario_evento,
        tipo_evento: novoProduto.tipo_evento
      });
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      
      // Erro caso tente referenciar um id_local que não existe no banco
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return response.status(400).json({ message: 'O id_local ou id_usuario_evento fornecido não existe.' });
      }
      
      return response.status(500).json({ message: 'Erro interno ao salvar o produto.' });
    }
  }

  // PUT /produtos/:id
  async update(request, response) {
    try {
      const { id } = request.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return response.status(404).json({ message: 'Item não encontrado no estoque.' });
      }

      // Atualiza os dados dinamicamente com o que veio no body ou mantém o que já existia
      const atualizacao = {
        quantidade_atual: request.body.quantidade_atual !== undefined ? request.body.quantidade_atual : produto.quantidade_atual,
        id_usuario_evento: request.body.id_usuario_evento !== undefined ? request.body.id_usuario_evento : produto.id_usuario_evento,
        tipo_evento: request.body.tipo_evento !== undefined ? request.body.tipo_evento : produto.tipo_evento
      };

      await produto.update(atualizacao);

      return response.status(200).json({ message: 'Item atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      // Validação física de chave estrangeira caso enviem um id_usuario_evento que não existe
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return response.status(400).json({ message: 'O id_usuario_evento fornecido não existe no sistema.' });
      }
      return response.status(500).json({ message: 'Erro interno ao modificar o item.' });
    }
  }

  // DELETE /produtos/:id
  async delete(request, response) {
    try {
      const { id } = request.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return response.status(404).json({ message: 'Item não encontrado.' });
      }

      await produto.destroy();

      return response.status(200).json({ message: 'Item deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
}

module.exports = new ProdutoController();
