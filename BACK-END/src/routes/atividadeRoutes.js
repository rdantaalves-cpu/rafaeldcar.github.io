// ROUTES: define caminhos e métodos HTTP e direciona para o controller.
const express = require("express");
const atividadeController = require("../controllers/atividadeController");
const exigirAutenticacao = require("../middleware/exigirAutenticacao");

const router = express.Router();

router.post("/", exigirAutenticacao, atividadeController.criarAtividade);
router.get("/", atividadeController.listarAtividades);

module.exports = router;
