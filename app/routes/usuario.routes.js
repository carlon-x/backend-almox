const express = require('express');
var router = express.Router();
const usuarioController = require('../controllers/UsuarioController.js');
//retorna todos os usuarios
router.get('/usuarios', usuarioController.findAll);
//recupera um usuario pelo seu id
router.get('/usuarios/:id', usuarioController.find);
//cria um novo usuario
router.post('/usuarios', usuarioController.create);
//autentica o usuário
router.post('/login', usuarioController.login); // <--- LINHA ADICIONADA
//atualiza um usuario pelo seu id
router.put('/usuarios/:id', usuarioController.update);
//exclui um usuario pelo seu id
router.delete('/usuarios/:id', usuarioController.delete);
module.exports = router;