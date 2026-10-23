const crypto = require("crypto");

const NOME_COOKIE = "estudio_session";
const DURACAO_SESSAO_SEGUNDOS = 8 * 60 * 60;
const DURACAO_SESSAO_MS = DURACAO_SESSAO_SEGUNDOS * 1000;

function buscarCookie(req, nome) {
  const cookies = req.headers.cookie?.split(";") || [];
  const cookie = cookies.find((item) => item.trim().startsWith(`${nome}=`));
  return cookie ? decodeURIComponent(cookie.trim().slice(nome.length + 1)) : null;
}

function criarToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + DURACAO_SESSAO_SEGUNDOS,
  })).toString("base64url");
  const assinatura = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${assinatura}`;
}

function obterEmailDaSessao(req) {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_EMAIL) return null;
  const token = buscarCookie(req, NOME_COOKIE);
  if (!token) return null;

  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return null;

  const assinaturaEsperada = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(payload)
    .digest();
  const assinaturaRecebida = Buffer.from(assinatura, "base64url");
  if (
    assinaturaRecebida.length !== assinaturaEsperada.length
    || !crypto.timingSafeEqual(assinaturaRecebida, assinaturaEsperada)
  ) return null;

  try {
    const sessao = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (sessao.exp <= Math.floor(Date.now() / 1000)) return null;
    if (sessao.email !== process.env.ADMIN_EMAIL.toLowerCase()) return null;
    return sessao.email;
  } catch {
    return null;
  }
}

function opcoesCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
  };
}

function login(req, res) {
  const emailConfigurado = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hashConfigurado = process.env.ADMIN_PASSWORD_HASH;
  const segredoConfigurado = process.env.SESSION_SECRET;
  if (!emailConfigurado || !hashConfigurado || !segredoConfigurado) {
    return res.status(503).json({ erro: "A autenticação ainda não foi configurada no servidor." });
  }

  const emailInformado = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const senhaInformada = typeof req.body?.senha === "string" ? req.body.senha : "";
  const [salt, hashHex, campoExtra] = hashConfigurado.split(":");
  if (!salt || !hashHex || campoExtra || !/^[a-f0-9]{128}$/i.test(hashHex)) {
    return res.status(503).json({ erro: "A autenticação ainda não foi configurada no servidor." });
  }

  const hashRecebido = crypto.scryptSync(senhaInformada.slice(0, 256), salt, 64);
  const hashEsperado = Buffer.from(hashHex, "hex");
  const senhaValida = crypto.timingSafeEqual(hashRecebido, hashEsperado);
  if (emailInformado !== emailConfigurado || !senhaValida || senhaInformada.length > 256) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  res.cookie(NOME_COOKIE, criarToken(emailConfigurado), {
    ...opcoesCookie(),
    maxAge: DURACAO_SESSAO_MS,
  });
  return res.status(200).json({ autenticado: true, email: emailConfigurado });
}

function consultarSessao(req, res) {
  const email = obterEmailDaSessao(req);
  return res.status(200).json({ autenticado: Boolean(email), email });
}

function logout(req, res) {
  res.clearCookie(NOME_COOKIE, opcoesCookie());
  return res.sendStatus(204);
}

module.exports = { login, consultarSessao, logout, obterEmailDaSessao };