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
