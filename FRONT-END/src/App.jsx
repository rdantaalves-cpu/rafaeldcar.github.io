import { useMemo, useState } from "react";
import { portfolioModel } from "./data/portfolioData";

const menuLinks = [
  { id: "inicio", texto: "Início" },
  { id: "atividades", texto: "Atividades" },
  { id: "admin", texto: "Admin" },
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

function BarraNavegacao({ rotaAtual, aoNavegar }) {
  return (
    <nav aria-label="Navegação principal" className="barra-navegacao">
      <button type="button" className="marca" onClick={() => aoNavegar("inicio")}>
        Rafael Alves
      </button>

      <ul>
        {menuLinks.map((link) => (
          <li key={link.id}>
            <button
              type="button"
              className={rotaAtual === link.id ? "nav-item active" : "nav-item"}
              onClick={() => aoNavegar(link.id)}
            >
              {link.texto}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Apresentacao({ aoNavegar }) {
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
          Reúne as atividades do SENAI e do SESI em um espaço moderno, pensado para mostrar
          a trajetória escolar com clareza, identidade e profissionalismo.
        </p>

        <div className="apresentacao-links">
          <button type="button" className="link-destaque" onClick={() => aoNavegar("atividades")}>
            Ver atividades
          </button>
          <button type="button" className="link-secundario" onClick={() => aoNavegar("admin")}>
            Administração
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <figure className="apresentacao-imagem">
          <img
            src={imagemApresentacao}
            alt="Estudante em ambiente de tecnologia com foco em desenvolvimento e aprendizado"
          />
        </figure>

        <div className="floating-card">
          <span className="floating-label">Ano letivo</span>
          <strong>2026</strong>
          <small>Desenvolvimento, estudo e inovação</small>
        </div>
      </div>
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

function AtividadeCard({ atividade, aoAbrirDetalhe }) {
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

        <div className="atividade-acoes">
          <button type="button" className="btn-ghost" onClick={() => aoAbrirDetalhe(atividade)}>
            Ver detalhes
          </button>

          {atividade.pdf ? (
            <a href={atividade.pdf} target="_blank" rel="noreferrer" className="pdf-link">
              PDF
            </a>
          ) : (
            <span className="pdf-link mute">Sem PDF</span>
          )}
        </div>
      </div>
    </article>
  );
}

function SelecaoAtividades({ atividades, aoAbrirDetalhe }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return atividades.filter((atividade) => {
      const atendeBusca =
        termo.length === 0 ||
        atividade.titulo.toLowerCase().includes(termo) ||
        atividade.descricao.toLowerCase().includes(termo) ||
        atividade.unidade.toLowerCase().includes(termo);

      const atendeFiltro = filtro === "Todas" || atividade.unidade === filtro;

      return atendeBusca && atendeFiltro;
    });
  }, [atividades, busca, filtro]);

  return (
    <section className="page-panel" id="atividades">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Atividades do ano</p>
          <h2>Registro de aprendizados</h2>
        </div>

        <div className="search-tools">
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Pesquisar atividade"
            aria-label="Pesquisar atividades"
          />

          <select value={filtro} onChange={(event) => setFiltro(event.target.value)} aria-label="Filtrar por unidade">
            <option value="Todas">Todas</option>
            <option value="SENAI">SENAI</option>
            <option value="SESI">SESI</option>
          </select>
        </div>
      </div>

      <div className="grid-atividades">
        {atividadesFiltradas.length > 0 ? (
          atividadesFiltradas.map((atividade) => (
            <AtividadeCard key={atividade.id} atividade={atividade} aoAbrirDetalhe={aoAbrirDetalhe} />
          ))
        ) : (
          <div className="empty-state">
            <strong>Nenhuma atividade encontrada.</strong>
            <p>Tente outra palavra-chave ou altere o filtro da unidade.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ModalDetalhe({ atividade, aoFechar }) {
  if (!atividade) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={aoFechar} aria-label="Fechar modal">
          ×
        </button>

        <img src={atividade.imagem} alt={atividade.titulo} />

        <div className="modal-body">
          <span className="badge badge-light">{atividade.unidade}</span>
          <h3>{atividade.titulo}</h3>
          <p className="modal-periodo">{atividade.periodo}</p>
          <p>{atividade.descricao}</p>

          {atividade.pdf ? (
            <a href={atividade.pdf} target="_blank" rel="noreferrer" className="pdf-link">
              Abrir arquivo em PDF
            </a>
          ) : (
            <span className="pdf-link mute">Arquivo PDF não disponível</span>
          )}
        </div>
      </div>
    </div>
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
    <section className="page-panel admin-panel" id="admin">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Painel administrativo</p>
          <h2>Adicionar nova atividade</h2>
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
              Imagem
              <input type="file" name="imagem" accept="image/*" onChange={atualizarArquivo} />
              {form.imagemNome ? <span className="arquivo-nome">{form.imagemNome}</span> : null}
            </label>

            <label>
              PDF
              <input type="file" name="pdf" accept="application/pdf" onChange={atualizarArquivo} />
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
            <img
              src={form.imagem || new URL("./assets/img/projeto 3.jpeg", import.meta.url).href}
              alt="Prévia da atividade"
            />
            <div className="preview-card-body">
              <span className="badge badge-light">{form.unidade}</span>
              <h4>{form.titulo || "Título da atividade"}</h4>
              <p>{form.descricao || "A descrição ficará disponível aqui."}</p>
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
          <div className="rodape-navegacao">
            <span>SENAI</span>
            <span>SESI</span>
            <span>Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Aplicativo() {
  const [rotaAtual, setRotaAtual] = useState("inicio");
  const [atividades, setAtividades] = useState(portfolioModel.atividades);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  const cardsUnidades = portfolioModel.unidades;

  return (
    <>
      <div className="site-shell">
        <header className="cabecalho-principal">
          <BarraNavegacao rotaAtual={rotaAtual} aoNavegar={setRotaAtual} />
          <Apresentacao aoNavegar={setRotaAtual} />
        </header>

        <main className="conteudo-principal">
          {rotaAtual === "inicio" && (
            <>
              <section className="overview-panel">
                <div className="secao-titulo">
                  <p className="panel-kicker">Sobre o percurso</p>
                  <h2>Uma formação pensada para o futuro.</h2>
                </div>
                <p>
                  Ao longo do ano letivo, desenvolvi atividades que conectam teoria, prática e
                  criatividade. O aprendizado vai além do código: envolve organização, comunicação,
                  resolução de problemas e clareza na apresentação das ideias.
                </p>
              </section>

              <section className="unidades" id="unidades">
                <div className="secao-titulo">
                  <p className="panel-kicker">Estrutura escolar</p>
                  <h2>As duas unidades em destaque</h2>
                </div>

                <div className="grid-unidades">
                  {cardsUnidades.map((unidade) => (
                    <UnidadeCard key={unidade.nome} unidade={unidade} />
                  ))}
                </div>
              </section>
            </>
          )}

          {rotaAtual === "atividades" && (
            <SelecaoAtividades atividades={atividades} aoAbrirDetalhe={setAtividadeSelecionada} />
          )}

          {rotaAtual === "admin" && <AdminController atividades={atividades} setAtividades={setAtividades} />}
        </main>

        <Rodape />
      </div>

      <ModalDetalhe atividade={atividadeSelecionada} aoFechar={() => setAtividadeSelecionada(null)} />
    </>
  );
}
