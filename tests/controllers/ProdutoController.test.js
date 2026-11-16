const request = require('supertest');
const app = require('../../app');

describe('ProdutoController', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('GET /produtos', () => {
    test('deve responder 200 com a lista de produtos e ferramentas', async () => {
      const response = await request(app).get('/produtos');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id_item', 501);
    });
  });

  describe('GET /produtos/:id', () => {
  test('deve responder 200 com o produto correto quando o ID existir', async () => {
    const response = await request(app).get('/produtos/501');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id_item', 501);
  });

  test('deve responder 404 quando o produto nao existir', async () => {
    const response = await request(app).get('/produtos/999');
    expect(response.status).toBe(404);
  });
});

  describe('POST /produtos', () => {
    test('deve responder 201 ao cadastrar um item válido', async () => {
      const novoItem = {
        nome: "Chave Philips 1/4",
        descricao: "Chave de fenda cruzada isolada",
        tipo: "ferramenta",
        quantidade_atual: 5,
        quantidade_minima: 2,
        id_local: 101
      };

      const response = await request(app)
        .post('/produtos')
        .send(novoItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id_item', 503);
      expect(response.body.nome).toBe(novoItem.nome);
    });

    test('deve responder 400 se faltar algum campo obrigatório', async () => {
      const itemIncompleto = {
        nome: "Item sem o resto dos campos"
      };

      const response = await request(app)
        .post('/produtos')
        .send(itemIncompleto);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Dados de envio inválidos ou campos obrigatórios ausentes.");
    });
  });

  describe('PUT /produtos/:id', () => {
    test('deve responder 200 ao atualizar dados ou registrar um evento', async () => {
      const payloadEvento = {
        quantidade_atual: 2,
        id_usuario_evento: 1,
        tipo_evento: "cautela"
      };

      const response = await request(app)
        .put('/produtos/501')
        .send(payloadEvento);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item atualizado com sucesso.");
    });

    test('deve responder 404 ao tentar atualizar um item que não existe', async () => {
      const response = await request(app)
        .put('/produtos/999')
        .send({ quantidade_atual: 10 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Item não encontrado no estoque.");
    });
  });

  describe('DELETE /produtos/:id', () => {
    test('deve responder 200 ao deletar um produto com sucesso', async () => {
      const response = await request(app).delete('/produtos/501');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item deletado com sucesso.");
    });

    test('deve responder 404 se o produto não for localizado', async () => {
      const response = await request(app).delete('/produtos/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Item não encontrado.");
    });
  });
});
