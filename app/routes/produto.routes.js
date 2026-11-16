const express = require('express');
const router = express.Router();

const ProdutoController = require('../controllers/ProdutoController.js');
const tokenValido = require('../middlewares/TokenValido.js');

// Todas as rotas de produtos exigem usuário autenticado
router.get('/produtos', tokenValido.check, ProdutoController.findAll);
router.get('/produtos/:id', tokenValido.check, ProdutoController.find);
router.post('/produtos', tokenValido.check, ProdutoController.create);
router.put('/produtos/:id', tokenValido.check, ProdutoController.update);
router.delete('/produtos/:id', tokenValido.check, ProdutoController.delete);

module.exports = router;
