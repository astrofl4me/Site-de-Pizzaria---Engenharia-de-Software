const API_URL = "/api/clientes";

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

let clientes = [];
let alertaTimer = null;
let clientesCarregados = false;

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
});
