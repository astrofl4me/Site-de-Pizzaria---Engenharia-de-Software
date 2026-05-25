const express                = require("express");
const funcionariosController = require("../controllers/funcionariosController");

const router = express.Router();

router.get("/",      funcionariosController.listar);
router.get("/:id",   funcionariosController.buscarPorId);
router.post("/",     funcionariosController.criar);
router.put("/:id",   funcionariosController.atualizar);
router.delete("/:id", funcionariosController.remover);

module.exports = router;