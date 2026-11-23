const { obterEmailDaSessao } = require("../controllers/authController");

function exigirAutenticacao(req, res, next) {
  const email = obterEmailDaSessao(req);
  if (!email) {
    return res.status(401).json({ erro: "Entre na sua conta para cadastrar atividades." });
  }

  req.usuario = { email };
  return next();
}

module.exports = exigirAutenticacao;