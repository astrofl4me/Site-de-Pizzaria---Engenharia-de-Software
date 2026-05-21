const { pool } = require("../db");

async function listarClientes() {
  const [rows] = await pool.execute(
    `SELECT id, nome, cpf, telefone, endereco, cep, estado
     FROM clientes
     ORDER BY id DESC`
  );

  return rows;
}

async function buscarClientePorId(id) {
  const [rows] = await pool.execute(
    `SELECT id, nome, cpf, telefone, endereco, cep, estado
     FROM clientes
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function criarCliente(cliente) {
  const { nome, cpf, telefone, endereco, cep, estado } = cliente;

  const [result] = await pool.execute(
    `INSERT INTO clientes (nome, cpf, telefone, endereco, cep, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, cpf, telefone, endereco, cep, estado]
  );

  return buscarClientePorId(result.insertId);
}

async function atualizarCliente(id, cliente) {
  const { nome, cpf, telefone, endereco, cep, estado } = cliente;

  const [result] = await pool.execute(
    `UPDATE clientes
     SET nome = ?, cpf = ?, telefone = ?, endereco = ?, cep = ?, estado = ?
     WHERE id = ?`,
    [nome, cpf, telefone, endereco, cep, estado, id]
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

