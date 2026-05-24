const express = require("express");
const pagamentoController = require("../controllers/pagamentoController");

const router = express.Router();

router.get("/", pagamentoController.listar);
router.get("/:id", pagamentoController.buscarPorId);
router.post("/", pagamentoController.criar);
router.put("/:id", pagamentoController.atualizar);
router.delete("/:id", pagamentoController.remover);

module.exports = router;
