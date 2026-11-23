const Atividade = require("../models/Atividade");

// POST /api/atividades
async function criarAtividade(req, res, next) {
  try {
    const erros = Atividade.validar(req.body);

    if (erros.length > 0) {
      return res.status(400).json({ erro: "Dados inválidos.", detalhes: erros });
    }

    const novaAtividade = await Atividade.create({
      titulo: req.body.titulo.trim(),
      descricao: req.body.descricao.trim(),
      disciplina_nome: req.body.disciplina?.nome_materia?.trim() || null,
      disciplina_tipo_ensino: req.body.disciplina?.tipo_ensino?.trim() || null,
      unidade: req.body.unidade ? req.body.unidade.trim().toUpperCase() : null,
      periodo: req.body.periodo?.trim() || null,
      imagem: req.body.imagem || null,
      pdf: req.body.pdf || null,
    });

    return res.status(201).json(novaAtividade);
  } catch (erro) {
    return next(erro);
  }
}

// GET /api/atividades
async function listarAtividades(req, res, next) {
  try {
    const atividades = await Atividade.findAll({ order: [["data_criacao", "DESC"]] });
    return res.status(200).json(atividades);
  } catch (erro) {
    return next(erro);
  }
}

module.exports = { criarAtividade, listarAtividades };
