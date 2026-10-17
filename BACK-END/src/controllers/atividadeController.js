const Atividade = require("../models/Atividade");

// Lista em memória: os dados SÃO PERDIDOS quando o servidor reinicia.
const atividades = [];

// POST /api/atividades
function criarAtividade(req, res) {
  try {
    const erros = Atividade.validar(req.body);

    if (erros.length > 0) {
      return res.status(400).json({ erro: "Dados inválidos.", detalhes: erros });
    }

    const novaAtividade = new Atividade(req.body);
    atividades.push(novaAtividade);

    return res.status(201).json(novaAtividade);
  } catch (erro) {
    console.error("Erro ao criar atividade:", erro.message);
    return res.status(500).json({ erro: "Erro interno ao criar a atividade." });
  }
}

// GET /api/atividades
function listarAtividades(req, res) {
  return res.status(200).json(atividades); // [] se ainda não houver nenhuma
}

module.exports = { criarAtividade, listarAtividades };
