const Cliente = require("../models/clienteModel");

function limparTexto(valor) {
  return String(valor || "").trim();
}

function somenteNumeros(valor) {
  return limparTexto(valor).replace(/\D/g, "");
}

function normalizarCliente(body) {
  return {
    nome: limparTexto(body.nome),
    cpf: somenteNumeros(body.cpf),
    telefone: limparTexto(body.telefone),
    endereco: limparTexto(body.endereco),
    cep: somenteNumeros(body.cep),
    estado: limparTexto(body.estado).toUpperCase()
  };
}

function validarCliente(cliente) {
  const erros = [];

  if (cliente.nome.length < 3) {
    erros.push("Nome deve ter pelo menos 3 caracteres.");
  }

  if (cliente.cpf.length !== 11) {
    erros.push("CPF deve conter 11 números.");
  }

  if (cliente.telefone.length < 8) {
    erros.push("Telefone deve ter pelo menos 8 caracteres.");
  }

  if (cliente.endereco.length < 5) {
    erros.push("Endereço deve ter pelo menos 5 caracteres.");
  }

  if (cliente.cep.length !== 8) {
    erros.push("CEP deve conter 8 números.");
  }

  if (!/^[A-Z]{2}$/.test(cliente.estado)) {
    erros.push("Estado deve conter exatamente 2 letras. Exemplo: SP.");
  }

  return erros;
}

function tratarErroMySQL(error, response) {
  if (error && error.code === "ER_DUP_ENTRY") {
    return response.status(409).json({
      erro: "Já existe um cliente cadastrado com este CPF."
    });
  }

  console.error(error);
  return response.status(500).json({
    erro: "Erro interno no servidor."
  });
}

async function listar(request, response) {
  try {
    const clientes = await Cliente.listarClientes();
    return response.json(clientes);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function buscarPorId(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID inválido." });
    }

    const cliente = await Cliente.buscarClientePorId(id);

    if (!cliente) {
      return response.status(404).json({ erro: "Cliente não encontrado." });
    }

    return response.json(cliente);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function criar(request, response) {
  try {
    const cliente = normalizarCliente(request.body);
    const erros = validarCliente(cliente);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const novoCliente = await Cliente.criarCliente(cliente);
    return response.status(201).json(novoCliente);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function atualizar(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID inválido." });
    }

    const cliente = normalizarCliente(request.body);
    const erros = validarCliente(cliente);

    if (erros.length > 0) {
      return response.status(400).json({ erro: erros.join(" ") });
    }

    const clienteAtualizado = await Cliente.atualizarCliente(id, cliente);

    if (!clienteAtualizado) {
      return response.status(404).json({ erro: "Cliente não encontrado." });
    }

    return response.json(clienteAtualizado);
  } catch (error) {
    return tratarErroMySQL(error, response);
  }
}

async function remover(request, response) {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ erro: "ID inválido." });
    }

    const removido = await Cliente.removerCliente(id);

    if (!removido) {
      return response.status(404).json({ erro: "Cliente não encontrado." });
    }

    return response.json({ mensagem: "Cliente removido com sucesso." });
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

