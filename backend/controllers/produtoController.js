const Produto = require("../models/produtoModel");

const CATEGORIAS = ["Sabores", "Bebidas", "Sobremesas"];

function limparTexto(valor) {
  return String(valor || "").trim();
}

function normalizarProduto(body) {
  return {
    nome: limparTexto(body.nome),
    categoria: limparTexto(body.categoria),
    preco: Number(body.preco),
    descricao: limparTexto(body.descricao)
  };
}

function validarProduto(produto) {
  const erros = [];

  if (produto.nome.length < 2) {
    erros.push("Nome deve ter pelo menos 2 caracteres.");
  }

  if (!CATEGORIAS.includes(produto.categoria)) {
    erros.push("Categoria invalida.");
  }

  if (!Number.isFinite(produto.preco) || produto.preco <= 0) {
    erros.push("Preco deve ser maior que zero.");
  }

  if (produto.descricao.length > 120) {
    erros.push("Descricao deve ter no maximo 120 caracteres.");
  }

  return erros;
}

function tratarErroMySQL(error, response) {
  if (error && error.code === "ER_DUP_ENTRY") {
    return response.status(409).json({
      erro: "Ja existe um produto cadastrado com este nome nesta categoria."
    });
  }

  console.error(error);
  return response.status(500).json({
    erro: "Erro interno no servidor."
  });
}

async function listar(request, response) {
  try {
    const produtos = await Produto.listarProdutos();
    return response.json(produtos);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function buscarPorId(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID invalido." });
    }

    const produto = await Produto.buscarProdutoPorId(id);

    if (!produto) {
      return response.status(404).json({ erro: "Produto nao encontrado." });
    }

    return response.json(produto);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function criar(request, response) {
  try {
    const produto = normalizarProduto(request.body);
    const erros = validarProduto(produto);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const novoProduto = await Produto.criarProduto(produto);
    return response.status(201).json(novoProduto);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function atualizar(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID invalido." });
    }

    const produto = normalizarProduto(request.body);
    const erros = validarProduto(produto);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const produtoAtualizado = await Produto.atualizarProduto(id, produto);

    if (!produtoAtualizado) {
      return response.status(404).json({ erro: "Produto nao encontrado." });
    }

    return response.json(produtoAtualizado);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function remover(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID invalido." });
    }

    const removido = await Produto.removerProduto(id);

    if (!removido) {
      return response.status(404).json({ erro: "Produto nao encontrado." });
    }

    return response.json({ mensagem: "Produto removido com sucesso." });
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
