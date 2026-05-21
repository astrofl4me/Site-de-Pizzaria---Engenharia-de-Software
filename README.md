# Surunga Slice

Sistema academico de pizzaria desenvolvido com HTML, CSS, JavaScript, Node.js, Express e MySQL.

O projeto possui uma interface web para navegacao entre modulos e um CRUD funcional de clientes integrado ao banco de dados MySQL.

## Tecnologias

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MySQL

## Estrutura

```text
project/
|-- backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- db.js
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- assets/
|   |-- index.html
|   |-- script.js
|   `-- style.css
|-- database/
|-- database.sql
|-- README.md
|-- .gitignore
`-- LICENSE
```

## Como rodar o projeto

1. Crie o banco de dados usando o arquivo `database.sql`.

No MySQL:

```sql
SOURCE caminho/para/database.sql;
```

Ou pelo terminal:

```bash
mysql -u root -p < database.sql
```

2. Configure o arquivo `backend/.env`.

Exemplo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=surunga_slice
DB_PORT=3306
```

3. Instale as dependencias e rode o backend.

```bash
cd backend
npm install
npm run dev
```

4. Acesse no navegador:

```text
http://localhost:3000
```

## Funcionalidades

- Tela inicial com menu de modulos
- Cadastro de clientes
- Listagem de clientes cadastrados
- Edicao de clientes
- Remocao de clientes
- Integracao com MySQL

## Observacao

As telas de pedidos, produtos, pagamento e funcionarios estao preparadas visualmente como modulos futuros.

## Licenca

Este projeto esta sob a licenca MIT.
