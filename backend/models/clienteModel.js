const { pool } = require("../db");

async function listarClientes() {
  const [rows] = await pool.execute(
    `SELECT id, nome, cpf, telefone, email
     FROM clientes
     ORDER BY id DESC`
  );

  return rows;
}

async function buscarClientePorId(id) {
  const [rows] = await pool.execute(
    `SELECT id, nome, cpf, telefone, email
     FROM clientes
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function criarCliente(cliente) {
  const { nome, cpf, telefone, email } = cliente;

  const [result] = await pool.execute(
    `INSERT INTO clientes (nome, cpf, telefone, email)
     VALUES (?, ?, ?, ?)`,
    [nome, cpf, telefone, email]
  );

  return buscarClientePorId(result.insertId);
}

async function atualizarCliente(id, cliente) {
  const { nome, cpf, telefone, email } = cliente;

  const [result] = await pool.execute(
    `UPDATE clientes
     SET nome = ?, cpf = ?, telefone = ?, email = ?
     WHERE id = ?`,
    [nome, cpf, telefone, email, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarClientePorId(id);
}

async function removerCliente(id) {
  const [result] = await pool.execute(
    "DELETE FROM clientes WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  removerCliente
};
