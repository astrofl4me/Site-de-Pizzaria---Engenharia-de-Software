const API_URL = "/api/clientes";
const PRODUTOS_API_URL = "/api/produtos";
const PAGAMENTOS_API_URL = "/api/pagamentos";
const PEDIDOS_API_URL = "/api/pedidos";

const form = document.getElementById("clienteForm");
const clienteIdInput = document.getElementById("clienteId");
const nomeInput = document.getElementById("nome");
const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const btnSalvar = document.getElementById("btnSalvar");
const btnLimpar = document.getElementById("btnLimpar");
const btnRecarregar = document.getElementById("btnRecarregar");
const tabela = document.getElementById("clientesTabela");
const alerta = document.getElementById("alerta");
const contadorClientes = document.getElementById("contadorClientes");
const formTitle = document.getElementById("formTitle");
const formHint = document.getElementById("formHint");
const topbar = document.querySelector(".topbar");
const btnTelaInicial = document.getElementById("btnTelaInicial");
const telas = document.querySelectorAll(".app-screen");
const botoesNavegacao = document.querySelectorAll("[data-screen-target]");
const produtoForm = document.getElementById("produtoForm");
const produtoIdInput = document.getElementById("produtoId");
const produtoNomeInput = document.getElementById("produtoNome");
const produtoCategoriaInput = document.getElementById("produtoCategoria");
const produtoPrecoInput = document.getElementById("produtoPreco");
const produtoDescricaoInput = document.getElementById("produtoDescricao");
const btnSalvarProduto = document.getElementById("btnSalvarProduto");
const btnLimparProduto = document.getElementById("btnLimparProduto");
const produtosTabela = document.getElementById("produtosTabela");
const produtoContador = document.getElementById("produtoContador");
const produtoAlerta = document.getElementById("produtoAlerta");
const listaSabores = document.getElementById("listaSabores");
const listaBebidas = document.getElementById("listaBebidas");
const listaSobremesas = document.getElementById("listaSobremesas");
const pagamentoForm = document.getElementById("pagamentoForm");
const pagamentoIdInput = document.getElementById("pagamentoId");
const pagamentoClienteInput = document.getElementById("pagamentoCliente");
const pagamentoValorInput = document.getElementById("pagamentoValor");
const pagamentoTipoInput = document.getElementById("pagamentoTipo");
const pagamentoTrocoInput = document.getElementById("pagamentoTroco");
const btnSalvarPagamento = document.getElementById("btnSalvarPagamento");
const btnLimparPagamento = document.getElementById("btnLimparPagamento");
const btnRecarregarPagamentos = document.getElementById("btnRecarregarPagamentos");
const pagamentosTabela = document.getElementById("pagamentosTabela");
const pagamentoContador = document.getElementById("pagamentoContador");
const pagamentoAlerta = document.getElementById("pagamentoAlerta");
const pedidoForm = document.getElementById("pedidoForm");
const pedidoIdInput = document.getElementById("pedidoId");
const pedidoItensInput = document.getElementById("pedidoItens");
const pedidoStatusInput = document.getElementById("pedidoStatus");
const pedidoValorInput = document.getElementById("pedidoValor");
const pedidoDataInput = document.getElementById("pedidoData");
const pedidoHorarioInput = document.getElementById("pedidoHorario");
const btnSalvarPedido = document.getElementById("btnSalvarPedido");
const btnLimparPedido = document.getElementById("btnLimparPedido");
const btnRecarregarPedidos = document.getElementById("btnRecarregarPedidos");
const pedidosTabela = document.getElementById("pedidosTabela");
const pedidoContador = document.getElementById("pedidoContador");
const pedidoAlerta = document.getElementById("pedidoAlerta");

let clientes = [];
let alertaTimer = null;
let clientesCarregados = false;
let produtoAlertaTimer = null;
let produtos = [];
let produtosCarregados = false;
let pagamentoAlertaTimer = null;
let pagamentos = [];
let pagamentosCarregados = false;
let pedidoAlertaTimer = null;
let pedidos = [];
let pedidosCarregados = false;

function apenasNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function formatarCPF(valor) {
  return apenasNumeros(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(valor) {
  const numeros = apenasNumeros(valor).slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function mostrarAlerta(mensagem, tipo = "success") {
  clearTimeout(alertaTimer);
  alerta.textContent = mensagem;
  alerta.className = `alert show ${tipo}`;

  alertaTimer = setTimeout(() => {
    alerta.className = "alert";
    alerta.textContent = "";
  }, 3600);
}

function escaparHTML(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarData(dataISO) {
  const partes = String(dataISO || "").slice(0, 10).split("-");

  if (partes.length !== 3) {
    return "-";
  }

  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
  return String(horario || "").slice(0, 5) || "-";
}

function mostrarAlertaProduto(mensagem, tipo = "success") {
  clearTimeout(produtoAlertaTimer);
  produtoAlerta.textContent = mensagem;
  produtoAlerta.className = `alert show ${tipo}`;

  produtoAlertaTimer = setTimeout(() => {
    produtoAlerta.className = "alert";
    produtoAlerta.textContent = "";
  }, 3000);
}

function mostrarAlertaPagamento(mensagem, tipo = "success") {
  clearTimeout(pagamentoAlertaTimer);
  pagamentoAlerta.textContent = mensagem;
  pagamentoAlerta.className = `alert show ${tipo}`;

  pagamentoAlertaTimer = setTimeout(() => {
    pagamentoAlerta.className = "alert";
    pagamentoAlerta.textContent = "";
  }, 3000);
}

function mostrarAlertaPedido(mensagem, tipo = "success") {
  clearTimeout(pedidoAlertaTimer);
  pedidoAlerta.textContent = mensagem;
  pedidoAlerta.className = `alert show ${tipo}`;

  pedidoAlertaTimer = setTimeout(() => {
    pedidoAlerta.className = "alert";
    pedidoAlerta.textContent = "";
  }, 3000);
}

function obterDadosFormulario() {
  return {
    nome: nomeInput.value.trim(),
    cpf: apenasNumeros(cpfInput.value),
    telefone: telefoneInput.value.trim(),
    email: emailInput.value.trim().toLowerCase()
  };
}

function validarFormulario(cliente) {
  if (cliente.nome.length < 3) {
    return "Informe um nome com pelo menos 3 caracteres.";
  }

  if (cliente.cpf.length !== 11) {
    return "Informe um CPF com 11 números.";
  }

  if (cliente.telefone.length < 8) {
    return "Informe um telefone válido.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
    return "Informe um email válido.";
  }

  return "";
}

function resetarFormulario() {
  form.reset();
  clienteIdInput.value = "";
  btnSalvar.textContent = "Inserir";
  formTitle.textContent = "Novo cliente";
  formHint.textContent = "";
  nomeInput.focus();
}

function preencherFormulario(cliente) {
  clienteIdInput.value = cliente.id;
  nomeInput.value = cliente.nome;
  cpfInput.value = formatarCPF(cliente.cpf);
  telefoneInput.value = formatarTelefone(cliente.telefone);
  emailInput.value = cliente.email;
  btnSalvar.textContent = "Atualizar";
  formTitle.textContent = "Editar cliente";
  formHint.textContent = `Alterando cadastro #${cliente.id}.`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  nomeInput.focus();
}

function renderizarTabela() {
  contadorClientes.textContent = `${clientes.length} cliente${clientes.length === 1 ? "" : "s"} cadastrado${clientes.length === 1 ? "" : "s"}`;

  if (clientes.length === 0) {
    tabela.innerHTML = '<tr><td colspan="6" class="empty">Nenhum cliente cadastrado ainda.</td></tr>';
    return;
  }

  tabela.innerHTML = clientes.map((cliente) => `
    <tr>
      <td>${cliente.id}</td>
      <td>${escaparHTML(cliente.nome)}</td>
      <td>${formatarCPF(cliente.cpf)}</td>
      <td>${escaparHTML(formatarTelefone(cliente.telefone))}</td>
      <td>${escaparHTML(cliente.email)}</td>
      <td>
        <div class="cell-actions">
          <button type="button" class="btn btn-edit" data-action="edit" data-id="${cliente.id}">Editar</button>
          <button type="button" class="btn btn-delete" data-action="delete" data-id="${cliente.id}">Remover</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function tratarResposta(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.erro || "Erro ao processar solicitação.");
  }

  return data;
}

async function carregarClientes() {
  try {
    contadorClientes.textContent = "Carregando clientes...";
    const response = await fetch(API_URL);
    clientes = await tratarResposta(response);
    clientesCarregados = true;
    renderizarTabela();
  } catch (error) {
    clientes = [];
    clientesCarregados = false;
    renderizarTabela();
    mostrarAlerta(error.message, "error");
  }
}

function mostrarTela(nomeTela) {
  const telaSelecionada = document.getElementById(`tela-${nomeTela}`);

  if (!telaSelecionada) {
    return;
  }

  telas.forEach((tela) => {
    tela.hidden = tela !== telaSelecionada;
  });

  topbar.hidden = nomeTela === "inicial";
  btnTelaInicial.hidden = nomeTela === "inicial";
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (nomeTela === "clientes" && !clientesCarregados) {
    carregarClientes();
  }

  if (nomeTela === "produtos" && !produtosCarregados) {
    carregarProdutos();
  }

  if (nomeTela === "pedidos" && !pedidosCarregados) {
    carregarPedidos();
  }

  if (nomeTela === "pagamento" && !pagamentosCarregados) {
    carregarPagamentos();
  }
}

function obterDadosProduto() {
  return {
    nome: produtoNomeInput.value.trim(),
    categoria: produtoCategoriaInput.value,
    preco: Number(produtoPrecoInput.value),
    descricao: produtoDescricaoInput.value.trim()
  };
}

function validarProduto(produto) {
  if (produto.nome.length < 2) {
    return "Informe o nome do produto.";
  }

  if (!produto.categoria) {
    return "Selecione a categoria.";
  }

  if (!Number.isFinite(produto.preco) || produto.preco <= 0) {
    return "Informe um preco valido.";
  }

  return "";
}

function resetarProdutoFormulario() {
  produtoForm.reset();
  produtoIdInput.value = "";
  btnSalvarProduto.textContent = "Inserir";
  produtoNomeInput.focus();
}

function renderizarListaCategoria(elemento, categoria) {
  const itens = produtos.filter((produto) => produto.categoria === categoria);

  if (itens.length === 0) {
    elemento.innerHTML = '<li class="empty-menu-item">Nada cadastrado</li>';
    return;
  }

  elemento.innerHTML = itens.map((produto) => `
    <li>
      <span>${escaparHTML(produto.nome)}</span>
      <strong>${formatarMoeda(produto.preco)}</strong>
    </li>
  `).join("");
}

function renderizarProdutos() {
  produtoContador.textContent = `${produtos.length} produto${produtos.length === 1 ? "" : "s"} cadastrado${produtos.length === 1 ? "" : "s"}`;

  renderizarListaCategoria(listaSabores, "Sabores");
  renderizarListaCategoria(listaBebidas, "Bebidas");
  renderizarListaCategoria(listaSobremesas, "Sobremesas");

  if (produtos.length === 0) {
    produtosTabela.innerHTML = '<tr><td colspan="6" class="empty">Nenhum produto cadastrado ainda.</td></tr>';
    return;
  }

  produtosTabela.innerHTML = produtos.map((produto) => `
    <tr>
      <td>${produto.id}</td>
      <td>${escaparHTML(produto.nome)}</td>
      <td>${escaparHTML(produto.categoria)}</td>
      <td>${formatarMoeda(produto.preco)}</td>
      <td>${escaparHTML(produto.descricao || "-")}</td>
      <td>
        <div class="cell-actions">
          <button type="button" class="btn btn-edit" data-produto-action="edit" data-id="${produto.id}">Editar</button>
          <button type="button" class="btn btn-delete" data-produto-action="delete" data-id="${produto.id}">Remover</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function carregarProdutos() {
  try {
    produtoContador.textContent = "Carregando produtos...";
    const response = await fetch(PRODUTOS_API_URL);
    produtos = await tratarResposta(response);
    produtosCarregados = true;
    renderizarProdutos();
  } catch (error) {
    produtos = [];
    produtosCarregados = false;
    renderizarProdutos();
    mostrarAlertaProduto(error.message, "error");
  }
}

function preencherProdutoFormulario(produto) {
  produtoIdInput.value = produto.id;
  produtoNomeInput.value = produto.nome;
  produtoCategoriaInput.value = produto.categoria;
  produtoPrecoInput.value = produto.preco;
  produtoDescricaoInput.value = produto.descricao;
  btnSalvarProduto.textContent = "Atualizar";
  produtoNomeInput.focus();
}

function definirDataHoraAtualPedido() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");

  pedidoDataInput.value = `${ano}-${mes}-${dia}`;
  pedidoHorarioInput.value = `${hora}:${minuto}`;
}

function obterDadosPedido() {
  return {
    itens: pedidoItensInput.value.trim(),
    status: pedidoStatusInput.value,
    valor: Number(pedidoValorInput.value),
    data: pedidoDataInput.value,
    horario: pedidoHorarioInput.value
  };
}

function validarPedido(pedido) {
  if (pedido.itens.length < 2) {
    return "Informe os itens do pedido.";
  }

  if (!pedido.status) {
    return "Selecione o status do pedido.";
  }

  if (!Number.isFinite(pedido.valor) || pedido.valor <= 0) {
    return "Informe um valor valido.";
  }

  if (!pedido.data) {
    return "Informe a data do pedido.";
  }

  if (!pedido.horario) {
    return "Informe o horario do pedido.";
  }

  return "";
}

function resetarPedidoFormulario() {
  pedidoForm.reset();
  pedidoIdInput.value = "";
  btnSalvarPedido.textContent = "Inserir";
  definirDataHoraAtualPedido();
  pedidoItensInput.focus();
}

function renderizarPedidos() {
  pedidoContador.textContent = `${pedidos.length} pedido${pedidos.length === 1 ? "" : "s"} cadastrado${pedidos.length === 1 ? "" : "s"}`;

  if (pedidos.length === 0) {
    pedidosTabela.innerHTML = '<tr><td colspan="7" class="empty">Nenhum pedido cadastrado ainda.</td></tr>';
    return;
  }

  pedidosTabela.innerHTML = pedidos.map((pedido) => `
    <tr>
      <td>${pedido.id}</td>
      <td>${escaparHTML(pedido.itens)}</td>
      <td>${escaparHTML(pedido.status)}</td>
      <td>${formatarMoeda(pedido.valor)}</td>
      <td>${formatarData(pedido.data)}</td>
      <td>${formatarHorario(pedido.horario)}</td>
      <td>
        <div class="cell-actions">
          <button type="button" class="btn btn-edit" data-pedido-action="edit" data-id="${pedido.id}">Editar</button>
          <button type="button" class="btn btn-delete" data-pedido-action="delete" data-id="${pedido.id}">Remover</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function carregarPedidos() {
  try {
    pedidoContador.textContent = "Carregando pedidos...";
    const response = await fetch(PEDIDOS_API_URL);
    pedidos = await tratarResposta(response);
    pedidosCarregados = true;
    renderizarPedidos();
  } catch (error) {
    pedidos = [];
    pedidosCarregados = false;
    renderizarPedidos();
    mostrarAlertaPedido(error.message, "error");
  }
}

function preencherPedidoFormulario(pedido) {
  pedidoIdInput.value = pedido.id;
  pedidoItensInput.value = pedido.itens;
  pedidoStatusInput.value = pedido.status;
  pedidoValorInput.value = pedido.valor;
  pedidoDataInput.value = pedido.data;
  pedidoHorarioInput.value = formatarHorario(pedido.horario);
  btnSalvarPedido.textContent = "Atualizar";
  pedidoItensInput.focus();
}

async function salvarPedido(event) {
  event.preventDefault();

  const pedido = obterDadosPedido();
  const erro = validarPedido(pedido);

  if (erro) {
    mostrarAlertaPedido(erro, "error");
    return;
  }

  const id = pedidoIdInput.value;
  const editando = Boolean(id);

  try {
    btnSalvarPedido.disabled = true;
    btnSalvarPedido.textContent = editando ? "Atualizando..." : "Inserindo...";

    const response = await fetch(editando ? `${PEDIDOS_API_URL}/${id}` : PEDIDOS_API_URL, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pedido)
    });

    await tratarResposta(response);
    await carregarPedidos();
    resetarPedidoFormulario();
    mostrarAlertaPedido(editando ? "Pedido atualizado com sucesso." : "Pedido cadastrado com sucesso.");
  } catch (error) {
    btnSalvarPedido.textContent = editando ? "Atualizar" : "Inserir";
    mostrarAlertaPedido(error.message, "error");
  } finally {
    btnSalvarPedido.disabled = false;
  }
}

async function removerPedido(id) {
  const pedido = pedidos.find((item) => Number(item.id) === Number(id));
  const itens = pedido ? pedido.itens : "este pedido";

  if (!confirm(`Deseja remover ${itens}?`)) {
    return;
  }

  try {
    const response = await fetch(`${PEDIDOS_API_URL}/${id}`, {
      method: "DELETE"
    });

    await tratarResposta(response);
    await carregarPedidos();
    resetarPedidoFormulario();
    mostrarAlertaPedido("Pedido removido com sucesso.");
  } catch (error) {
    mostrarAlertaPedido(error.message, "error");
  }
}

function normalizarTroco(tipo, troco) {
  if (tipo !== "Dinheiro") {
    return "Sem necessidade de troco";
  }

  const trocoLimpo = String(troco || "").trim();
  const valorTroco = Number(trocoLimpo.replace(",", "."));

  if (Number.isFinite(valorTroco) && valorTroco > 0) {
    return formatarMoeda(valorTroco);
  }

  return trocoLimpo;
}

function atualizarCampoTroco() {
  const pagamentoEmDinheiro = pagamentoTipoInput.value === "Dinheiro";
  pagamentoTrocoInput.disabled = !pagamentoEmDinheiro;

  if (!pagamentoEmDinheiro) {
    pagamentoTrocoInput.value = "Sem necessidade de troco";
  } else if (pagamentoTrocoInput.value === "Sem necessidade de troco") {
    pagamentoTrocoInput.value = "";
  }
}

function obterDadosPagamento() {
  return {
    nome_cliente: pagamentoClienteInput.value.trim(),
    valor_pagamento: Number(pagamentoValorInput.value),
    tipo_pagamento: pagamentoTipoInput.value,
    troco: normalizarTroco(pagamentoTipoInput.value, pagamentoTrocoInput.value)
  };
}

function validarPagamento(pagamento) {
  if (pagamento.nome_cliente.length < 3) {
    return "Informe o nome do cliente.";
  }

  if (!Number.isFinite(pagamento.valor_pagamento) || pagamento.valor_pagamento <= 0) {
    return "Informe um valor de pagamento valido.";
  }

  if (!pagamento.tipo_pagamento) {
    return "Selecione o tipo de pagamento.";
  }

  if (pagamento.tipo_pagamento === "Dinheiro" && pagamento.troco.length === 0) {
    return "Informe o troco ou escreva que nao precisa.";
  }

  return "";
}

function resetarPagamentoFormulario() {
  pagamentoForm.reset();
  pagamentoIdInput.value = "";
  btnSalvarPagamento.textContent = "Inserir";
  atualizarCampoTroco();
  pagamentoClienteInput.focus();
}

function renderizarPagamentos() {
  pagamentoContador.textContent = `${pagamentos.length} pagamento${pagamentos.length === 1 ? "" : "s"} cadastrado${pagamentos.length === 1 ? "" : "s"}`;

  if (pagamentos.length === 0) {
    pagamentosTabela.innerHTML = '<tr><td colspan="6" class="empty">Nenhum pagamento cadastrado ainda.</td></tr>';
    return;
  }

  pagamentosTabela.innerHTML = pagamentos.map((pagamento) => `
    <tr>
      <td>${pagamento.id}</td>
      <td>${escaparHTML(pagamento.nome_cliente)}</td>
      <td>${formatarMoeda(pagamento.valor_pagamento)}</td>
      <td>${escaparHTML(pagamento.tipo_pagamento)}</td>
      <td>${escaparHTML(pagamento.troco)}</td>
      <td>
        <div class="cell-actions">
          <button type="button" class="btn btn-edit" data-pagamento-action="edit" data-id="${pagamento.id}">Editar</button>
          <button type="button" class="btn btn-delete" data-pagamento-action="delete" data-id="${pagamento.id}">Remover</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function carregarPagamentos() {
  try {
    pagamentoContador.textContent = "Carregando pagamentos...";
    const response = await fetch(PAGAMENTOS_API_URL);
    pagamentos = await tratarResposta(response);
    pagamentosCarregados = true;
    renderizarPagamentos();
  } catch (error) {
    pagamentos = [];
    pagamentosCarregados = false;
    renderizarPagamentos();
    mostrarAlertaPagamento(error.message, "error");
  }
}

function preencherPagamentoFormulario(pagamento) {
  pagamentoIdInput.value = pagamento.id;
  pagamentoClienteInput.value = pagamento.nome_cliente;
  pagamentoValorInput.value = pagamento.valor_pagamento;
  pagamentoTipoInput.value = pagamento.tipo_pagamento;
  pagamentoTrocoInput.value = pagamento.troco.replace(/^R\$\s*/i, "");
  atualizarCampoTroco();
  btnSalvarPagamento.textContent = "Atualizar";
  pagamentoClienteInput.focus();
}

async function salvarProduto(event) {
  event.preventDefault();

  const produto = obterDadosProduto();
  const erro = validarProduto(produto);

  if (erro) {
    mostrarAlertaProduto(erro, "error");
    return;
  }

  const id = produtoIdInput.value;

  const editando = Boolean(id);

  try {
    btnSalvarProduto.disabled = true;
    btnSalvarProduto.textContent = editando ? "Atualizando..." : "Inserindo...";

    const response = await fetch(editando ? `${PRODUTOS_API_URL}/${id}` : PRODUTOS_API_URL, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(produto)
    });

    await tratarResposta(response);
    await carregarProdutos();
    resetarProdutoFormulario();
    mostrarAlertaProduto(editando ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
  } catch (error) {
    btnSalvarProduto.textContent = editando ? "Atualizar" : "Inserir";
    mostrarAlertaProduto(error.message, "error");
  } finally {
    btnSalvarProduto.disabled = false;
  }
}

async function removerProduto(id) {
  const produto = produtos.find((item) => Number(item.id) === Number(id));
  const nome = produto ? produto.nome : "este produto";

  if (!confirm(`Deseja remover ${nome}?`)) {
    return;
  }

  try {
    const response = await fetch(`${PRODUTOS_API_URL}/${id}`, {
      method: "DELETE"
    });

    await tratarResposta(response);
    await carregarProdutos();
    resetarProdutoFormulario();
    mostrarAlertaProduto("Produto removido com sucesso.");
  } catch (error) {
    mostrarAlertaProduto(error.message, "error");
  }
}

async function salvarPagamento(event) {
  event.preventDefault();

  const pagamento = obterDadosPagamento();
  const erro = validarPagamento(pagamento);

  if (erro) {
    mostrarAlertaPagamento(erro, "error");
    return;
  }

  const id = pagamentoIdInput.value;
  const editando = Boolean(id);

  try {
    btnSalvarPagamento.disabled = true;
    btnSalvarPagamento.textContent = editando ? "Atualizando..." : "Inserindo...";

    const response = await fetch(editando ? `${PAGAMENTOS_API_URL}/${id}` : PAGAMENTOS_API_URL, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pagamento)
    });

    await tratarResposta(response);
    await carregarPagamentos();
    resetarPagamentoFormulario();
    mostrarAlertaPagamento(editando ? "Pagamento atualizado com sucesso." : "Pagamento cadastrado com sucesso.");
  } catch (error) {
    btnSalvarPagamento.textContent = editando ? "Atualizar" : "Inserir";
    mostrarAlertaPagamento(error.message, "error");
  } finally {
    btnSalvarPagamento.disabled = false;
  }
}

async function removerPagamento(id) {
  const pagamento = pagamentos.find((item) => Number(item.id) === Number(id));
  const nome = pagamento ? pagamento.nome_cliente : "este pagamento";

  if (!confirm(`Deseja remover ${nome}?`)) {
    return;
  }

  try {
    const response = await fetch(`${PAGAMENTOS_API_URL}/${id}`, {
      method: "DELETE"
    });

    await tratarResposta(response);
    await carregarPagamentos();
    resetarPagamentoFormulario();
    mostrarAlertaPagamento("Pagamento removido com sucesso.");
  } catch (error) {
    mostrarAlertaPagamento(error.message, "error");
  }
}

async function salvarCliente(event) {
  event.preventDefault();

  const cliente = obterDadosFormulario();
  const erro = validarFormulario(cliente);

  if (erro) {
    mostrarAlerta(erro, "error");
    return;
  }

  const id = clienteIdInput.value;
  const editando = Boolean(id);

  try {
    btnSalvar.disabled = true;
    btnSalvar.textContent = editando ? "Atualizando..." : "Inserindo...";

    const response = await fetch(editando ? `${API_URL}/${id}` : API_URL, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    });

    await tratarResposta(response);
    await carregarClientes();
    resetarFormulario();
    mostrarAlerta(editando ? "Cliente atualizado com sucesso." : "Cliente inserido com sucesso.");
  } catch (error) {
    btnSalvar.textContent = editando ? "Atualizar" : "Inserir";
    mostrarAlerta(error.message, "error");
  } finally {
    btnSalvar.disabled = false;
  }
}

async function removerCliente(id) {
  const cliente = clientes.find((item) => Number(item.id) === Number(id));
  const nome = cliente ? cliente.nome : "este cliente";

  if (!confirm(`Deseja remover ${nome}?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    await tratarResposta(response);
    await carregarClientes();

    if (clienteIdInput.value === String(id)) {
      resetarFormulario();
    }

    mostrarAlerta("Cliente removido com sucesso.");
  } catch (error) {
    mostrarAlerta(error.message, "error");
  }
}

form.addEventListener("submit", salvarCliente);

btnLimpar.addEventListener("click", resetarFormulario);

btnRecarregar.addEventListener("click", () => {
  carregarClientes();
  mostrarAlerta("Tabela atualizada.");
});

btnTelaInicial.addEventListener("click", () => {
  mostrarTela("inicial");
});

botoesNavegacao.forEach((botao) => {
  botao.addEventListener("click", () => {
    mostrarTela(botao.dataset.screenTarget);
  });
});

tabela.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-action]");

  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const cliente = clientes.find((item) => Number(item.id) === id);

  if (botao.dataset.action === "edit" && cliente) {
    preencherFormulario(cliente);
  }

  if (botao.dataset.action === "delete") {
    removerCliente(id);
  }
});

produtoForm.addEventListener("submit", salvarProduto);

btnLimparProduto.addEventListener("click", resetarProdutoFormulario);

produtosTabela.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-produto-action]");

  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const produto = produtos.find((item) => Number(item.id) === id);

  if (botao.dataset.produtoAction === "edit" && produto) {
    preencherProdutoFormulario(produto);
  }

  if (botao.dataset.produtoAction === "delete") {
    removerProduto(id);
  }
});

pedidoForm.addEventListener("submit", salvarPedido);

btnLimparPedido.addEventListener("click", resetarPedidoFormulario);

btnRecarregarPedidos.addEventListener("click", () => {
  carregarPedidos();
  mostrarAlertaPedido("Tabela atualizada.");
});

pedidosTabela.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-pedido-action]");

  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const pedido = pedidos.find((item) => Number(item.id) === id);

  if (botao.dataset.pedidoAction === "edit" && pedido) {
    preencherPedidoFormulario(pedido);
  }

  if (botao.dataset.pedidoAction === "delete") {
    removerPedido(id);
  }
});

pagamentoForm.addEventListener("submit", salvarPagamento);

btnLimparPagamento.addEventListener("click", resetarPagamentoFormulario);

btnRecarregarPagamentos.addEventListener("click", () => {
  carregarPagamentos();
  mostrarAlertaPagamento("Tabela atualizada.");
});

pagamentoTipoInput.addEventListener("change", atualizarCampoTroco);

pagamentosTabela.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-pagamento-action]");

  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const pagamento = pagamentos.find((item) => Number(item.id) === id);

  if (botao.dataset.pagamentoAction === "edit" && pagamento) {
    preencherPagamentoFormulario(pagamento);
  }

  if (botao.dataset.pagamentoAction === "delete") {
    removerPagamento(id);
  }
});

cpfInput.addEventListener("input", () => {
  cpfInput.value = formatarCPF(cpfInput.value);
});

telefoneInput.addEventListener("input", () => {
  telefoneInput.value = formatarTelefone(telefoneInput.value);
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarTela("inicial");
  renderizarProdutos();
  renderizarPedidos();
  definirDataHoraAtualPedido();
  atualizarCampoTroco();
});
