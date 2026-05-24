const Pagamento = require("../models/pagamentoModel");

const TIPOS_PAGAMENTO = ["VR", "Cartao credito", "Cartao debito", "Dinheiro", "Pix"];
const SEM_TROCO = "Sem necessidade de troco";

function limparTexto(valor) {
  return String(valor || "").trim();
}

function normalizarPagamento(body) {
  const tipoPagamento = limparTexto(body.tipo_pagamento);
  const trocoInformado = limparTexto(body.troco);
  const valorTroco = Number(trocoInformado.replace(",", "."));

  return {
    nome_cliente: limparTexto(body.nome_cliente),
    valor_pagamento: Number(body.valor_pagamento),
    tipo_pagamento: tipoPagamento,
    troco: tipoPagamento === "Dinheiro" && Number.isFinite(valorTroco) && valorTroco > 0
      ? `R$ ${valorTroco.toFixed(2).replace(".", ",")}`
      : tipoPagamento === "Dinheiro"
        ? trocoInformado
        : SEM_TROCO
  };
}

function validarPagamento(pagamento) {
  const erros = [];

  if (pagamento.nome_cliente.length < 3) {
    erros.push("Nome do cliente deve ter pelo menos 3 caracteres.");
  }

  if (!Number.isFinite(pagamento.valor_pagamento) || pagamento.valor_pagamento <= 0) {
    erros.push("Valor do pagamento deve ser maior que zero.");
  }

  if (!TIPOS_PAGAMENTO.includes(pagamento.tipo_pagamento)) {
    erros.push("Tipo de pagamento invalido.");
  }

  if (pagamento.tipo_pagamento === "Dinheiro" && pagamento.troco.length === 0) {
    erros.push("Informe o troco para pagamento em dinheiro.");
  }

  return erros;
}

function tratarErroMySQL(error, response) {
  console.error(error);
  return response.status(500).json({
    erro: "Erro interno no servidor."
  });
}

async function listar(request, response) {
  try {
    const pagamentos = await Pagamento.listarPagamentos();
    return response.json(pagamentos);
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

    const pagamento = await Pagamento.buscarPagamentoPorId(id);

    if (!pagamento) {
      return response.status(404).json({ erro: "Pagamento nao encontrado." });
    }

    return response.json(pagamento);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function criar(request, response) {
  try {
    const pagamento = normalizarPagamento(request.body);
    const erros = validarPagamento(pagamento);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const novoPagamento = await Pagamento.criarPagamento(pagamento);
    return response.status(201).json(novoPagamento);
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

    const pagamento = normalizarPagamento(request.body);
    const erros = validarPagamento(pagamento);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const pagamentoAtualizado = await Pagamento.atualizarPagamento(id, pagamento);

    if (!pagamentoAtualizado) {
      return response.status(404).json({ erro: "Pagamento nao encontrado." });
    }

    return response.json(pagamentoAtualizado);
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

    const removido = await Pagamento.removerPagamento(id);

    if (!removido) {
      return response.status(404).json({ erro: "Pagamento nao encontrado." });
    }

    return response.json({ mensagem: "Pagamento removido com sucesso." });
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
