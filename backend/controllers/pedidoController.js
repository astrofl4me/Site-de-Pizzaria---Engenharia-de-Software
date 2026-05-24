const Pedido = require("../models/pedidoModel");

const STATUS_PEDIDO = ["Recebido", "Em preparo", "Saiu para entrega", "Entregue", "Cancelado"];

function limparTexto(valor) {
  return String(valor || "").trim();
}

function normalizarPedido(body) {
  return {
    itens: limparTexto(body.itens),
    status: limparTexto(body.status),
    valor: Number(body.valor),
    data: limparTexto(body.data),
    horario: limparTexto(body.horario)
  };
}

function dataValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));

  return data.getUTCFullYear() === ano
    && data.getUTCMonth() === mes - 1
    && data.getUTCDate() === dia;
}

function validarPedido(pedido) {
  const erros = [];

  if (pedido.itens.length < 2) {
    erros.push("Itens devem ter pelo menos 2 caracteres.");
  }

  if (!STATUS_PEDIDO.includes(pedido.status)) {
    erros.push("Status invalido.");
  }

  if (!Number.isFinite(pedido.valor) || pedido.valor <= 0) {
    erros.push("Valor deve ser maior que zero.");
  }

  if (!dataValida(pedido.data)) {
    erros.push("Data invalida.");
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(pedido.horario)) {
    erros.push("Horario invalido.");
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
    const pedidos = await Pedido.listarPedidos();
    return response.json(pedidos);
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

    const pedido = await Pedido.buscarPedidoPorId(id);

    if (!pedido) {
      return response.status(404).json({ erro: "Pedido nao encontrado." });
    }

    return response.json(pedido);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function criar(request, response) {
  try {
    const pedido = normalizarPedido(request.body);
    const erros = validarPedido(pedido);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const novoPedido = await Pedido.criarPedido(pedido);
    return response.status(201).json(novoPedido);
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

    const pedido = normalizarPedido(request.body);
    const erros = validarPedido(pedido);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const pedidoAtualizado = await Pedido.atualizarPedido(id, pedido);

    if (!pedidoAtualizado) {
      return response.status(404).json({ erro: "Pedido nao encontrado." });
    }

    return response.json(pedidoAtualizado);
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

    const removido = await Pedido.removerPedido(id);

    if (!removido) {
      return response.status(404).json({ erro: "Pedido nao encontrado." });
    }

    return response.json({ mensagem: "Pedido removido com sucesso." });
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
