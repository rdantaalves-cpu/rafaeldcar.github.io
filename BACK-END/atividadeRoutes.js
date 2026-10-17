// ROUTES: define caminhos e métodos HTTP e direciona para o controller.
const express = require("express");
const atividadeController = require("../controllers/atividadeController");

const router = express.Router();

router.post("/", atividadeController.criarAtividade);
router.get("/", atividadeController.listarAtividades);

module.exports = router;
