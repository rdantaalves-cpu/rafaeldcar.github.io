import { useEffect, useMemo, useRef, useState } from "react";
import { consultarSessao, criarAtividade, encerrarSessao, iniciarSessao, listarAtividades } from "./api/atividades";

const TAMANHO_MAXIMO_ARQUIVO = 5 * 1024 * 1024;
const CHAVE_TEMA = "portfolio-tema";

function obterTemaInicial() {
  try {
    return window.localStorage.getItem(CHAVE_TEMA) === "light" ? "light" : "dark";
  } catch (erro) {
    console.warn("Não foi possível carregar a preferência de tema.", erro);
    return "dark";
  }
}

const formularioInicial = {
  titulo: "",
  descricao: "",
  disciplina: "",
  tipoEnsino: "",
  unidade: "SENAI",
  periodo: "",
  imagem: "",
  imagemNome: "",
  pdf: "",
  pdfNome: "",
};

function formatarData(data) {
  if (!data) return "";
  const valor = new Date(data);
  return Number.isNaN(valor.getTime())
    ? ""
    : valor.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function BarraNavegacao({ autenticado, tema, aoAlterarTema, aoEntrar, aoSair }) {
  return (
    <div className="barra-site">
      <header className="cabecalho">
        <a className="marca" href="#inicio" aria-label="Rafael Alves, início">
          Rafael Alves<span aria-hidden="true">.</span>
        </a>
        <nav aria-label="Navegação principal">
          <a className="link-navegacao" href="#atividades">Atividades</a>
          {autenticado ? <a className="link-navegacao" href="#cadastro">Adicionar atividade</a> : null}
          <button
            className="botao-tema"
            type="button"
            aria-label={`Ativar tema ${tema === "dark" ? "claro" : "escuro"}`}
            aria-pressed={tema === "light"}
            onClick={aoAlterarTema}
          >
            <span aria-hidden="true">{tema === "dark" ? "☀" : "◐"}</span>
            {tema === "dark" ? "Claro" : "Escuro"}
          </button>
          {autenticado ? (
            <button className="botao-sessao" type="button" onClick={aoSair}>Sair</button>
          ) : (
            <button className="botao-login" type="button" onClick={aoEntrar} aria-haspopup="dialog">Entrar</button>
          )}
        </nav>
      </header>
    </div>
  );
}

function Apresentacao() {
  return (
    <section className="apresentacao" id="inicio" aria-labelledby="titulo-principal">
      <div className="apresentacao-texto">
        <p className="sobretitulo">Portfólio · Tecnologia da Informação</p>
        <h1 id="titulo-principal"><span className="titulo-destaque">Rafael Danta</span><br />Alves Cardozo</h1>
        <p className="apresentacao-resumo">
          Projetos e atividades desenvolvidos durante minha formação no SESI e no SENAI.
        </p>
        <a className="link-principal" href="#atividades">Ver atividades <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}

function Filtro({ id, rotulo, valor, aoAlterar, opcoes }) {
  return (
    <label className="filtro" htmlFor={id}>
      <span>{rotulo}</span>
      <select id={id} value={valor} onChange={(evento) => aoAlterar(evento.target.value)}>
        <option value="">Todas</option>
        {opcoes.map((opcao) => <option value={opcao} key={opcao}>{opcao}</option>)}
      </select>
    </label>
  );
}

function FiltroUnidade({ valor, aoAlterar }) {
  const opcoes = [
    { texto: "Todas", valor: "" },
    { texto: "SESI", valor: "SESI" },
    { texto: "SENAI", valor: "SENAI" },
  ];

  return (
    <div className="filtro filtro-unidade">
      <span id="rotulo-filtro-unidade">Unidade</span>
      <div className="opcoes-unidade" role="group" aria-labelledby="rotulo-filtro-unidade">
        {opcoes.map((opcao) => (
          <button
            className={valor === opcao.valor ? "opcao-unidade selecionada" : "opcao-unidade"}
            type="button"
            key={opcao.texto}
            aria-pressed={valor === opcao.valor}
            onClick={() => aoAlterar(opcao.valor)}
          >
            {opcao.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

function AtividadeCard({ atividade, aoAbrir }) {
  const materia = atividade.disciplina?.nome_materia;
  const periodo = atividade.periodo || formatarData(atividade.data_criacao);
  return (
    <article className="atividade">
      {atividade.imagem ? (
        <img className="atividade-imagem" src={atividade.imagem} alt={`Imagem da atividade: ${atividade.titulo}`} loading="lazy" />
      ) : null}
      <div className="atividade-corpo">
        <div className="atividade-metadados">
          {atividade.unidade ? <span>{atividade.unidade}</span> : null}
          {materia ? <span>{materia}</span> : null}
          {periodo ? <time>{periodo}</time> : null}
        </div>
        <h3>{atividade.titulo}</h3>
        <p>{atividade.descricao}</p>
        <button type="button" className="link-detalhes" onClick={() => aoAbrir(atividade)}>
          Ver atividade <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
}

function SecaoAtividades({ atividades, carregando, erro, aoTentarNovamente, aoAbrir }) {
  const [busca, setBusca] = useState("");
  const [unidade, setUnidade] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [periodo, setPeriodo] = useState("");

  const opcoesDisciplina = useMemo(
    () => [...new Set(atividades.map((item) => item.disciplina?.nome_materia).filter(Boolean))].sort(), [atividades],
  );
  const opcoesPeriodo = useMemo(
    () => [...new Set(atividades.map((item) => item.periodo).filter(Boolean))].sort(), [atividades],
  );

  const filtradas = atividades.filter((atividade) => {
    const texto = `${atividade.titulo || ""} ${atividade.descricao || ""} ${atividade.disciplina?.nome_materia || ""}`.toLocaleLowerCase("pt-BR");
    return (!busca || texto.includes(busca.trim().toLocaleLowerCase("pt-BR")))
      && (!unidade || atividade.unidade === unidade)
      && (!disciplina || atividade.disciplina?.nome_materia === disciplina)
      && (!periodo || atividade.periodo === periodo);
  });

  return (
    <section className="secao-atividades" id="atividades" aria-labelledby="titulo-atividades">
      <div className="cabecalho-secao">
        <h2 id="titulo-atividades">Atividades</h2>
        {atividades.length > 0 ? (
          <p className="contador-atividades">{atividades.length} {atividades.length === 1 ? "registro" : "registros"}</p>
        ) : null}
      </div>

      {atividades.length > 0 ? (
        <div className="filtros" aria-label="Filtros de atividades">
          <FiltroUnidade valor={unidade} aoAlterar={setUnidade} />
          <label className="filtro filtro-busca" htmlFor="busca-atividades">
            <span>Buscar</span>
            <input id="busca-atividades" type="search" value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Título, descrição ou disciplina" />
          </label>
          <Filtro id="filtro-disciplina" rotulo="Disciplina" valor={disciplina} aoAlterar={setDisciplina} opcoes={opcoesDisciplina} />
          <Filtro id="filtro-periodo" rotulo="Período" valor={periodo} aoAlterar={setPeriodo} opcoes={opcoesPeriodo} />
        </div>
      ) : null}

      {carregando ? (
        <p className="estado-carregamento" role="status">Carregando atividades…</p>
      ) : erro ? (
        <div className="estado-vazio" role="alert">
          <h3>Não foi possível carregar as atividades.</h3>
          <p>Verifique sua conexão e tente novamente.</p>
          <button className="botao-contorno" type="button" onClick={aoTentarNovamente}>Tentar novamente</button>
        </div>
      ) : atividades.length === 0 ? (
        <div className="estado-vazio"><h3>As atividades aparecerão aqui.</h3></div>
      ) : filtradas.length === 0 ? (
        <div className="estado-vazio"><h3>Nenhuma atividade corresponde aos filtros.</h3><p>Altere a busca ou selecione outras opções para ver os registros.</p></div>
      ) : (
        <div className="lista-atividades">
          {filtradas.map((atividade) => <AtividadeCard key={atividade.id} atividade={atividade} aoAbrir={aoAbrir} />)}
        </div>
      )}
    </section>
  );
}

function DetalheAtividade({ atividade, aoFechar, focoAnteriorRef }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!atividade) return undefined;
    const modal = modalRef.current;
    const fecharComEscape = (evento) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        aoFechar(null);
        return;
      }
      if (evento.key !== "Tab") return;

      const elementosFocaveis = modal.querySelectorAll("button, a[href]");
      const primeiro = elementosFocaveis[0];
      const ultimo = elementosFocaveis[elementosFocaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };
    modal.querySelector("button")?.focus();
    document.addEventListener("keydown", fecharComEscape);
    document.body.classList.add("modal-aberto");
    return () => {
      document.removeEventListener("keydown", fecharComEscape);
      document.body.classList.remove("modal-aberto");
      focoAnteriorRef.current?.focus();
      focoAnteriorRef.current = null;
    };
  }, [atividade, aoFechar, focoAnteriorRef]);

  if (!atividade) return null;
  return (
    <div className="sobreposicao-modal" onMouseDown={(evento) => evento.target === evento.currentTarget && aoFechar(null)}>
      <section className="detalhe-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="titulo-detalhe">
        <button className="fechar-modal" type="button" onClick={() => aoFechar(null)} aria-label="Fechar detalhes">Fechar <span aria-hidden="true">×</span></button>
        {atividade.imagem ? <img className="detalhe-imagem" src={atividade.imagem} alt={`Imagem da atividade: ${atividade.titulo}`} /> : null}
        <div className="detalhe-corpo">
          <p className="rotulo-secao">{[atividade.unidade, atividade.disciplina?.nome_materia, atividade.periodo].filter(Boolean).join(" · ")}</p>
          <h2 id="titulo-detalhe">{atividade.titulo}</h2>
          <p className="detalhe-descricao">{atividade.descricao}</p>
          {atividade.data_criacao ? <p className="data-criacao">Publicado em {formatarData(atividade.data_criacao)}</p> : null}
          <div className="links-arquivos">
            {atividade.imagem ? <a href={atividade.imagem} target="_blank" rel="noopener noreferrer">Abrir imagem</a> : null}
            {atividade.pdf ? <a href={atividade.pdf} target="_blank" rel="noopener noreferrer">Abrir PDF</a> : null}
            {!atividade.imagem && !atividade.pdf ? <span>Nenhum arquivo anexado.</span> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function FormularioAtividade({ aoSalvar }) {
  const formularioRef = useRef(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [arquivosPendentes, setArquivosPendentes] = useState(0);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function atualizarArquivo(evento) {
    const { name, files } = evento.target;
    const arquivo = files?.[0];
    setErro("");
    setSucesso("");
    if (!arquivo) return;

    const tiposImagemValidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const tipoValido = name === "imagem"
      ? tiposImagemValidos.includes(arquivo.type)
      : arquivo.type === "application/pdf";
    if (!tipoValido) {
      setErro(name === "imagem" ? "Selecione um arquivo de imagem válido." : "Selecione um arquivo PDF válido.");
      evento.target.value = "";
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      setErro("Cada arquivo deve ter no máximo 5 MB.");
      evento.target.value = "";
      return;
    }

    setArquivosPendentes((quantidade) => quantidade + 1);
    const leitor = new FileReader();
    leitor.onload = () => {
      setFormulario((atual) => ({ ...atual, [name]: leitor.result, [`${name}Nome`]: arquivo.name }));
      setArquivosPendentes((quantidade) => quantidade - 1);
    };
    leitor.onerror = () => {
      setErro("Não foi possível ler o arquivo selecionado.");
      setArquivosPendentes((quantidade) => quantidade - 1);
    };
    leitor.readAsDataURL(arquivo);
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);
    try {
      const payload = {
        titulo: formulario.titulo.trim(),
        descricao: formulario.descricao.trim(),
        disciplina: formulario.disciplina.trim()
          ? { nome_materia: formulario.disciplina.trim(), tipo_ensino: formulario.tipoEnsino.trim() || null }
          : null,
        unidade: formulario.unidade,
        periodo: formulario.periodo.trim() || null,
        imagem: formulario.imagem || null,
        pdf: formulario.pdf || null,
      };
      const atividade = await criarAtividade(payload);
      aoSalvar(atividade);
      setFormulario(formularioInicial);
      formularioRef.current?.reset();
      setSucesso("Atividade cadastrada com sucesso.");
    } catch (falha) {
      setErro(falha.message || "Não foi possível salvar a atividade.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="secao-cadastro" id="cadastro" aria-labelledby="titulo-cadastro">
      <div className="cadastro-introducao">
        <p className="rotulo-secao">Novo registro</p>
        <h2 id="titulo-cadastro">Adicionar atividade</h2>
        <p>Registre um trabalho desenvolvido no SESI ou no SENAI.</p>
      </div>
      <form className="formulario" ref={formularioRef} onSubmit={enviarFormulario}>
        <label className="campo campo-largo" htmlFor="titulo-atividade">
          Título
          <input id="titulo-atividade" name="titulo" value={formulario.titulo} onChange={atualizarCampo} required maxLength="140" />
        </label>
        <label className="campo" htmlFor="unidade-atividade">
          Unidade
          <select id="unidade-atividade" name="unidade" value={formulario.unidade} onChange={atualizarCampo}><option value="SENAI">SENAI</option><option value="SESI">SESI</option></select>
        </label>
        <label className="campo" htmlFor="periodo-atividade">
          Período
          <input id="periodo-atividade" name="periodo" value={formulario.periodo} onChange={atualizarCampo} placeholder="Ex.: Agosto / 2026" maxLength="60" />
        </label>
        <label className="campo" htmlFor="disciplina-atividade">
          Disciplina
          <input id="disciplina-atividade" name="disciplina" value={formulario.disciplina} onChange={atualizarCampo} />
        </label>
        <label className="campo" htmlFor="tipo-ensino-atividade">
          Tipo de ensino <span className="campo-opcional">opcional</span>
          <input id="tipo-ensino-atividade" name="tipoEnsino" value={formulario.tipoEnsino} onChange={atualizarCampo} maxLength="80" />
        </label>
        <label className="campo campo-largo" htmlFor="descricao-atividade">
          Descrição
          <textarea id="descricao-atividade" name="descricao" value={formulario.descricao} onChange={atualizarCampo} required rows="5" maxLength="3000" />
        </label>
        <label className="campo" htmlFor="imagem-atividade">
          Imagem <span className="campo-opcional">até 5 MB</span>
          <input id="imagem-atividade" name="imagem" type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={atualizarArquivo} />
          {formulario.imagemNome ? <small>{formulario.imagemNome}</small> : null}
        </label>
        <label className="campo" htmlFor="pdf-atividade">
          PDF <span className="campo-opcional">até 5 MB</span>
          <input id="pdf-atividade" name="pdf" type="file" accept="application/pdf" onChange={atualizarArquivo} />
          {formulario.pdfNome ? <small>{formulario.pdfNome}</small> : null}
        </label>
        {erro ? <p className="mensagem-formulario mensagem-erro" role="alert">{erro}</p> : null}
        {sucesso ? <p className="mensagem-formulario mensagem-sucesso" role="status">{sucesso}</p> : null}
        <div className="campo-largo acao-formulario">
          <button className="botao-principal" type="submit" disabled={salvando || arquivosPendentes > 0}>
            {arquivosPendentes > 0 ? "Lendo arquivo…" : salvando ? "Salvando…" : "Salvar atividade"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ModalLogin({ aberto, aoFechar, aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    const fecharComEscape = (evento) => {
      if (evento.key === "Escape") aoFechar();
    };
    emailRef.current?.focus();
    document.addEventListener("keydown", fecharComEscape);
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await aoEntrar({ email, senha });
      setSenha("");
    } catch (falha) {
      setErro(falha.message || "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="sobreposicao-modal" onMouseDown={(evento) => evento.target === evento.currentTarget && aoFechar()}>
      <section className="detalhe-modal modal-login" role="dialog" aria-modal="true" aria-labelledby="titulo-login">
        <button className="fechar-modal" type="button" onClick={aoFechar} aria-label="Fechar login">Fechar <span aria-hidden="true">×</span></button>
        <div className="detalhe-corpo">
          <p className="rotulo-secao">Área do autor</p>
          <h2 id="titulo-login">Entrar</h2>
          <p className="login-descricao">Acesso reservado para cadastrar atividades no portfólio.</p>
          <form className="formulario-login" onSubmit={enviar}>
            <label className="campo" htmlFor="login-email">
              E-mail
              <input ref={emailRef} id="login-email" type="text" inputMode="email" autoCapitalize="none" spellCheck="false" autoComplete="username" value={email} onChange={(evento) => setEmail(evento.target.value)} required />
            </label>
            <label className="campo" htmlFor="login-senha">
              Senha
              <input id="login-senha" type="password" autoComplete="current-password" value={senha} onChange={(evento) => setSenha(evento.target.value)} required />
            </label>
            {erro ? <p className="mensagem-formulario mensagem-erro" role="alert">{erro}</p> : null}
            <button className="botao-principal" type="submit" disabled={enviando}>{enviando ? "Entrando…" : "Entrar"}</button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Rodape() {
  return (
    <footer className="rodape">
      <p>Rafael Danta Alves Cardozo</p>
      <a href="#inicio">Voltar ao início ↑</a>
    </footer>
  );
}

export default function EstudioApp() {
  const [tema, setTema] = useState(obterTemaInicial);
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const focoAnteriorRef = useRef(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [autenticado, setAutenticado] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [loginAberto, setLoginAberto] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      window.localStorage.setItem(CHAVE_TEMA, tema);
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de tema.", erro);
    }
  }, [tema]);

  useEffect(() => {
    const controlador = new AbortController();
    setCarregando(true);
    setErroCarregamento(false);
    listarAtividades(controlador.signal)
      .then((dados) => setAtividades(dados))
      .catch((erro) => { if (erro.name !== "AbortError") setErroCarregamento(true); })
      .finally(() => { if (!controlador.signal.aborted) setCarregando(false); });
    return () => controlador.abort();
  }, [tentativa]);

  useEffect(() => {
    const controlador = new AbortController();
    consultarSessao(controlador.signal)
      .then((sessao) => setAutenticado(Boolean(sessao.autenticado)))
      .catch(() => setAutenticado(false))
      .finally(() => { if (!controlador.signal.aborted) setVerificandoSessao(false); });
    return () => controlador.abort();
  }, []);

  function adicionarAtividade(atividade) {
    setAtividades((atuais) => [atividade, ...atuais]);
  }

  async function entrar(credenciais) {
    await iniciarSessao(credenciais);
    setAutenticado(true);
    setLoginAberto(false);
  }

  async function sair() {
    try {
      await encerrarSessao();
    } finally {
      setAutenticado(false);
    }
  }

  return (
    <>
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <BarraNavegacao
        autenticado={autenticado}
        tema={tema}
        aoAlterarTema={() => setTema((atual) => atual === "dark" ? "light" : "dark")}
        aoEntrar={() => setLoginAberto(true)}
        aoSair={sair}
      />
      <Apresentacao />
      <main id="conteudo">
        <SecaoAtividades
          atividades={atividades}
          carregando={carregando}
          erro={erroCarregamento}
          aoTentarNovamente={() => setTentativa((atual) => atual + 1)}
          aoAbrir={(atividade) => {
            focoAnteriorRef.current = document.activeElement;
            setAtividadeSelecionada(atividade);
          }}
        />
        {autenticado ? <FormularioAtividade aoSalvar={adicionarAtividade} /> : null}
      </main>
      <Rodape />
      <DetalheAtividade atividade={atividadeSelecionada} aoFechar={setAtividadeSelecionada} focoAnteriorRef={focoAnteriorRef} />
      <ModalLogin aberto={loginAberto && !verificandoSessao} aoFechar={() => setLoginAberto(false)} aoEntrar={entrar} />
    </>
  );
}