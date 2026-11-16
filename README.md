# ⚡ API REST - Controle de Almoxarifado SPSL (Celesc)

API RESTful desenvolvida em **Node.js**, **Express** e **Sequelize (MySQL)** para gerenciamento de estoque, ferramentas, materiais de consumo, locais de armazenamento e controle de acesso de usuários de uma subestação de energia.

---

## 📋 Índice

- [⚡ API REST - Controle de Almoxarifado SPSL (Celesc)](#-api-rest---controle-de-almoxarifado-spsl-celesc)
  - [📋 Índice](#-índice)
  - [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
  - [🗂️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
  - [🗄️ Modelagem do Banco de Dados](#️-modelagem-do-banco-de-dados)
    - [Regras de Integridade Referencial](#regras-de-integridade-referencial)
  - [⚙️ Pré-requisitos e Instalação](#️-pré-requisitos-e-instalação)
  - [🔐 Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
  - [🛡️ Autenticação e Controle de Acesso (RBAC)](#️-autenticação-e-controle-de-acesso-rbac)
  - [📡 Documentação das Rotas (Endpoints)](#-documentação-das-rotas-endpoints)
    - [🔑 Autenticação e Usuários](#-autenticação-e-usuários)
    - [📦 Produtos (Estoque e Ferramentas)](#-produtos-estoque-e-ferramentas)
    - [📍 Locais de Armazenamento](#-locais-de-armazenamento)

---

## 🚀 Tecnologias Utilizadas

- **Node.js** & **Express** (Servidor HTTP e roteamento)
- **MySQL** & **Sequelize ORM** (Persistência, sincronização automática de tabelas e integridade referencial)
- **JSON Web Token (`jsonwebtoken`)** (Autenticação stateless com expiração)
- **AJV (`ajv` e `ajv-formats`)** (Validação estrutural de payloads JSON)
- **Dotenv** & **CORS** (Configuração por ambiente e liberação de origem cruzada)

---

## 🗂️ Arquitetura do Projeto

O projeto segue o padrão **MVC (Model-View-Controller)** aliado à **Programação Orientada a Objetos (POO)** com atributos privados, getters/setters e middlewares de segurança:

```text
backend-almox/
├── app/
│   ├── commons/
│   │   ├── helper.js             # Criptografia de senhas e geração de tokens JWT
│   │   └── inicializarAdmin.js   # Seed automático do administrador inicial via .env
│   ├── controllers/
│   │   ├── LocalController.js    # Regras de negócio de locais
│   │   ├── ProdutoController.js  # Regras de negócio, alertas de estoque e eventos
│   │   └── UsuarioController.js  # Autenticação (/login) e CRUD de usuários
│   ├── middlewares/
│   │   ├── apenasAdmin.js        # Bloqueia rotas administrativas para perfis 'user'
│   │   └── TokenValido.js        # Valida o Bearer Token JWT nas requisições
│   ├── models/
│   │   ├── index.js              # Inicialização da conexão e associações (FKs)
│   │   ├── conexao.js            # Instância do Sequelize
│   │   ├── Local.js              # Model da tabela 'local'
│   │   ├── Produto.js            # Model da tabela 'produto'
│   │   └── Usuario.js            # Model da tabela 'usuario'
│   ├── routes/
│   │   ├── local.routes.js       # Endpoints de /locais
│   │   ├── produto.routes.js     # Endpoints de /produtos
│   │   └── usuario.routes.js     # Endpoints de /login e /usuarios
│   └── schemas/                  # Esquemas de validação AJV
├── .env.example                  # Modelo das variáveis de ambiente
├── app.js                        # Ponto de entrada da aplicação
├── config.js                     # Configurações gerais e do banco de dados
└── package.json
```

---

## 🗄️ Modelagem do Banco de Dados

O banco de dados relacional (`almoxarifadodb`) é criado e sincronizado automaticamente pelo Sequelize ao iniciar a aplicação, contendo **3 tabelas** interligadas por chaves estrangeiras:

```text
+-----------------------+          +-----------------------------------+          +-------------------------+

|        usuario        |          |              produto              |          |          local          |
+-----------------------+          +-----------------------------------+          +-------------------------+

| PK id_usuario (INT)   |<---+     | PK id_item (INT)                  |     +--->| PK id (INT)             |
|    nome (VARCHAR)     |    |     |    nome (VARCHAR)                 |     |    |    area (VARCHAR)       |
| UQ email (VARCHAR)    |    |     |    descricao (TEXT)               |     |    |    estante (VARCHAR)    |
|    perfil (ENUM)      |    |     |    tipo (ENUM)                    |     |    |    prateleira (VARCHAR) |
|    senha (VARCHAR)    |    |     |    quantidade_atual (INT)         |     |    +-------------------------+
+-----------------------+    |     |    quantidade_minima (INT)        |     |

                             |     | FK id_local (INT) [NOT NULL]      |-----+
                             +-----| FK id_usuario_evento (INT) [NULL] |

                                   |    tipo_evento (ENUM)             |
                                   +-----------------------------------+
```

### Regras de Integridade Referencial

- **`produto.id_local` -> `local.id`**: `ON DELETE RESTRICT` (impede excluir um local que possua itens armazenados).
- **`produto.id_usuario_evento` -> `usuario.id_usuario`**: `ON DELETE SET NULL` (ao excluir um usuário, o histórico de produtos não é apagado; o vínculo passa a `NULL`).
- **Alerta de Estoque**: Quando `quantidade_atual < quantidade_minima`, a API sinaliza `status_alerta: true`.

---

## ⚙️ Pré-requisitos e Instalação

1. **Pré-requisitos:**
   - [Node.js](https://nodejs.org) (v18 ou superior)
   - Servidor [MySQL](https://mysql.com) ativo

2. **Clone o repositório e instale as dependências:**

   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd backend-almox
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` na raiz do projeto e preencha suas credenciais:

   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor:**

   ```bash
   # Modo produção
   npm start

   # Modo desenvolvimento (com nodemon)
   npm run dev
   ```

   Ao iniciar, a API verifica/cria o banco de dados, sincroniza as tabelas e cria automaticamente o usuário administrador inicial caso ainda não exista.

---

## 🔐 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:

```env
PORT=3000
SECRET=sua_chave_secreta_jwt

DBHOST=localhost
DBPORT=3306
DBNAME=almoxarifadodb
DBUSER=root
DBPASS=sua_senha_mysql
DBDIALECT=mysql

ADMIN_EMAIL=admin@celesc.com.br
ADMIN_PASSWORD=sua_senha_admin
```

---

## 🛡️ Autenticação e Controle de Acesso (RBAC)

- **Autenticação JWT:** Após realizar `POST /login`, a API retorna um token JWT que deve ser enviado no cabeçalho das requisições protegidas:

  ```http
  Authorization: Bearer <seu_token_jwt>
  ```

- **Perfis de Acesso:**
  - `user` (Padrão): Todo autocadastro pela rota pública `POST /usuarios` recebe automaticamente o perfil `user`. Pode gerenciar produtos e locais.
  - `admin` (Administrador): Criado inicialmente via seed (`.env`) ou por outro administrador autenticado (`POST /usuarios/admin`). Possui acesso exclusivo para listar, visualizar, editar e excluir usuários.

---

## 📡 Documentação das Rotas (Endpoints)

### 🔑 Autenticação e Usuários

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Público | Autentica usuário com `email` e `senha` e retorna o token JWT. |
| `POST` | `/usuarios` | Público | Autocadastro de novo usuário (força `perfil: "user"`). |
| `POST` | `/usuarios/admin` | Admin | Cadastra usuário permitindo definir `perfil` (`admin` ou `user`). |
| `GET` | `/usuarios` | Admin | Lista todos os usuários cadastrados (sem expor senhas). |
| `GET` | `/usuarios/:id` | Admin | Retorna os detalhes de um usuário específico pelo ID. |
| `PUT` | `/usuarios/:id` | Admin | Atualiza nome, e-mail, perfil ou senha de um usuário. |
| `DELETE` | `/usuarios/:id` | Admin | Remove um usuário do sistema. |

### 📦 Produtos (Estoque e Ferramentas)

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/produtos` | Autenticado | Lista todos os itens do estoque com indicador `status_alerta`. |
| `GET` | `/produtos/:id` | Autenticado | Retorna os detalhes de um item pelo `id_item`. |
| `POST` | `/produtos` | Autenticado | Cadastra novo item (`tipo`: `ferramenta` ou `consumo`). |
| `PUT` | `/produtos/:id` | Autenticado | Atualiza quantidade e registra evento (`abastecimento`, `cautela`, `log_dano`, `log_perda`). |
| `DELETE` | `/produtos/:id` | Autenticado | Exclui um item do estoque. |

### 📍 Locais de Armazenamento

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/locais` | Autenticado | Lista todas as áreas, estantes e prateleiras cadastradas. |
| `GET` | `/locais/:id` | Autenticado | Retorna os detalhes de um local específico. |
| `POST` | `/locais` | Autenticado | Cadastra um novo local (`area`, `estante`, `nivel_prateleira`). |
| `PUT` | `/locais/:id` | Autenticado | Atualiza os dados de um local existente. |
| `DELETE` | `/locais/:id` | Autenticado | Remove um local (bloqueado se houver produtos vinculados). |
