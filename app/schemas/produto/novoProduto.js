module.exports = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        tipo: { type: 'string', enum: ['consumo', 'ferramenta'] },
        quantidade_atual: { type: 'integer', minimum: 0 },
        quantidade_minima: { type: 'integer', minimum: 0 },
        id_local: { type: 'integer' }
    },
    required: ['nome', 'tipo', 'quantidade_atual', 'quantidade_minima', 'id_local'],
    additionalProperties: false
};
