const { randomUUID } = require("crypto");

const UNIDADES_VALIDAS = ["SENAI", "SESI"];

class Atividade {
  constructor({ titulo, descricao, disciplina, unidade, periodo }) {
    this.id = randomUUID(); // gerado no backend
    this.titulo = titulo.trim();
    this.descricao = descricao.trim();
    this.data_criacao = new Date().toISOString(); // gerada no backend
    this.disciplina = disciplina
      ? {
          nome_materia: String(disciplina.nome_materia).trim(),
          tipo_ensino: disciplina.tipo_ensino
            ? String(disciplina.tipo_ensino).trim()
            : null,
        }
      : null;

    // Campos opcionais que o site (front-end) já usa:
    this.unidade = unidade ? String(unidade).trim().toUpperCase() : null;
    this.periodo = periodo ? String(periodo).trim() : null;
  }

  // Recebe os dados brutos e devolve uma lista de erros (vazia = dados válidos).
  static validar(dados) {
    const erros = [];

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return ["O corpo da requisição deve ser um objeto JSON."];
    }

    if (typeof dados.titulo !== "string" || dados.titulo.trim() === "") {
      erros.push("O campo 'titulo' é obrigatório e não pode ficar vazio.");
    }

    if (typeof dados.descricao !== "string" || dados.descricao.trim() === "") {
      erros.push("O campo 'descricao' é obrigatório e não pode ficar vazio.");
    }

    // disciplina é opcional, mas se vier, precisa estar correta
    if (dados.disciplina !== undefined && dados.disciplina !== null) {
      const d = dados.disciplina;
      if (typeof d !== "object" || Array.isArray(d)) {
        erros.push("O campo 'disciplina' deve ser um objeto.");
      } else if (typeof d.nome_materia !== "string" || d.nome_materia.trim() === "") {
        erros.push("Em 'disciplina', o campo 'nome_materia' é obrigatório.");
      }
    }

    // unidade é opcional (o site usa SENAI ou SESI)
    if (dados.unidade !== undefined && dados.unidade !== null && dados.unidade !== "") {
      if (
        typeof dados.unidade !== "string" ||
        !UNIDADES_VALIDAS.includes(dados.unidade.trim().toUpperCase())
      ) {
        erros.push("O campo 'unidade' deve ser 'SENAI' ou 'SESI'.");
      }
    }

    if (dados.periodo !== undefined && dados.periodo !== null && typeof dados.periodo !== "string") {
      erros.push("O campo 'periodo' deve ser um texto.");
    }

    return erros;
  }
}

module.exports = Atividade;
