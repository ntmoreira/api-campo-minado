# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

* Node.js (v24.15.0)
* Express.js
* PostgreSQL (hospedado no Supabase)
* dotenv
* cors
* bcrypt
* nodemon

## Banco de Dados

Este projeto utiliza o **Supabase** como serviço de banco de dados PostgreSQL na nuvem. Não é necessário instalar o PostgreSQL localmente.

Para configurar o banco de dados:

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Acesse **Connect** → **Direct** → copie a **Connection string**
4. Use as credenciais no arquivo `.env` conforme instruções abaixo

> **Importante:** O projeto já possui um banco configurado e funcional. Para testar sem configurar um banco próprio, solicite as credenciais ao autor do projeto.

## Pré-requisitos

* Node.js instalado
* Conta no Supabase (gratuita) **ou** credenciais fornecidas pelo autor

## Instalação

Clone o repositório:
```bash
git clone https://github.com/ntmoreira/api-campo-minado.git
```

Acesse a pasta do projeto:
```bash
cd api-campo-minado
```

Instale as dependências:
```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
DB_HOST=seu_host_supabase
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.seu_usuario_supabase
DB_PASSWORD=sua_senha

PORT=3000
NODE_ENV=development
```

> **Nota:** As variáveis acima são obtidas no painel do Supabase em **Connect** → **Transaction pooler**.

Execute a migration para criar as tabelas:
```bash
node src/modules/migrate.js
```

## Executando a aplicação

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastrar novo usuário |
| POST | `/auth/login` | Autenticar usuário |
| PATCH | `/auth/reset-password` | Redefinir senha |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users/:id` | Buscar dados do usuário |
| GET | `/users/dashboard?id=1` | Estatísticas pessoais |
| PUT | `/users/:id` | Atualizar saldo |
| DELETE | `/users/:id` | Excluir usuário |

### Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/games/start` | Iniciar nova partida |
| POST | `/games/:gameId/reveal` | Revelar posição no tabuleiro |
| POST | `/games/:gameId/cashout` | Encerrar partida e sacar prêmio |

## Exemplos de Uso

### Cadastro de usuário
```json
POST /auth/register
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```

### Login
```json
POST /auth/login
{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```

### Iniciar jogo
```json
POST /games/start
{
  "idUser": 1,
  "valorAposta": 100
}
```

### Revelar posição
```json
POST /games/1/reveal
{
  "linha": 2,
  "coluna": 3
}
```

### Cashout
```json
POST /games/1/cashout
```

## Fórmula de Premiação

A cada diamante encontrado:

```
premio = valorApostado × (1 + (quantidadeDiamantes × 0.33))
```

Exemplo com aposta de R$100,00:
- 1 diamante = R$133,00
- 2 diamantes = R$166,00
- 3 diamantes = R$199,00

Se encontrar uma bomba: `premio = 0`

## Estrutura do Projeto

```
api-campo-minado
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   └── jogoController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── usuarioService.js
│   │   └── jogoService.js
│   ├── repositories/
│   │   ├── usuarioRepository.js
│   │   └── jogoRepository.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   └── jogoRoutes.js
│   ├── config/
│   │   └── database.js
│   ├── modules/
│   │   ├── validarSenha.js
│   │   ├── tabuleiro.js
│   │   └── migrate.js
│   └── app.js
├── .env.example
├── package.json
└── README.md
```

## Integrantes

* Natan Ulisses A. Moreira
* Paulo Henrique da Silva Lage
* Andre Luiz
