const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const ENDPOINT_ATIVIDADES = `${API_BASE_URL}/api/atividades`;
const ENDPOINT_AUTH = `${API_BASE_URL}/api/auth`;

async function obterResposta(resposta, mensagemPadrao) {
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const detalhe = Array.isArray(dados?.detalhes) ? dados.detalhes.join(" ") : "";
    throw new Error(detalhe || dados?.erro || mensagemPadrao);
  }
  return dados;
}

async function requisitarJson(url, mensagemPadrao, opcoes) {
  return obterResposta(await fetch(url, opcoes), mensagemPadrao);
}

export async function listarAtividades(signal) {
  const dados = await requisitarJson(
    ENDPOINT_ATIVIDADES,
    "Não foi possível carregar as atividades.",
    { signal },
  );
  if (!Array.isArray(dados)) throw new Error("A resposta do servidor está em um formato inesperado.");
  return dados;
}

export async function criarAtividade(atividade) {
  return requisitarJson(ENDPOINT_ATIVIDADES, "Não foi possível salvar a atividade.", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(atividade),
  });
}

export async function consultarSessao(signal) {
  return requisitarJson(`${ENDPOINT_AUTH}/session`, "Não foi possível verificar a sessão.", {
    signal,
    credentials: "include",
  });
}

export async function iniciarSessao(credenciais) {
  return requisitarJson(`${ENDPOINT_AUTH}/login`, "Não foi possível iniciar a sessão.", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciais),
  });
}

export async function encerrarSessao() {
  const resposta = await fetch(`${ENDPOINT_AUTH}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!resposta.ok) throw new Error("Não foi possível encerrar a sessão.");
}