require("dotenv").config();

const express = require("express");
const cors = require("cors");
const atividadeRoutes = require("./routes/atividadeRoutes");
const authRoutes = require("./routes/authRoutes");
const sequelize = require("./database");
require("./models/Atividade");

const app = express();
const PORT = process.env.PORT || 3000;
const origensPermitidas = new Set(
  (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean),
);

app.disable("x-powered-by");

app.use(cors({
  origin(origem, callback) {
    callback(null, !origem || origensPermitidas.has(origem));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 600,
}));

app.use((req, res, next) => {
  const origem = req.get("Origin");
  if (origem && !origensPermitidas.has(origem) && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return res.status(403).json({ erro: "Origem não autorizada." });
  }
  next();
});
app.use(express.json({ limit: "15mb" }));

app.use("/api/auth", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/atividades", atividadeRoutes);
app.use("/api/auth", authRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento de erros sem derrubar o servidor
app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro);
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição." });
  }
  if (erro.type === "entity.too.large") {
    return res.status(413).json({ erro: "O arquivo enviado excede o limite permitido." });
  }
  console.error("Erro na API:", erro);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível iniciar a API. Verifique a conexão e as configurações do MySQL.", erro);
    await sequelize.close();
    process.exitCode = 1;
  }
}

if (require.main === module) iniciarServidor();
module.exports = app;
