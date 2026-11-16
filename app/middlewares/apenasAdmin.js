class ApenasAdmin {
  async check(request, response, next) {
    const usuario = request.usuarioLogado;

    if (!usuario || usuario.perfil !== 'admin') {
      return response.status(403).json({
        message: 'Acesso negado. Apenas administradores podem realizar esta operação.',
      });
    }

    return next();
  }
}

module.exports = new ApenasAdmin();
