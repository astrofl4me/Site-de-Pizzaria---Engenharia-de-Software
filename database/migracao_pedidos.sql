USE surunga_slice;

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
