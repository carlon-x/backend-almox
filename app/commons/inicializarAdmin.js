const { Usuario } = require('../models/Usuario.js');
const helper = require('./helper.js');

async function inicializarAdmin() {
  try {
    const emailAdmin = process.env.ADMIN_EMAIL || 'admin@celesc.com.br';
    const senhaAdmin = process.env.ADMIN_PASSWORD || 'Celesc@2026';

    // Usa findAll para evitar qualquer conflito com métodos customizados na Model Usuario
    const usuarios = await Usuario.findAll();
    const adminExiste = usuarios.some((u) => u.perfil === 'admin');

    if (!adminExiste) {
      await Usuario.criarNovo({
        nome: 'Administrador SPSL',
        email: emailAdmin,
        perfil: 'admin',
        senha: helper.hashSenha(senhaAdmin),
      });
      console.log(`Administrador padrão criado: ${emailAdmin}`);
    } else {
      console.log('Administrador padrão já existe no banco.');
    }
  } catch (error) {
    console.error('Erro ao inicializar administrador padrão:', error);
  }
}

module.exports = inicializarAdmin;
