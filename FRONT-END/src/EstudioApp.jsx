import { useEffect, useMemo, useRef, useState } from "react";
import { consultarSessao, criarAtividade, encerrarSessao, iniciarSessao, listarAtividades } from "./api/atividades";

const imagemApresentacao = new URL("./assets/img/Espaço de trabalho criativo com portátil.png", import.meta.url).href;
const TAMANHO_MAXIMO_ARQUIVO = 5 * 1024 * 1024;

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

function SimboloMarca() {
  return <img className="marca-simbolo" src="./logo-estudio.svg" alt="" aria-hidden="true" />;
}

function BarraNavegacao({ autenticado, aoEntrar, aoSair }) {
  return (
    <header className="cabecalho">
      <div className="marca-acoes">
        <a className="marca" href="#inicio" aria-label="Estúdio Acadêmico, início">
          <span className="marca-sigla"><SimboloMarca /></span>
          <span>Estúdio Acadêmico</span>
        </a>
        {autenticado ? (
          <button className="botao-sessao" type="button" onClick={aoSair}>Sair</button>
        ) : (
          <button className="botao-login" type="button" onClick={aoEntrar} aria-haspopup="dialog">Entrar</button>
        )}
      </div>
      <nav aria-label="Navegação principal">
        <a href="#sobre">O projeto</a>
        <a href="#atividades">Atividades</a>
        {autenticado ? <a href="#cadastro">Adicionar atividade</a> : null}
      </nav>
    </header>
  );
}

function Apresentacao({ quantidade, carregando, erro }) {
  return (
    <section className="apresentacao" id="inicio" aria-labelledby="titulo-principal">
      <div className="apresentacao-texto">
        <p className="sobretitulo">Portfólio escolar · 2026</p>
        <h1 id="titulo-principal">Estúdio <em>Acadêmico</em></h1>
        <p className="apresentacao-resumo">
          Um registro dos trabalhos e aprendizados de Rafael Danta Alves Cardozo no SESI e no SENAI.
        </p>
        <div className="apresentacao-autor"><span>Por</span><strong>Rafael Danta Alves Cardozo</strong></div>
        <a className="link-principal" href="#atividades">Explorar atividades <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="imagem-apresentacao">
        <img src={imagemApresentacao} alt="Notebook com código aberto em uma mesa de estudos" />
        <figcaption>
          <span>SESI <i aria-hidden="true">·</i> SENAI</span>
          <span aria-live="polite">
            {carregando ? "Carregando acervo…" : erro ? "Acervo indisponível" : `${quantidade} ${quantidade === 1 ? "atividade publicada" : "atividades publicadas"}`}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

function SecaoSobre() {
  return (
    <section className="sobre" id="sobre" aria-labelledby="titulo-sobre">
      <p className="rotulo-secao">Sobre o projeto</p>
      <div className="sobre-conteudo">
        <h2 id="titulo-sobre">Aprender também é construir um caminho.</h2>
        <p>
          Este espaço reúne atividades desenvolvidas ao longo do ano letivo e conecta a formação
          do SESI à experiência técnica do SENAI. Cada registro publicado aqui corresponde a um
          trabalho cadastrado no portfólio.
        </p>
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
        <div><p className="rotulo-secao">Trabalhos publicados</p><h2 id="titulo-atividades">Atividades</h2></div>
        <p className="contador-atividades">{atividades.length} {atividades.length === 1 ? "registro" : "registros"}</p>
      </div>

      <div className={atividades.length > 0 ? "filtros" : "filtros filtros-vazios"} aria-label="Filtros de atividades">
        <FiltroUnidade valor={unidade} aoAlterar={setUnidade} />
        {atividades.length > 0 ? (
          <>
          <label className="filtro filtro-busca" htmlFor="busca-atividades">
            <span>Buscar</span>
            <input id="busca-atividades" type="search" value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Título, descrição ou disciplina" />
          </label>
          <Filtro id="filtro-disciplina" rotulo="Disciplina" valor={disciplina} aoAlterar={setDisciplina} opcoes={opcoesDisciplina} />
          <Filtro id="filtro-periodo" rotulo="Período" valor={periodo} aoAlterar={setPeriodo} opcoes={opcoesPeriodo} />
          </>
        ) : null}
      </div>

      {carregando ? (
        <p className="estado-carregamento" role="status">Carregando atividades…</p>
      ) : erro ? (
        <div className="estado-vazio" role="alert">
          <h3>Não foi possível carregar as atividades.</h3>
          <p>Verifique sua conexão e tente novamente.</p>
          <button className="botao-contorno" type="button" onClick={aoTentarNovamente}>Tentar novamente</button>
        </div>
      ) : atividades.length === 0 ? (
        <div className="estado-vazio"><h3>Nenhuma atividade publicada ainda.</h3><p>Quando um trabalho for cadastrado, ele aparecerá nesta seção.</p></div>
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

    const tipoValido = name === "imagem" ? arquivo.type.startsWith("image/") : arquivo.type === "application/pdf";
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
          <input id="tipo-ensino-atividade" name="tipoEnsino" value={formulario.tipoEnsino} onChange={atualizarCampo} />
        </label>
        <label className="campo campo-largo" htmlFor="descricao-atividade">
          Descrição
          <textarea id="descricao-atividade" name="descricao" value={formulario.descricao} onChange={atualizarCampo} required rows="5" maxLength="3000" />
        </label>
        <label className="campo" htmlFor="imagem-atividade">
          Imagem <span className="campo-opcional">até 5 MB</span>
          <input id="imagem-atividade" name="imagem" type="file" accept="image/*" onChange={atualizarArquivo} />
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

function SecaoPublica() {
  return (
    <section className="secao-publica" aria-labelledby="titulo-publico">
      <div className="publica-introducao">
        <p className="rotulo-secao">Acervo acadêmico</p>
        <h2 id="titulo-publico">Cada trabalho conta uma parte do percurso.</h2>
        <p>As atividades publicadas são organizadas para que seja fácil entender o contexto de cada estudo e consultar os materiais relacionados.</p>
      </div>
      <dl className="publica-detalhes">
        <div>
          <dt>Contexto</dt>
          <dd>Unidade, disciplina e período situam cada atividade no ano letivo.</dd>
        </div>
        <div>
          <dt>Materiais</dt>
          <dd>Imagens e PDFs ficam disponíveis junto aos detalhes do trabalho.</dd>
        </div>
        <div>
          <dt>Publicação</dt>
          <dd>O cadastro é reservado ao autor; a consulta ao acervo é pública.</dd>
        </div>
      </dl>
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
              <input ref={emailRef} id="login-email" type="email" autoComplete="username" value={email} onChange={(evento) => setEmail(evento.target.value)} required />
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
      <a className="marca marca-rodape" href="#inicio"><span className="marca-sigla"><SimboloMarca /></span>Estúdio Acadêmico</a>
      <p>Rafael Danta Alves Cardozo <span aria-hidden="true">·</span> 2026</p>
    </footer>
  );
}

export default function EstudioApp() {
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
      <BarraNavegacao autenticado={autenticado} aoEntrar={() => setLoginAberto(true)} aoSair={sair} />
      <Apresentacao quantidade={atividades.length} carregando={carregando} erro={erroCarregamento} />
      <main id="conteudo">
        <SecaoSobre />
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
        {autenticado ? <FormularioAtividade aoSalvar={adicionarAtividade} /> : <SecaoPublica />}
      </main>
      <Rodape />
      <DetalheAtividade atividade={atividadeSelecionada} aoFechar={setAtividadeSelecionada} focoAnteriorRef={focoAnteriorRef} />
      <ModalLogin aberto={loginAberto && !verificandoSessao} aoFechar={() => setLoginAberto(false)} aoEntrar={entrar} />
    </>
  );
}