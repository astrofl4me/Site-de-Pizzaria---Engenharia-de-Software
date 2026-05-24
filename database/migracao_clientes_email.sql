USE surunga_slice;

ALTER TABLE clientes
  ADD COLUMN email VARCHAR(120) NULL AFTER telefone;

UPDATE clientes
SET email = CONCAT('cliente', id, '@surungaslice.local')
WHERE email IS NULL OR email = '';

ALTER TABLE clientes
  DROP CHECK chk_clientes_estado;

ALTER TABLE clientes
  DROP COLUMN endereco,
  DROP COLUMN cep,
  DROP COLUMN estado;

ALTER TABLE clientes
  MODIFY email VARCHAR(120) NOT NULL,
  ADD UNIQUE KEY uk_clientes_email (email),
  ADD CONSTRAINT chk_clientes_email CHECK (email LIKE '%_@_%._%');
