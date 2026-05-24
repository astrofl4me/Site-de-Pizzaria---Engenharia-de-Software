const express = require("express");
const pedidoController = require("../controllers/pedidoController");

const router = express.Router();

router.get("/", pedidoController.listar);
router.get("/:id", pedidoController.buscarPorId);
router.post("/", pedidoController.criar);
router.put("/:id", pedidoController.atualizar);
router.delete("/:id", pedidoController.remover);

module.exports = router;
