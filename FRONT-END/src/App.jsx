import { useState } from "react";
import { portfolioModel } from "./data/portfolioData";

const menuLinks = [
  { texto: "Início", destino: "#inicio" },
  { texto: "Unidades", destino: "#unidades" },
  { texto: "Atividades", destino: "#atividades" },
  { texto: "Admin", destino: "#admin" },
];

const formInicial = {
  titulo: "",
  unidade: "SENAI",
  periodo: "",
  descricao: "",
  imagem: "",
  pdf: "",
  imagemNome: "",
  pdfNome: "",
};

function BarraNavegacao() {
  return (
    <nav aria-label="Navegação principal" className="barra-navegacao">
      <a className="marca" href="#inicio" aria-label="Voltar ao início">
        Rafael Alves
      </a>
      <ul>
        {menuLinks.map((link) => (
          <li key={link.destino}>
            <a href={link.destino}>{link.texto}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Apresentacao() {
  const imagemApresentacao = new URL("./assets/img/projeto 2.jpeg", import.meta.url).href;

  return (
    <section className="apresentacao" id="inicio">
      <div className="apresentacao-texto">
        <p className="apresentacao-introducao">Portfolio do ano letivo</p>
        <h1>
          Experiências, 
          <span>aprendizado</span>
          <br />
          e evolução em tecnologia.
        </h1>
        <p className="apresentacao-descricao">
          Este espaço reúne as atividades desenvolvidas no percurso escolar, destacando
          os aprendizados do SENAI e do SESI em um ambiente profissional, organizado e
          visualmente moderno.
        </p>
        <div className="apresentacao-links">
          <a className="link-destaque" href="#atividades">
            Ver atividades
          </a>
          <a className="link-secundario" href="#admin">
            Área do administrador
          </a>
        </div>
      </div>

      <figure className="apresentacao-imagem">
        <img
          src={imagemApresentacao}
          alt="Estudante em ambiente de tecnologia com foco em desenvolvimento e aprendizado"
        />
      </figure>
    </section>
  );
}

function UnidadeCard({ unidade }) {
  return (
    <article className={`unidade unidade-${unidade.cor}`}>
      <div className="unidade-topo">
        <span className="badge">{unidade.nome}</span>
        <span className="mini-tag">{unidade.tipo}</span>
      </div>
      <h3>{unidade.nome}</h3>
      <p>{unidade.descricao}</p>
      <strong>{unidade.destaque}</strong>
    </article>
  );
}

function AtividadeCard({ atividade }) {
  return (
    <article className="atividade-card">
      <img src={atividade.imagem} alt={atividade.titulo} />
      <div className="atividade-conteudo">
        <div className="atividade-cabecalho">
          <span className="badge badge-light">{atividade.unidade}</span>
          <span className="periodo">{atividade.periodo}</span>
        </div>
        <h3>{atividade.titulo}</h3>
        <p>{atividade.descricao}</p>
        {atividade.pdf ? (
          <a href={atividade.pdf} target="_blank" rel="noreferrer" className="pdf-link">
            Ver PDF
          </a>
        ) : (
          <span className="pdf-link mute">Sem arquivo em PDF</span>
        )}
      </div>
    </article>
  );
}

function AdminController({ atividades, setAtividades }) {
  const [form, setForm] = useState(formInicial);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }));
  }

  function atualizarArquivo(evento) {
    const { name, files } = evento.target;
    const arquivo = files?.[0];

    if (!arquivo) {
      setForm((estadoAnterior) => ({
        ...estadoAnterior,
        [name]: "",
        [`${name}Nome`]: "",
      }));
      return;
    }

    const url = URL.createObjectURL(arquivo);

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: url,
      [`${name}Nome`]: arquivo.name,
    }));
  }

  function enviarFormulario(evento) {
    evento.preventDefault();

    const tituloLimpo = form.titulo.trim();
    const descricaoLimpa = form.descricao.trim();

    if (!tituloLimpo || !descricaoLimpa) {
      return;
    }

    const novaAtividade = {
      id: Date.now(),
      titulo: tituloLimpo,
      unidade: form.unidade,
      periodo: form.periodo || "Período não informado",
      descricao: descricaoLimpa,
      imagem: form.imagem || new URL("./assets/img/projeto 1.jpeg", import.meta.url).href,
      pdf: form.pdf || "",
    };

    setAtividades((estadoAnterior) => [novaAtividade, ...estadoAnterior]);
    setForm(formInicial);
  }

  return (
    <section className="admin-panel" id="admin">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Painel administrativo</p>
          <h2>Adicionar atividade</h2>
        </div>
        <span className="status-pill">{atividades.length} registros</span>
      </div>

      <div className="admin-layout">
        <form onSubmit={enviarFormulario} className="form-admin">
          <label>
            Título da atividade
            <input
              type="text"
              name="titulo"
              placeholder="Ex.: Feira de Ciências"
              value={form.titulo}
              onChange={atualizarCampo}
            />
          </label>

          <div className="form-dupla">
            <label>
              Unidade
              <select name="unidade" value={form.unidade} onChange={atualizarCampo}>
                <option value="SENAI">SENAI</option>
                <option value="SESI">SESI</option>
              </select>
            </label>

            <label>
              Período
              <input
                type="text"
                name="periodo"
                placeholder="Ex.: Agosto / 2026"
                value={form.periodo}
                onChange={atualizarCampo}
              />
            </label>
          </div>

          <label>
            Descrição
            <textarea
              name="descricao"
              rows="5"
              placeholder="Descreva o que foi realizado, os objetivos e os resultados."
              value={form.descricao}
              onChange={atualizarCampo}
            />
          </label>

          <div className="form-dupla">
            <label>
              Imagem da atividade
              <input
                type="file"
                name="imagem"
                accept="image/*"
                onChange={atualizarArquivo}
              />
              {form.imagemNome ? <span className="arquivo-nome">{form.imagemNome}</span> : null}
            </label>

            <label>
              PDF do material
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={atualizarArquivo}
              />
              {form.pdfNome ? <span className="arquivo-nome">{form.pdfNome}</span> : null}
            </label>
          </div>

          <button type="submit" className="botao-submit">
            Salvar atividade
          </button>
        </form>

        <div className="preview-admin">
          <h3>Pré-visualização</h3>
          <div className="preview-card">
            <img src={form.imagem || new URL("./assets/img/projeto 3.jpeg", import.meta.url).href} alt="Prévia da atividade" />
            <div className="preview-card-body">
              <span className="badge badge-light">{form.unidade}</span>
              <h4>{form.titulo || "Título da atividade"}</h4>
              <p>{form.descricao || "Descrição da atividade será exibida aqui."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer>
      <div className="rodape-conteudo">
        <div>
          <p className="rodape-etiqueta">Portfolio escolar · 2026</p>
          <h2>Registro de um ano dedicado ao aprendizado.</h2>
        </div>

        <div className="rodape-identificacao">
          <p className="rodape-nome">Rafael Alves</p>
          <p className="rodape-curso">Técnico em Tecnologia da Informação</p>
          <nav aria-label="Navegação do rodapé" className="rodape-navegacao">
            {menuLinks.slice(1).map((link) => (
              <a href={link.destino} key={link.destino}>
                {link.texto}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function Aplicativo() {
  const [atividades, setAtividades] = useState(portfolioModel.atividades);

  return (
    <>
      <header className="cabecalho-principal">
        <BarraNavegacao />
        <Apresentacao />
      </header>

      <main className="conteudo-principal">
        <section className="sobre" id="sobre">
          <div className="secao-titulo">
            <p className="panel-kicker">Sobre o percurso</p>
            <h2>Uma formação pensada para o futuro.</h2>
          </div>
          <p>
            Ao longo do ano letivo, desenvolvi atividades que conectam teoria, prática e
            criatividade. O aprendizado de tecnologia não se limita ao código; ele também
            envolve organização, resolução de problemas, comunicação e capacidade de apresentar
            ideias com clareza e qualidade.
          </p>
        </section>

        <section className="unidades" id="unidades">
          <div className="secao-titulo">
            <p className="panel-kicker">Estrutura escolar</p>
            <h2>As duas unidades do projeto</h2>
          </div>

          <div className="grid-unidades">
            {portfolioModel.unidades.map((unidade) => (
              <UnidadeCard key={unidade.nome} unidade={unidade} />
            ))}
          </div>
        </section>

        <section className="atividades" id="atividades">
          <div className="secao-titulo">
            <p className="panel-kicker">Atividades do ano</p>
            <h2>Registro de trabalhos e aprendizados</h2>
          </div>

          <div className="grid-atividades">
            {atividades.map((atividade) => (
              <AtividadeCard key={atividade.id} atividade={atividade} />
            ))}
          </div>
        </section>

        <AdminController atividades={atividades} setAtividades={setAtividades} />
      </main>

      <Rodape />
    </>
  );
}
