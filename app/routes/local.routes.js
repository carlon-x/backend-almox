const express = require('express');
var router = express.Router();
const localController = require('../controllers/LocalController.js');
const tokenValido = require('../middlewares/TokenValido.js');

//retorna todos os locais
router.get('/locais', tokenValido.check, localController.findAll);

//recupera um local pelo seu id
router.get('/locais/:id', tokenValido.check, localController.find);

//cria um novo local
router.post('/locais', tokenValido.check, localController.create);

//atualiza um local pelo seu id
router.put('/locais/:id', tokenValido.check, localController.update);

//exclui um local pelo seu id
router.delete('/locais/:id', tokenValido.check, localController.delete);

module.exports = router;
