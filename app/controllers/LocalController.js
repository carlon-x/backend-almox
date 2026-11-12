const Ajv = require('ajv');
const ajv = new Ajv();
const schema = require('../schemas/local/novoLocal.js');
const validacao = ajv.compile(schema);

// Importa a Model orientada a objetos (usando desestruturação)
const { Local } = require('../models/Local.js');

class LocalController {
  // GET /locais
  async findAll(request, response) {
    try {
      const locaisBanco = await Local.findAll();
      
      // Formata a saída mapeando as colunas
      const resultado = locaisBanco.map(local => ({
        id_local: local.id,
        area: local.area,
        estante: local.estante,
        nivel_prateleira: local.prateleira
      }));

      return response.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar locais:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  // GET /locais/:id
  async find(request, response) {
    try {
      const { id } = request.params;
      const local = await Local.findByPk(id);

      if (!local) {
        return response.status(404).json({
          message: 'prateleira nao encontrada',
        });
      }

      return response.status(200).json({ 
        id_local: local.id, 
        area: local.area, 
        estante: local.estante, 
        nivel_prateleira: local.prateleira 
      });
    } catch (error) {
      console.error('Erro ao buscar local:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  // POST /locais
  async create(request, response) {
    // 1. Executa a validação do esquema JSON usando o AJV (Another JSON Validator) 
    let validacoes = validacao(request.body);
    
    if (!validacoes) {
      let mensagem = validacao.errors[0].instancePath.replace('/', '');
      mensagem += ' ' + validacao.errors[0].message;
      return response.status(400).json({
        message: mensagem,
      });
    }

    try {
      // 2. Adapta o request.body para as propriedades da Model
      const dadosModel = {
        area: request.body.area,
        estante: request.body.estante,
        prateleira: request.body.nivel_prateleira // Converte 'nivel_prateleira' para 'prateleira'
      };

      // 3. Invoca o método estático para salvar no MySQL de forma encapsulada
      const novoLocal = await Local.criarNovo(dadosModel);

      // 4. Retorna os dados gravados reais vindo do banco com o ID gerado pelo autoIncrement
      return response.status(201).json({
        id_local: novoLocal.id,
        area: novoLocal.area,
        estante: novoLocal.estante,
        nivel_prateleira: novoLocal.prateleira
      });
    } catch (error) {
      console.error('Erro ao criar local no banco:', error);
      return response.status(500).json({ message: 'Erro interno ao salvar no banco de dados.' });
    }
  }

  // PUT /locais/:id
  async update(request, response) {
    try {
      const { id } = request.params;
      const local = await Local.findByPk(id);
      
      if (!local) {
        return response.status(404).json({ message: 'ID de local incorreto.' });
      }

      // Prepara os dados para atualização tratando o mapeamento
      const atualizacao = {
        area: request.body.area || local.area,
        estante: request.body.estante || local.estante,
        prateleira: request.body.nivel_prateleira || local.prateleira
      };

      await local.update(atualizacao);

      return response.status(200).json({ message: 'Local modificado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar local:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  // DELETE /locais/:id
  async delete(request, response) {
    try {
      const { id } = request.params;
      const local = await Local.findByPk(id);

      if (!local) {
        return response.status(404).json({ message: 'Local não encontrado.' });
      }

      // Tenta apagar o local. Se o relacionamento impedir (devido ao ON DELETE RESTRICT),
      // o código cairá automaticamente no bloco catch abaixo
      await local.destroy();

      return response.status(200).json({ message: 'Local removido.' });
    } catch (error) {
      // Verifica se o erro foi disparado pelo bloqueio de chave estrangeira de produtos vinculados
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return response.status(400).json({ 
          message: 'Não é possível deletar um local que ainda possui produtos vinculados.' 
        });
      }
      console.error('Erro ao deletar local:', error);
      return response.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
}

module.exports = new LocalController();
