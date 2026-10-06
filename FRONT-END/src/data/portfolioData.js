const portfolioModel = {
  unidades: [
    {
      nome: "SENAI",
      tipo: "Curso Técnico em Tecnologia da Informação",
      descricao:
        "A base do curso coloca o aluno em contato com programação, redes, hardware, design e projetos que simulam situações reais do mercado profissional.",
      destaque: "Lógica, desenvolvimento e criação de soluções reais",
      cor: "cyan",
    },
    {
      nome: "SESI",
      tipo: "Núcleo Comum",
      descricao:
        "O núcleo comum fortalece a formação geral com foco em comunicação, ciência, organização e integração entre áreas do conhecimento.",
      destaque: "Formação ampla, pensamento crítico e aprendizagem contínua",
      cor: "gold",
    },
  ],

  atividades: [
    {
      id: 1,
      titulo: "Semana de Programação",
      unidade: "SENAI",
      periodo: "Março / 2026",
      descricao:
        "Atividade voltada para a criação de soluções digitais com foco em lógica, organização e apresentação funcional de ideias de software.",
      imagem: new URL("../assets/img/projeto 1.jpeg", import.meta.url).href,
      pdf: "",
    },
    {
      id: 2,
      titulo: "Projeto de Pesquisa e Contexto",
      unidade: "SESI",
      periodo: "Abril / 2026",
      descricao:
        "Trabalho acadêmico desenvolvido com estudo de temas relevantes, produção de argumentação e organização de informações para apresentação clara.",
      imagem: new URL("../assets/img/projeto 2.jpeg", import.meta.url).href,
      pdf: "",
    },
    {
      id: 3,
      titulo: "Design e Apresentação Visual",
      unidade: "SENAI",
      periodo: "Maio / 2026",
      descricao:
        "Exploração de identidade visual, estrutura de páginas e elementos visuais para tornar projetos mais profissionais e compreensíveis.",
      imagem: new URL("../assets/img/projeto 3.jpeg", import.meta.url).href,
      pdf: "",
    },
    {
      id: 4,
      titulo: "Reflexão de Aprendizagem",
      unidade: "SESI",
      periodo: "Junho / 2026",
      descricao:
        "Momento de autoavaliação sobre estudo, organização e crescimento pessoal ao longo do ano letivo, com olhar crítico e realista.",
      imagem: new URL("../assets/img/projeto 4.jpeg", import.meta.url).href,
      pdf: "",
    },
  ],
};

export { portfolioModel };
