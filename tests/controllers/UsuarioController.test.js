const request = require('supertest');
const app = require('../../app');

describe('UsuarioController', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('GET /usuarios', () => {
    test('deve responder 200 com a lista de usuarios cadastrados', async () => {
      const response = await request(app).get('/usuarios');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id_usuario', 1);
      expect(response.body[0].nome).toBe("Carlon Xavier");
    });
  });

  describe('GET /usuarios/:id', () => {
    test('deve responder 200 com o usuario correto quando o ID existir', async () => {
      const response = await request(app).get('/usuarios/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id_usuario', 1);
      expect(response.body.perfil).toBe("admin");
    });

    test('deve responder 404 quando o usuario nao for encontrado', async () => {
      const response = await request(app).get('/usuarios/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Usuário inexistente.");
    });
  });

  describe('POST /usuarios', () => {
    test('deve responder 201 ao cadastrar um operador ou admin válido', async () => {
      const novoUsuario = {
        nome: "Maria Souza",
        email: "maria.souza@subestacao.com",
        perfil: "user"
      };

      const response = await request(app)
        .post('/usuarios')
        .send(novoUsuario);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id_usuario', 3);
      expect(response.body.email).toBe(novoUsuario.email);
    });

    test('deve responder 400 se faltar algum campo obrigatório', async () => {
      const usuarioIncompleto = {
        nome: "Sem Email e Perfil"
      };

      const response = await request(app)
        .post('/usuarios')
        .send(usuarioIncompleto);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /usuarios/:id', () => {
    test('deve responder 200 ao atualizar credenciais ou perfil com sucesso', async () => {
      const dadosAtualizados = { perfil: "admin" };
      const response = await request(app)
        .put('/usuarios/2')
        .send(dadosAtualizados);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Usuário atualizado.");
    });

    test('deve responder 404 ao tentar atualizar um usuario inexistente', async () => {
      const response = await request(app)
        .put('/usuarios/999')
        .send({ perfil: "user" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Usuário inexistente.");
    });
  });

  describe('DELETE /usuarios/:id', () => {
    test('deve responder 200 ao remover o acesso de um usuario', async () => {
      const response = await request(app).delete('/usuarios/2');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Usuário removido do sistema.");
    });
    test('deve responder 404 ao tentar remover um usuario inexistente', async () => {
      const response = await request(app).delete('/usuarios/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Usuário inexistente.");
    });
  });
});