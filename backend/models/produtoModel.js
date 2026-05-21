const { pool } = require("../db");

async function listarProdutos() {
  const [rows] = await pool.execute(
    `SELECT id, nome, categoria, preco, descricao
     FROM produtos
     ORDER BY categoria ASC, nome ASC`
  );

  return rows;
}

async function buscarProdutoPorId(id) {
  const [rows] = await pool.execute(
    `SELECT id, nome, categoria, preco, descricao
     FROM produtos
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function criarProduto(produto) {
  const { nome, categoria, preco, descricao } = produto;

  const [result] = await pool.execute(
    `INSERT INTO produtos (nome, categoria, preco, descricao)
     VALUES (?, ?, ?, ?)`,
    [nome, categoria, preco, descricao]
  );

  return buscarProdutoPorId(result.insertId);
}

async function atualizarProduto(id, produto) {
  const { nome, categoria, preco, descricao } = produto;

  const [result] = await pool.execute(
    `UPDATE produtos
     SET nome = ?, categoria = ?, preco = ?, descricao = ?
     WHERE id = ?`,
    [nome, categoria, preco, descricao, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarProdutoPorId(id);
}

async function removerProduto(id) {
  const [result] = await pool.execute(
    "DELETE FROM produtos WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  removerProduto
};
