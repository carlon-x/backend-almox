const express = require('express');
var router = express.Router();
const produtoController = require('../controllers/ProdutoController.js');
const tokenValido = require('../middlewares/TokenValido.js');
//retorna todos os produtos
router.get('/produtos', produtoController.findAll);
//recupera um produto pelo seu id
router.get('/produtos/:id', produtoController.find);
//cria um novo produto
router.post('/produtos', tokenValido.check, produtoController.create);
//atualiza um produto pelo seu id
router.put('/produtos/:id', tokenValido.check, produtoController.update);
//exclui um produto pelo seu id
router.delete('/produtos/:id', tokenValido.check, produtoController.delete);
module.exports = router;