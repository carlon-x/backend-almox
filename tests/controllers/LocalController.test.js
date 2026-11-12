const request = require('supertest');
const app = require('../../app');

describe('LocalController', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('findAll', () => {
    test('deve responder 200 com a lista de locais mapeados', async () => {
      const response = await request(app).get('/locais');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id_local: 101, area: "Galpão Central A", estante: "Estante 03", nivel_prateleira: "Nível 2" },
        { id_local: 102, area: "Contêiner de Ferramentas", estante: "Armário Vertical 01", nivel_prateleira: "Nível 4" },
      ]);
    });
  });

  describe('find', () => {
    test('deve responder 200 com o local correto quando o ID existir', async () => {
      const response = await request(app).get('/locais/101');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        id_local: 101, area: "Galpão Central A", estante: "Estante 03", nivel_prateleira: "Nível 2" 
      });
    });
  });

  describe('create', () => {
    test('deve responder 201 ao cadastrar uma localização válida', async () => {
      const novaLocalizacao = {
        area: "Almoxarifado B",
        estante: "Prateleira Suspensa 02",
        nivel_prateleira: "Nível 1"
      };

      const response = await request(app)
        .post('/locais')
        .send(novaLocalizacao);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id_local: 103,
        ...novaLocalizacao
      });
    });
  });

  describe('update', () => {
    test('deve responder 200 ao modificar um local existente com sucesso', async () => {
      const dadosAtualizados = { area: "Galpão Central Alterado" };
      const response = await request(app)
        .put('/locais/101')
        .send(dadosAtualizados);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Local modificado com sucesso.' });
    });

    test('deve responder 404 ao tentar atualizar um ID inexistente', async () => {
      const response = await request(app)
        .put('/locais/404')
        .send({ area: "Teste" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'ID de local incorreto.' });
    });
  });

  describe('delete', () => {
    test('deve responder 200 ao remover um local do mapa', async () => {
      const response = await request(app).delete('/locais/101');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Local removido.' });
    });

    test('deve responder 400 se o local possuir produtos vinculados', async () => {
      const response = await request(app).delete('/locais/999');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        message: 'Não é possível deletar um local que ainda possui produtos vinculados.' 
      });
    });
  });
});
