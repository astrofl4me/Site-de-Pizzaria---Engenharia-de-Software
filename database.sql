CREATE DATABASE IF NOT EXISTS surunga_slice
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE surunga_slice;

CREATE TABLE IF NOT EXISTS clientes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_clientes_cpf (cpf),
  UNIQUE KEY uk_clientes_email (email),
  CONSTRAINT chk_clientes_nome CHECK (CHAR_LENGTH(TRIM(nome)) >= 3),
  CONSTRAINT chk_clientes_email CHECK (email LIKE '%_@_%._%')
);

CREATE TABLE IF NOT EXISTS produtos (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  categoria ENUM('Sabores', 'Bebidas', 'Sobremesas') NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao VARCHAR(120) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_produtos_nome_categoria (nome, categoria),
  CONSTRAINT chk_produtos_nome CHECK (CHAR_LENGTH(TRIM(nome)) >= 2),
  CONSTRAINT chk_produtos_preco CHECK (preco > 0)
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id INT NOT NULL AUTO_INCREMENT,
  nome_cliente VARCHAR(120) NOT NULL,
  valor_pagamento DECIMAL(10, 2) NOT NULL,
  tipo_pagamento ENUM('VR', 'Cartao credito', 'Cartao debito', 'Dinheiro', 'Pix') NOT NULL,
  troco VARCHAR(80) NOT NULL DEFAULT 'Sem necessidade de troco',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_pagamentos_cliente CHECK (CHAR_LENGTH(TRIM(nome_cliente)) >= 3),
  CONSTRAINT chk_pagamentos_valor CHECK (valor_pagamento > 0)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT NOT NULL AUTO_INCREMENT,
  itens TEXT NOT NULL,
  status ENUM('Recebido', 'Em preparo', 'Saiu para entrega', 'Entregue', 'Cancelado') NOT NULL DEFAULT 'Recebido',
  valor DECIMAL(10, 2) NOT NULL,
  `data` DATE NOT NULL,
  horario TIME NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_pedidos_itens CHECK (CHAR_LENGTH(TRIM(itens)) >= 2),
  CONSTRAINT chk_pedidos_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS cargo (
  id_cargo      INT           NOT NULL AUTO_INCREMENT,
  nome_cargo    VARCHAR(80)   NOT NULL,
  nivel_cargo   ENUM('Junior','Pleno','Senior','Gerente') NOT NULL,
  salario       DECIMAL(10,2) NOT NULL,
  carga_horaria INT           NOT NULL,
  PRIMARY KEY (id_cargo),
  CONSTRAINT chk_cargo_salario       CHECK (salario > 0),
  CONSTRAINT chk_cargo_carga_horaria CHECK (carga_horaria BETWEEN 1 AND 48)
);