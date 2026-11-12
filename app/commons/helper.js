const config = require('../../config.js'); // Importa as configurações globais da raiz
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 1. Função de Hash
exports.hashSenha = (senha) => {
    const hash = crypto.createHash('sha256');
    hash.update(senha);
    return hash.digest('hex');
};

// 2. NOVA FUNÇÃO: Encapsulamento da assinatura do JWT
exports.gerarTokenAcesso = (id_usuario, perfil) => {
    // Usa o process.env.SECRET e define expiração de 1 hora
    const secretKey = process.env.SECRET || 'chave_reserva';
    
    return jwt.sign(
        { id_usuario, perfil }, 
        secretKey, 
        { expiresIn: '1h' }
    );
};
