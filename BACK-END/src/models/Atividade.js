const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

const TAMANHO_MAXIMO_ARQUIVO = 5 * 1024 * 1024;
const TIPOS_IMAGEM_VALIDOS = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

function validarDataUrl(valor, tiposValidos) {
  if (typeof valor !== "string") return false;
  const correspondencia = valor.match(/^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,([a-z0-9+/]*={0,2})$/i);
  if (!correspondencia || !tiposValidos.has(correspondencia[1].toLowerCase())) return false;

  const conteudo = correspondencia[2];
  if (conteudo.length % 4 !== 0) return false;
  const tamanho = Math.floor((conteudo.length * 3) / 4) - (conteudo.endsWith("==") ? 2 : conteudo.endsWith("=") ? 1 : 0);
  return tamanho > 0 && tamanho <= TAMANHO_MAXIMO_ARQUIVO;
}

class Atividade extends Model {
  static validar(dados) {
    const erros = [];

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return ["O corpo da requisição deve ser um objeto JSON."];
    }

    if (typeof dados.titulo !== "string" || !dados.titulo.trim()) {
      erros.push("O campo 'titulo' é obrigatório e não pode ficar vazio.");
    } else if (dados.titulo.trim().length > 140) {
      erros.push("O campo 'titulo' deve ter no máximo 140 caracteres.");
    }

    if (typeof dados.descricao !== "string" || !dados.descricao.trim()) {
      erros.push("O campo 'descricao' é obrigatório e não pode ficar vazio.");
    } else if (dados.descricao.trim().length > 3000) {
      erros.push("O campo 'descricao' deve ter no máximo 3000 caracteres.");
    }

    if (dados.disciplina !== undefined && dados.disciplina !== null) {
      const disciplina = dados.disciplina;
      if (typeof disciplina !== "object" || Array.isArray(disciplina)) {
        erros.push("O campo 'disciplina' deve ser um objeto.");
      } else if (typeof disciplina.nome_materia !== "string" || !disciplina.nome_materia.trim()) {
        erros.push("Em 'disciplina', o campo 'nome_materia' é obrigatório.");
      } else if (disciplina.nome_materia.trim().length > 120) {
        erros.push("O nome da disciplina deve ter no máximo 120 caracteres.");
      }

      if (
        disciplina && disciplina.tipo_ensino !== undefined
        && disciplina.tipo_ensino !== null
        && (typeof disciplina.tipo_ensino !== "string" || disciplina.tipo_ensino.trim().length > 80)
      ) {
        erros.push("O campo 'tipo_ensino' deve ser um texto de até 80 caracteres.");
      }
    }

    if (dados.unidade !== undefined && dados.unidade !== null && dados.unidade !== "") {
      if (typeof dados.unidade !== "string" || !["SENAI", "SESI"].includes(dados.unidade.trim().toUpperCase())) {
        erros.push("O campo 'unidade' deve ser 'SENAI' ou 'SESI'.");
      }
    }

    if (
      dados.periodo !== undefined && dados.periodo !== null
      && (typeof dados.periodo !== "string" || dados.periodo.trim().length > 60)
    ) {
      erros.push("O campo 'periodo' deve ser um texto de até 60 caracteres.");
    }

    if (dados.imagem !== undefined && dados.imagem !== null && !validarDataUrl(dados.imagem, TIPOS_IMAGEM_VALIDOS)) {
      erros.push("A imagem deve ser PNG, JPEG, GIF ou WebP, em base64 e ter no máximo 5 MB.");
    }

    if (
      dados.pdf !== undefined && dados.pdf !== null
      && !validarDataUrl(dados.pdf, new Set(["application/pdf"]))
    ) {
      erros.push("O arquivo deve ser um PDF em base64 e ter no máximo 5 MB.");
    }

    return erros;
  }

  toJSON() {
    const valores = this.get();
    return {
      id: valores.id,
      titulo: valores.titulo,
      descricao: valores.descricao,
      data_criacao: valores.data_criacao.toISOString(),
      disciplina: valores.disciplina_nome
        ? {
            nome_materia: valores.disciplina_nome,
            tipo_ensino: valores.disciplina_tipo_ensino,
          }
        : null,
      unidade: valores.unidade,
      periodo: valores.periodo,
      imagem: valores.imagem,
      pdf: valores.pdf,
    };
  }
}

Atividade.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    disciplina_nome: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    disciplina_tipo_ensino: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    unidade: {
      type: DataTypes.ENUM("SENAI", "SESI"),
      allowNull: true,
    },
    periodo: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    imagem: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    pdf: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Atividade",
    tableName: "atividades",
    timestamps: false,
    indexes: [{ fields: ["data_criacao"] }],
  },
);

module.exports = Atividade;
