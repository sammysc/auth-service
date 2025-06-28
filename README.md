# Auth Service

Este microserviço é responsável pela autenticação de alunos e professores da plataforma educacional.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/)
- Node.js 18+ (apenas para execução local)
- Banco de dados PostgreSQL (usado via Docker)

## Executando com Docker

1. Certifique-se de que a rede Docker `plataforma-network` já existe:
   ```sh
   docker network create plataforma-network || true
   ```

2. Suba o serviço:
   ```sh
   docker-compose up --build
   ```

3. O serviço estará disponível em `http://localhost:3002`.

## Executando Localmente

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Configure o banco de dados PostgreSQL (veja as credenciais em `config/config.json`).

3. Execute as migrações:
   ```sh
   npx sequelize-cli db:migrate
   ```

4. Inicie o serviço:
   ```sh
   npm start
   ```

5. O serviço estará disponível em `http://localhost:3002`.

## Endpoints

- `POST /auth/register` - Registro de usuário (aluno ou professor)
- `POST /auth/login` - Login de usuário
- `GET /auth/profile` - Perfil do usuário autenticado

Consulte a documentação Swagger (em breve)