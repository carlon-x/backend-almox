module.exports = {
    type: 'object',
    properties: {
        area: { type: 'string' },
        estante: { type: 'string' },
        nivel_prateleira: { type: 'string' }
    },
    required: ['area', 'estante', 'nivel_prateleira'],
    additionalProperties: false // Impede o envio de campos que não estão listados acima
};
