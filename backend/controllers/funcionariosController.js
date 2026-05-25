const Funcionarios = require("../models/funcionariosModel");

const NIVEIS_VALIDOS = ["Junior", "Pleno", "Senior", "Gerente"];

function normalizarCargo(body) {
  return {
    nome_cargo:    String(body.nome_cargo    || "").trim(),
    nivel_cargo:   String(body.nivel_cargo   || "").trim(),
    salario:       Number(body.salario),
    carga_horaria: Number(body.carga_horaria),
  };
}

function validarCargo(cargo) {
  const erros = [];
  if (cargo.nome_cargo.length < 3)
    erros.push("Nome do cargo deve ter pelo menos 3 caracteres.");
  if (!NIVEIS_VALIDOS.includes(cargo.nivel_cargo))
    erros.push(`Nível inválido. Use: ${NIVEIS_VALIDOS.join(", ")}.`);
  if (isNaN(cargo.salario) || cargo.salario <= 0)
    erros.push("Salário deve ser um número maior que zero.");
  if (isNaN(cargo.carga_horaria) || cargo.carga_horaria < 1 || cargo.carga_horaria > 48)
    erros.push("Carga horária deve estar entre 1 e 48 horas semanais (CLT).");
  return erros;
}

function tratarErro(error, response) {
  console.error(error);
  return response.status(500).json({ erro: "Erro interno no servidor." });
}

async function listar(request, response) {
  try {
    const cargos = await Funcionarios.listarCargos();
    return response.json(cargos);
  } catch (error) { return tratarErro(error, response); }
}

async function buscarPorId(request, response) {
  try {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return response.status(400).json({ erro: "ID inválido." });
    const cargo = await Funcionarios.buscarCargoPorId(id);
    if (!cargo)
      return response.status(404).json({ erro: "Cargo não encontrado." });
    return response.json(cargo);
  } catch (error) { return tratarErro(error, response); }
}

async function criar(request, response) {
  try {
    const cargo = normalizarCargo(request.body);
    const erros = validarCargo(cargo);
    if (erros.length > 0)
      return response.status(400).json({ erro: erros.join(" ") });
    const novoCargo = await Funcionarios.criarCargo(cargo);
    return response.status(201).json(novoCargo);
  } catch (error) { return tratarErro(error, response); }
}

async function atualizar(request, response) {
  try {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return response.status(400).json({ erro: "ID inválido." });
    const cargo = normalizarCargo(request.body);
    const erros = validarCargo(cargo);
    if (erros.length > 0)
      return response.status(400).json({ erro: erros.join(" ") });
    const atualizado = await Funcionarios.atualizarCargo(id, cargo);
    if (!atualizado)
      return response.status(404).json({ erro: "Cargo não encontrado." });
    return response.json(atualizado);
  } catch (error) { return tratarErro(error, response); }
}

async function remover(request, response) {
  try {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return response.status(400).json({ erro: "ID inválido." });
    const removido = await Funcionarios.removerCargo(id);
    if (!removido)
      return response.status(404).json({ erro: "Cargo não encontrado." });
    return response.json({ mensagem: "Cargo removido com sucesso." });
  } catch (error) { return tratarErro(error, response); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };