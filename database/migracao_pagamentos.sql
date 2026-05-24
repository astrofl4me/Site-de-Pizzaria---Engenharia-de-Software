USE surunga_slice;

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
