const express = require("express");
const produtoController = require("../controllers/produtoController");

const router = express.Router();

router.get("/", produtoController.listar);
router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.delete("/:id", produtoController.remover);

module.exports = router;
