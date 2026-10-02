const projetos = [
  {
    titulo: "Calculadora",
    imagem: new URL("./assets/img/projeto 1.jpeg", import.meta.url).href,
    descricao:
      "Projeto desenvolvido para praticar lógica de programação e manipulação de operações matemáticas de forma simples e funcional.",
    textoAlternativo: "Projeto de calculadora",
  },
  {
    titulo: "Sistema de Gestão",
    imagem: new URL("./assets/img/projeto 2.jpeg", import.meta.url).href,
    descricao:
      "Aplicação que explora organização e estrutura de dados, com foco em facilitar o controle de informações de maneira prática.",
    textoAlternativo: "Projeto de gestão",
  },
  {
    titulo: "Barbearia",
    imagem: new URL("./assets/img/projeto 3.jpeg", import.meta.url).href,
    descricao:
      "Layout e estrutura voltados para apresentação de serviços, marca e identidade visual, demonstrando a importância do design em um site.",
    textoAlternativo: "Projeto de barbearia",
  },
  {
    titulo: "Supermercado",
    imagem: new URL("./assets/img/projeto 4.jpeg", import.meta.url).href,
    descricao:
      "Projeto pensado para simular uma interface comercial, com foco em organização visual, navegação e experiência do usuário.",
    textoAlternativo: "Projeto de supermercado",
  },
];

const linksNavegacao = [
  { texto: "Início", destino: "#inicio" },
  { texto: "Sobre", destino: "#sobre" },
  { texto: "Projetos", destino: "#projetos" },
  { texto: "Aprendizagens", destino: "#aprendizagens" },
  { texto: "Autoavaliação", destino: "#autoavaliacao" },
];

function BarraNavegacao() {
  return (
    <nav aria-label="Navegação principal" className="barra-navegacao">
      <a className="marca" href="#inicio" aria-label="Rafael Alves, início">
        Rafael Alves
      </a>
      <ul>
        {linksNavegacao.map((link) => (
          <li key={link.destino}>
            <a href={link.destino}>{link.texto}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Apresentacao() {
  const imagemApresentacao = new URL(
    "./assets/img/projeto 2.jpeg",
    import.meta.url,
  ).href;

  return (
    <section className="apresentacao">
      <div className="apresentacao-texto">
        <p className="apresentacao-introducao">Olá, eu sou</p>
        <h1>
          Rafael Danta
          <br />
          Alves Cardozo
        </h1>
        <p className="apresentacao-descricao">
          Estudante de Tecnologia da Informação, interessado em desenvolvimento
          de software e em criar soluções práticas, úteis e bem estruturadas.
        </p>
        <div className="apresentacao-links">
          <a className="link-destaque" href="#projetos">
            Ver projetos
          </a>
          <a className="link-secundario" href="#sobre">
            Sobre mim
          </a>
        </div>
      </div>
      <figure className="apresentacao-imagem">
        <img
          src={imagemApresentacao}
          alt="Ilustração de uma pessoa trabalhando em desenvolvimento de software"
        />
      </figure>
    </section>
  );
}

function CartoesProjetos() {
  return (
    <div className="lista-projetos">
      {projetos.map((projeto) => (
        <article className="projeto" key={projeto.titulo}>
          <img src={projeto.imagem} alt={projeto.textoAlternativo} />
          <div className="projeto-conteudo">
            <h3>{projeto.titulo}</h3>
            <p>{projeto.descricao}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Rodape() {
  return (
    <footer>
      <div className="rodape-conteudo">
        <div className="rodape-mensagem">
          <p className="rodape-etiqueta">Portfólio · 2026</p>
          <h2>Obrigado por conhecer um pouco do meu percurso.</h2>
          <a className="rodape-link-inicio" href="#inicio">
            Voltar ao início
          </a>
        </div>
        <div className="rodape-identificacao">
          <p className="rodape-nome">Rafael Alves</p>
          <p className="rodape-curso">Curso Técnico de Tecnologia da Informação</p>
          <nav aria-label="Navegação do rodapé" className="rodape-navegacao">
            {linksNavegacao.slice(1).map((link) => (
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
  return (
    <>
      <header id="inicio">
        <BarraNavegacao />
        <Apresentacao />
      </header>

      <main>
        <section className="sobre" id="sobre">
          <h2>Sobre mim</h2>
          <p>
            Tenho 17 anos e estou em formação no campo da tecnologia, buscando
            desenvolver habilidades em lógica, programação e criação de projetos
            com foco em experiência e funcionalidade. Além do estudo, também me
            preocupo com a organização, a disciplina e a evolução contínua, pois
            acredito que aprender tecnologia é também aprender a resolver
            problemas de forma criativa e eficiente.
          </p>
        </section>

        <section className="projetos" id="projetos">
          <h2>Projetos</h2>
          <CartoesProjetos />
        </section>

        <section className="aprendizagens" id="aprendizagens">
          <h2>Aprendizagens</h2>
          <article className="aprendizagem">
            <p>
              Ao longo do processo de estudo, aprendi muito sobre estrutura de
              páginas, organização do código, design visual e a importância de
              criar interfaces claras e funcionais. Também desenvolvi melhor
              minha capacidade de raciocínio lógico, trabalho em equipe e atenção
              aos detalhes, habilidades essenciais para qualquer caminho
              profissional em tecnologia.
            </p>
          </article>
        </section>

        <section className="autoavaliacao" id="autoavaliacao">
          <h2>Autoavaliação</h2>
          <p>
            Vejo meu progresso como algo constante e promissor. Tenho me dedicado
            ao aprendizado com comprometimento e estou cada vez mais consciente da
            importância de continuar evoluindo em áreas como programação, lógica,
            comunicação e criatividade. Acredito que esse caminho está me
            preparando para desafios maiores e para uma carreira sólida no
            mercado de tecnologia.
          </p>
        </section>
      </main>

      <Rodape />
    </>
  );
}