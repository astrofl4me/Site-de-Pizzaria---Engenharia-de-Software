const { pool } = require("../db");

async function listarCargos() {
  const [rows] = await pool.execute(
    `SELECT id_cargo, nome_cargo, nivel_cargo, salario, carga_horaria
     FROM cargo
     ORDER BY id_cargo DESC`
  );
  return rows;
}

async function buscarCargoPorId(id) {
  const [rows] = await pool.execute(
    `SELECT id_cargo, nome_cargo, nivel_cargo, salario, carga_horaria
     FROM cargo
     WHERE id_cargo = ?`,
    [id]
  );
  return rows[0] || null;
}

async function criarCargo(cargo) {
  const { nome_cargo, nivel_cargo, salario, carga_horaria } = cargo;
  const [result] = await pool.execute(
    `INSERT INTO cargo (nome_cargo, nivel_cargo, salario, carga_horaria)
     VALUES (?, ?, ?, ?)`,
    [nome_cargo, nivel_cargo, salario, carga_horaria]
  );
  return buscarCargoPorId(result.insertId);
}

async function atualizarCargo(id, cargo) {
  const { nome_cargo, nivel_cargo, salario, carga_horaria } = cargo;
  const [result] = await pool.execute(
    `UPDATE cargo
     SET nome_cargo = ?, nivel_cargo = ?, salario = ?, carga_horaria = ?
     WHERE id_cargo = ?`,
    [nome_cargo, nivel_cargo, salario, carga_horaria, id]
  );
  if (result.affectedRows === 0) return null;
  return buscarCargoPorId(id);
}

async function removerCargo(id) {
  const [result] = await pool.execute(
    "DELETE FROM cargo WHERE id_cargo = ?",
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  listarCargos,
  buscarCargoPorId,
  criarCargo,
  atualizarCargo,
  removerCargo,
};