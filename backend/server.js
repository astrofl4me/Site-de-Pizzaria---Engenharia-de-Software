const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clienteRoutes = require("./routes/clienteRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const { testConnection } = require("./db");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const frontendPath = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendPath));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", projeto: "Surunga Slice" });
});

app.use("/api/clientes", clienteRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pagamentos", pagamentoRoutes);

app.use((request, response) => {
  response.status(404).json({ erro: "Rota não encontrada." });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ erro: "Erro interno no servidor." });
});

async function iniciarServidor() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar no MySQL.");
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();
