const ENDPOINT_ATIVIDADES = "/api/atividades";
const ENDPOINT_AUTH = "/api/auth";

async function obterResposta(resposta, mensagemPadrao) {
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const detalhe = Array.isArray(dados?.detalhes) ? dados.detalhes.join(" ") : "";
    throw new Error(detalhe || dados?.erro || mensagemPadrao);
  }
  return dados;
}

export async function listarAtividades(signal) {
  const resposta = await fetch(ENDPOINT_ATIVIDADES, { signal });
  const dados = await obterResposta(resposta, "Não foi possível carregar as atividades.");
  if (!Array.isArray(dados)) throw new Error("A resposta do servidor está em um formato inesperado.");
  return dados;
}

export async function criarAtividade(atividade) {
  const resposta = await fetch(ENDPOINT_ATIVIDADES, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(atividade),
  });
  return obterResposta(resposta, "Não foi possível salvar a atividade.");
}

export async function consultarSessao(signal) {
  const resposta = await fetch(`${ENDPOINT_AUTH}/session`, { signal, credentials: "include" });
  return obterResposta(resposta, "Não foi possível verificar a sessão.");
}

export async function iniciarSessao(credenciais) {
  const resposta = await fetch(`${ENDPOINT_AUTH}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciais),
  });
  return obterResposta(resposta, "Não foi possível iniciar a sessão.");
}

export async function encerrarSessao() {
  const resposta = await fetch(`${ENDPOINT_AUTH}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!resposta.ok) throw new Error("Não foi possível encerrar a sessão.");
}