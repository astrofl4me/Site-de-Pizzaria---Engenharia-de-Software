const { pool } = require("../db");

async function listarPagamentos() {
  const [rows] = await pool.execute(
    `SELECT id, nome_cliente, valor_pagamento, tipo_pagamento, troco
     FROM pagamentos
     ORDER BY id DESC`
  );

  return rows;
}

async function buscarPagamentoPorId(id) {
  const [rows] = await pool.execute(
    `SELECT id, nome_cliente, valor_pagamento, tipo_pagamento, troco
     FROM pagamentos
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function criarPagamento(pagamento) {
  const { nome_cliente, valor_pagamento, tipo_pagamento, troco } = pagamento;

  const [result] = await pool.execute(
    `INSERT INTO pagamentos (nome_cliente, valor_pagamento, tipo_pagamento, troco)
     VALUES (?, ?, ?, ?)`,
    [nome_cliente, valor_pagamento, tipo_pagamento, troco]
  );

  return buscarPagamentoPorId(result.insertId);
}

async function atualizarPagamento(id, pagamento) {
  const { nome_cliente, valor_pagamento, tipo_pagamento, troco } = pagamento;

  const [result] = await pool.execute(
    `UPDATE pagamentos
     SET nome_cliente = ?, valor_pagamento = ?, tipo_pagamento = ?, troco = ?
     WHERE id = ?`,
    [nome_cliente, valor_pagamento, tipo_pagamento, troco, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarPagamentoPorId(id);
}

async function removerPagamento(id) {
  const [result] = await pool.execute(
    "DELETE FROM pagamentos WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listarPagamentos,
  buscarPagamentoPorId,
  criarPagamento,
  atualizarPagamento,
  removerPagamento
};
