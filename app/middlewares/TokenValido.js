const jwt = require('jsonwebtoken');
const config = require('../../config.js'); // Vincula ao arquivo de configuração da raiz

class TokenValido {
    async check(request, response, next) {
        const cabecalhoAuth = request.headers['authorization'];

        // Se nenhum cabeçalho de autenticação foi fornecido:
        if (!cabecalhoAuth) {
            return response.status(401).json({
                message: 'Sem autorizacao ou nao possui authorization nos headers da requisicao.',
            });
        }

        // Se o cabeçalho de autenticação bearer nao foi fornecido:
        if (!cabecalhoAuth.startsWith('Bearer')) {
            return response.status(401).json({
                message: 'mecanismo de autenticacao invalido, configure Bearer Token.',
            });
        }

        const token = cabecalhoAuth.split(' ')[1];
        // Se o cabeçalho de autenticação foi fornecido mas o token nao foi:
        if (!token) {
            return response.status(401).json({
                message: 'Bearer token nao fornecido.',
            });
        }

        // Verifica o token JWT usando a chave secreta definida no seu .env / config
        // Nota: se o config exportar de outra forma, pode usar process.env.SECRET
        const chaveSecreta = process.env.SECRET || 'chave_reserva';

        jwt.verify(token, chaveSecreta, (erro, usuarioData) => {
            if (erro) {
                return response.status(403).json({
                    message: 'token esta invalido, realize o login novamente.',
                });
            }

            // Caso para salvar os dados do usuário autenticado na requisição para uso posterior:
            request.usuarioLogado = usuarioData;
            
            // Segue para a próxima etapa do fluxo (o Controller)
            return next();
        });
    }
}

// Exporta uma nova instância da classe
module.exports = new TokenValido();
