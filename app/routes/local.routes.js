const express = require('express');
var router = express.Router();
const localController = require('../controllers/LocalController.js');
//retorna todos os locais
router.get('/locais', localController.findAll);
//recupera um local pelo seu id
router.get('/locais/:id', localController.find);
//cria um novo local
router.post('/locais', localController.create);
//atualiza um local pelo seu id
router.put('/locais/:id', localController.update);
//exclui um local pelo seu id
router.delete('/locais/:id', localController.delete);

module.exports = router;