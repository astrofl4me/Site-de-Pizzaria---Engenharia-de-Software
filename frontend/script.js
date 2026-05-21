const API_URL = "/api/clientes";
const PRODUTOS_API_URL = "/api/produtos";

const form = document.getElementById("clienteForm");
const clienteIdInput = document.getElementById("clienteId");
const nomeInput = document.getElementById("nome");
const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");
const enderecoInput = document.getElementById("endereco");
const cepInput = document.getElementById("cep");
const estadoInput = document.getElementById("estado");
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

let clientes = [];
let alertaTimer = null;
let clientesCarregados = false;
let produtoAlertaTimer = null;
let produtos = [];
let produtosCarregados = false;

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

function formatarCEP(valor) {
  return apenasNumeros(valor)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
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

function mostrarAlertaProduto(mensagem, tipo = "success") {
  clearTimeout(produtoAlertaTimer);
  produtoAlerta.textContent = mensagem;
  produtoAlerta.className = `alert show ${tipo}`;

  produtoAlertaTimer = setTimeout(() => {
    produtoAlerta.className = "alert";
    produtoAlerta.textContent = "";
  }, 3000);
}

function obterDadosFormulario() {
  return {
    nome: nomeInput.value.trim(),
    cpf: apenasNumeros(cpfInput.value),
    telefone: telefoneInput.value.trim(),
    endereco: enderecoInput.value.trim(),
    cep: apenasNumeros(cepInput.value),
    estado: estadoInput.value.trim().toUpperCase()
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

  if (cliente.endereco.length < 5) {
    return "Informe um endereço válido.";
  }

  if (cliente.cep.length !== 8) {
    return "Informe um CEP com 8 números.";
  }

  if (!/^[A-Z]{2}$/.test(cliente.estado)) {
    return "Selecione um estado.";
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
  enderecoInput.value = cliente.endereco;
  cepInput.value = formatarCEP(cliente.cep);
  estadoInput.value = cliente.estado;
  btnSalvar.textContent = "Atualizar";
  formTitle.textContent = "Editar cliente";
  formHint.textContent = `Alterando cadastro #${cliente.id}.`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  nomeInput.focus();
}

function renderizarTabela() {
  contadorClientes.textContent = `${clientes.length} cliente${clientes.length === 1 ? "" : "s"} cadastrado${clientes.length === 1 ? "" : "s"}`;

  if (clientes.length === 0) {
    tabela.innerHTML = '<tr><td colspan="8" class="empty">Nenhum cliente cadastrado ainda.</td></tr>';
    return;
  }

  tabela.innerHTML = clientes.map((cliente) => `
    <tr>
      <td>${cliente.id}</td>
      <td>${escaparHTML(cliente.nome)}</td>
      <td>${formatarCPF(cliente.cpf)}</td>
      <td>${escaparHTML(formatarTelefone(cliente.telefone))}</td>
      <td>${escaparHTML(cliente.endereco)}</td>
      <td>${formatarCEP(cliente.cep)}</td>
      <td>${escaparHTML(cliente.estado)}</td>
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

cpfInput.addEventListener("input", () => {
  cpfInput.value = formatarCPF(cpfInput.value);
});

telefoneInput.addEventListener("input", () => {
  telefoneInput.value = formatarTelefone(telefoneInput.value);
});

cepInput.addEventListener("input", () => {
  cepInput.value = formatarCEP(cepInput.value);
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarTela("inicial");
  renderizarProdutos();
});
