module.exports = function (models) {
    // 1. Relacionamento Local <-> Produto (Um local tem muitos produtos)
    models.Local.hasMany(models.Produto, { 
        foreignKey: 'id_local', 
        as: 'produtos',
        onDelete: 'RESTRICT' // Impede de deletar uma prateleira se ainda houver produtos nela
    });
    
    models.Produto.belongsTo(models.Local, { 
        foreignKey: 'id_local', 
        as: 'local' 
    });

    // 2. Relacionamento Usuario <-> Produto (Um usuário registra vários eventos/cautelas em produtos)
    models.Usuario.hasMany(models.Produto, { 
        foreignKey: 'id_usuario_evento', 
        as: 'produtos_alterados',
        onDelete: 'SET NULL' // Se o usuário sumir, o histórico do produto mantém o evento com id_usuario = null
    });
    
    models.Produto.belongsTo(models.Usuario, { 
        foreignKey: 'id_usuario_evento', 
        as: 'usuario_evento' 
    });
};
