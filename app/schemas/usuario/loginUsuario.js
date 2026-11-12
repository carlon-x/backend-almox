module.exports = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' }, // format para garantir que seja um e-mail válido
        senha: { type: 'string' },
    },
    required: ['email', 'senha'],
    additionalProperties: false,
};
