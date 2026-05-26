# Surunga Slice

Bem-vindo ao **Surunga Slice**, um sistema academico de pizzaria criado para a disciplina de Engenharia de Software.

A ideia do projeto foi simular um sistema simples de gerenciamento para uma pizzaria, com uma tela inicial de menu e um CRUD funcional para todas as telas. O projeto foi feito com tecnologias basicas da web e backend em Node.js, pensando em ser facil de entender, apresentar e evoluir.

Mesmo que voce nao tenha muita experiencia com tecnologia, este README foi escrito para te guiar passo a passo.

## O que o sistema faz?

Atualmente, o sistema permite:

- acessar uma tela inicial com os modulos do sistema;
- cadastrar clientes;
- listar clientes cadastrados;
- editar informacoes de clientes;
- remover clientes;
- cadastrar produtos do cardapio;
- listar produtos por categoria;
- editar e remover produtos;
- cadastrar pagamentos;
- listar, editar e remover pagamentos;
- salvar os dados em um banco MySQL.

## Tecnologias usadas

Este projeto usa:

- **HTML** para a estrutura das paginas;
- **CSS** para o visual e responsividade;
- **JavaScript** para interacoes no navegador;
- **Node.js** para rodar o backend;
- **Express** para criar o servidor;
- **MySQL** para armazenar os dados;
- **mysql2** para conectar Node.js ao MySQL;
- **dotenv** para ler configuracoes do arquivo `.env`;
- **nodemon** para facilitar o desenvolvimento.

## Estrutura das pastas

```text
project/
|-- backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- db.js
|   |-- server.js
|   |-- package.json
|   `-- .env
|
|-- frontend/
|   |-- assets/
|   |-- index.html
|   |-- script.js
|   `-- style.css
|
|-- database/
|-- fontes/
|-- icones/
|-- database.sql
|-- README.md
|-- .gitignore
`-- LICENSE
```

### Explicando de forma simples

- `frontend/`: parte visual do sistema, aquilo que aparece no navegador.
- `backend/`: parte responsavel por receber pedidos do frontend e conversar com o banco.
- `database.sql`: arquivo usado para criar o banco e as tabelas de clientes, produtos e pagamentos.
- `fontes/` e `icones/`: arquivos visuais usados no layout.
- `.gitignore`: evita subir arquivos sensiveis ou pesados para o GitHub.
- `README.md`: este guia.

## O que voce precisa instalar antes

Antes de rodar o projeto, confirme se voce tem instalado:

1. **Node.js**

   Baixe em:

   ```text
   https://nodejs.org/
   ```

   Para verificar se instalou:

   ```bash
   node -v
   npm -v
   ```

2. **MySQL**

   Pode ser MySQL Server, MySQL Workbench, XAMPP, WAMP ou outro ambiente que rode MySQL.

3. **Git**

   Baixe em:

   ```text
   https://git-scm.com/
   ```

   Para verificar:

   ```bash
   git --version
   ```

## Como rodar o projeto

Siga os passos com calma. A ordem importa.

### 1. Abra a pasta do projeto

No Git Bash:

```bash
cd "C:\Users\[SeuUsuário]\Documents"
```

Se voce colocou o projeto em outro lugar, use o caminho da sua pasta.

---

### 2. Crie o banco de dados

O projeto precisa do banco MySQL para funcionar corretamente.

Use o arquivo:

```text
database.sql
```

#### Opcao A: pelo terminal

Dentro da pasta `project`, rode:

```bash
mysql -u root -p < database.sql
```

Depois digite a senha do seu MySQL.

#### Opcao B: pelo MySQL Workbench

1. Abra o MySQL Workbench.
2. Conecte no seu servidor MySQL.
3. Abra o arquivo `database.sql`.
4. Execute o script.

Esse script cria o banco `surunga_slice` e as tabelas `clientes`, `produtos` e `pagamentos`.

---

### 3. Configure o arquivo `.env`

Dentro da pasta:

```text
backend/
```

deve existir um arquivo chamado:

```text
.env
```

Ele guarda as configuracoes do banco.

Exemplo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=surunga_slice
DB_PORT=3306
```

Troque `sua_senha` pela senha do seu MySQL.

Se seu MySQL nao tiver senha, deixe assim:

```env
DB_PASSWORD=
```

Importante: o arquivo `.env` nao deve ser enviado para o GitHub, porque pode conter senha.

---

### 4. Instale as dependencias

Entre na pasta do backend:

```bash
cd backend
```

Instale os pacotes:

```bash
npm install
```

Esse comando cria a pasta `node_modules/`, que contem as dependencias do projeto.

---

### 5. Rode o servidor

Ainda dentro da pasta `backend`, rode:

```bash
npm run dev
```

Se tudo estiver certo, voce deve ver algo parecido com:

```text
MySQL conectado com sucesso.
Servidor rodando em http://localhost:3000
```

---

### 6. Abra no navegador

Acesse:

```text
http://localhost:3000
```

Pronto. O sistema deve abrir no navegador.

---

## Rotas principais

Estas sao as rotas mais importantes do backend:

```text
GET    /api/health
GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id

GET    /api/produtos
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id

GET    /api/pagamentos
POST   /api/pagamentos
PUT    /api/pagamentos/:id
DELETE /api/pagamentos/:id
```

Para testar se o servidor esta funcionando, abra:

```text
http://localhost:3000/api/health
```

Se aparecer uma resposta com status `ok`, o backend esta rodando.

---

## Como usar o sistema

1. Abra a tela inicial.
2. Clique em **Cadastro de Clientes**.
3. Preencha os campos:
   - Nome
   - CPF
   - Telefone
   - Endereco
   - CEP
   - Estado
4. Clique em **Inserir**.
5. O cliente aparece na tabela.
6. Use **Editar** para alterar um cadastro.
7. Use **Remover** para excluir um cadastro.

Na tela **Cardapio**, voce tambem pode:

1. Cadastrar um produto.
2. Escolher a categoria:
   - Sabores
   - Bebidas
   - Sobremesas
3. Informar preco e descricao.
4. Editar ou remover produtos cadastrados.

---

## Problemas comuns

### Erro: nao conecta no MySQL

Confira:

- O MySQL esta ligado?
- O banco `surunga_slice` foi criado?
- O `.env` esta correto?
- Usuario e senha do MySQL estao certos?

---

### Erro: porta 3000 em uso

Altere a porta no `.env`:

```env
PORT=3001
```

Depois rode novamente:

```bash
npm run dev
```

E acesse:

```text
http://localhost:3001
```

---

### Erro: comando npm nao encontrado

Instale ou reinstale o Node.js:

```text
https://nodejs.org/
```

Depois feche e abra o terminal novamente.

---

### Erro: tabela nao existe

Provavelmente o arquivo `database.sql` ainda nao foi executado.

Execute novamente o script do banco.

---

## Como subir alteracoes para o GitHub

Depois de modificar o projeto:

```bash
git add .
git commit -m "Descreva a alteracao"
git push
```

Exemplo:

```bash
git add .
git commit -m "Melhora tela inicial"
git push
```

---

## Trabalhando com branch de desenvolvimento

Para nao mexer direto na `main`, crie uma branch:

```bash
git checkout -b desenvolvimento
git push -u origin desenvolvimento
```

Depois, para trabalhar nela:

```bash
git checkout desenvolvimento
```

Para voltar para a principal:

```bash
git checkout main
```

---

## Observacoes importantes

- Nao envie `node_modules/` para o GitHub.
- Nao envie `backend/.env` para o GitHub.
- Sempre rode `npm install` depois de baixar o projeto em outro computador.
- O backend precisa estar rodando para o CRUD funcionar.
- O MySQL precisa estar ligado.

---

## Status do projeto

Concluido ate o momento:

- Interface inicial
- Navegacao entre modulos
- CRUD de clientes
- CRUD de produtos/cardapio
- CRUD de pagamentos
- Integracao com MySQL
- Layout personalizado da pizzaria

Planejado para o futuro:

- Modulo de pedidos
- Modulo de funcionarios

---

## Licenca

Este projeto esta sob a licenca MIT.

---

## Autor

Projeto academico desenvolvido para a disciplina de Engenharia de Software.
