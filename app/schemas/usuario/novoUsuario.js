module.exports = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' }, // Valida se é um e-mail estruturado
        perfil: { type: 'string', enum: ['admin', 'user'] },
        senha: { type: "string" }
    },
    required: ["nome", "email", "perfil", "senha"],
    additionalProperties: false
};
