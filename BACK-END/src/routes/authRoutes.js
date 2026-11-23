const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");

const router = express.Router();
const limitarTentativas = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Aguarde 15 minutos e tente novamente." },
});

router.post("/login", limitarTentativas, authController.login);
router.get("/session", authController.consultarSessao);
router.post("/logout", authController.logout);

module.exports = router;