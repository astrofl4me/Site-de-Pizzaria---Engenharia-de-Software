const { pool } = require("../db");

async function listarPedidos() {
  const [rows] = await pool.execute(
    `SELECT id, itens, status, valor, DATE_FORMAT(\`data\`, '%Y-%m-%d') AS data,
            TIME_FORMAT(horario, '%H:%i') AS horario
     FROM pedidos
     ORDER BY \`data\` DESC, horario DESC, id DESC`
  );

  return rows;
}

async function buscarPedidoPorId(id) {
  const [rows] = await pool.execute(
    `SELECT id, itens, status, valor, DATE_FORMAT(\`data\`, '%Y-%m-%d') AS data,
            TIME_FORMAT(horario, '%H:%i') AS horario
     FROM pedidos
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function criarPedido(pedido) {
  const { itens, status, valor, data, horario } = pedido;

  const [result] = await pool.execute(
    `INSERT INTO pedidos (itens, status, valor, \`data\`, horario)
     VALUES (?, ?, ?, ?, ?)`,
    [itens, status, valor, data, horario]
  );

  return buscarPedidoPorId(result.insertId);
}

async function atualizarPedido(id, pedido) {
  const { itens, status, valor, data, horario } = pedido;

  const [result] = await pool.execute(
    `UPDATE pedidos
     SET itens = ?, status = ?, valor = ?, \`data\` = ?, horario = ?
     WHERE id = ?`,
    [itens, status, valor, data, horario, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarPedidoPorId(id);
}

async function removerPedido(id) {
  const [result] = await pool.execute(
    "DELETE FROM pedidos WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  removerPedido
};
