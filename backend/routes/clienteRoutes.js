const express = require("express");
const clienteController = require("../controllers/clienteController");

const router = express.Router();

router.get("/", clienteController.listar);
router.get("/:id", clienteController.buscarPorId);
router.post("/", clienteController.criar);
router.put("/:id", clienteController.atualizar);
router.delete("/:id", clienteController.remover);

module.exports = router;

