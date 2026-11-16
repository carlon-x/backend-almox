const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController.js');
const tokenValido = require('../middlewares/TokenValido.js');
const apenasAdmin = require('../middlewares/apenasAdmin.js');

// Rota de Autenticação (Login)
router.post('/login', UsuarioController.login);

// Rota pública de autocadastro (sempre cria como 'user')
router.post('/usuarios', UsuarioController.create);

// Rota exclusiva para admin logado criar outros admins ou usuários
router.post('/usuarios/admin', tokenValido.check, apenasAdmin.check, UsuarioController.create);

// Rotas restritas a administradores
router.get('/usuarios', tokenValido.check, apenasAdmin.check, UsuarioController.findAll);
router.get('/usuarios/:id', tokenValido.check, apenasAdmin.check, UsuarioController.find);
router.put('/usuarios/:id', tokenValido.check, apenasAdmin.check, UsuarioController.update);
router.delete('/usuarios/:id', tokenValido.check, apenasAdmin.check, UsuarioController.delete);

module.exports = router;
