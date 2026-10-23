# Sistema de Portfólio Escolar — Backend (MVP)

**Aluno:** Rafael Danta Alves Cardozo · **Turma:** 3D

API simples para organizar as atividades escolares do portfólio
(título, descrição, data de criação, disciplina, unidade e período).

> ⚠️ **Limitação importante:** os dados ficam **somente em memória** (uma lista).
> Quando o servidor é reiniciado, **todas as atividades são perdidas**.

## Requisitos
- Node.js 18 ou superior
- npm

## Instalação e execução
```bash
npm install
npm start
```
O servidor usa `process.env.PORT` (padrão **3000**): http://localhost:3000

### Configuração do acesso do autor
O cadastro exige uma única conta configurada no ambiente. Copie `.env.example` para `.env` e preencha:
- `ADMIN_EMAIL`: e-mail autorizado.
- `ADMIN_PASSWORD_HASH`: hash scrypt no formato `salt:hash`; não use a senha em texto puro.
- `SESSION_SECRET`: segredo aleatório exclusivo para assinar as sessões.
- `FRONTEND_URL`: origem autorizada do frontend.

Para gerar um hash sem salvar a senha no código, execute no terminal do backend e substitua `SUA_SENHA`:
```bash
node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');process.stdout.write(s+':'+c.scryptSync(process.argv[1],s,64).toString('hex'))" "SUA_SENHA"
```
Gere `SESSION_SECRET` com `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
O `.env` é ignorado pelo Git. Em produção, configure essas variáveis no ambiente do servidor e use HTTPS.

## Rotas

### POST `/api/auth/login` — entrar
Recebe `{ "email": "...", "senha": "..." }` e cria uma sessão em cookie `HttpOnly`.
- **200 OK** → `{ "autenticado": true, "email": "..." }`.
- **401 Unauthorized** → credenciais incorretas.
- Após cinco tentativas em 15 minutos, novos logins ficam limitados temporariamente.

### GET `/api/auth/session` — consultar sessão
- **200 OK** → `{ "autenticado": true|false, "email": "..." }`.

### POST `/api/auth/logout` — sair
Encerra a sessão atual.

### POST `/api/atividades` — criar atividade (somente autor autenticado)
Corpo (JSON):
```json
{
  "titulo": "Mapa conceitual sobre respiração celular",
  "descricao": "Atividade desenvolvida para revisar o conteúdo de Ciências da Natureza.",
  "disciplina": { "nome_materia": "Ciências da Natureza", "tipo_ensino": "Comum" },
  "unidade": "SESI",
  "periodo": "Agosto / 2026",
  "imagem": "data:image/png;base64,...",
  "pdf": "data:application/pdf;base64,..."
}
```
- `titulo` e `descricao`: obrigatórios (espaços nas pontas são removidos).
- `disciplina`, `unidade` (`SENAI` ou `SESI`), `periodo`, `imagem` e `pdf`: opcionais.
- Imagens e PDFs são enviados como Data URL em JSON; o limite do corpo da requisição é 15 MB.
- **201 Created** → retorna a atividade com `id` e `data_criacao` gerados pelo servidor.
- **401 Unauthorized** → é necessário entrar na conta do autor.
- **400 Bad Request** → `{ "erro": "Dados inválidos.", "detalhes": ["..."] }`

### GET `/api/atividades` — listar atividades
- **200 OK** → lista JSON (`[]` se estiver vazia).

## Como testar (Thunder Client ou Postman)
1. Inicie com `npm start`.
2. `GET http://localhost:3000/api/atividades` → deve retornar `[]`.
3. Entre em `POST http://localhost:3000/api/auth/login` com as credenciais configuradas; mantenha os cookies da sessão.
4. `POST http://localhost:3000/api/atividades` com *Body → JSON* (exemplo acima) → deve retornar 201.
5. Envie um POST sem sessão → deve retornar 401.
6. Repita o GET → a atividade criada deve aparecer sem exigir login.

## Arquivos
| Arquivo | Função |
|---|---|
| `src/models/Atividade.js` | Entidade `Atividade` + validações (não importa controller/rotas) |
| `src/controllers/atividadeController.js` | Guarda a lista em memória, chama o model e responde HTTP |
| `src/controllers/authController.js` | Login, sessão assinada e logout do autor |
| `src/middleware/exigirAutenticacao.js` | Protege a criação de atividades |
| `src/routes/authRoutes.js` | Rotas de sessão com limite de tentativas de login |
| `src/routes/atividadeRoutes.js` | Liga `POST` protegido e `GET` público às funções do controller |
| `src/app.js` | Configura Express, JSON, CORS simples e registra as rotas |
| `.gitignore` | Impede subir `node_modules/` e `.env` |

## Fluxo de um POST
1. O site/Thunder Client envia `POST /api/atividades` com JSON.
2. `app.js` lê o JSON (`express.json()`) e encaminha para a rota.
3. `atividadeRoutes.js` chama `criarAtividade`.
4. O controller usa `Atividade.validar()`; se houver erros → responde **400**.
5. Se estiver tudo certo, cria `new Atividade(...)` (gera `id` e `data_criacao`, limpa espaços).
6. O controller adiciona à lista em memória e responde **201** com o objeto criado.

## Limitações
- Dados em memória (perdidos ao reiniciar).
- A autenticação protege o cadastro; os dados ainda ficam em memória e são perdidos ao reiniciar.
- Imagens e PDFs ficam em memória como Data URL e são perdidos quando o servidor reinicia.
- Apenas criar e listar (sem editar ou excluir).
- O site React consulta atividades publicamente; somente o autor autenticado vê o formulário de cadastro.
- Os testes não foram executados por quem gerou este código; execute-os você mesmo seguindo a seção acima.

---

## 📌 Guia de commits (proteja seu projeto)
Faça commits pequenos a cada etapa concluída:

1. **Antes de tudo:** crie o `.gitignore` e confirme que `node_modules/` e `.env` estão nele.
   `git add .gitignore && git commit -m "chore: adiciona .gitignore"`
2. **Após criar o `package.json`:** `git commit -m "chore: configura package.json e npm start"`
3. **Após o model:** `git commit -m "feat: cria model Atividade com validações"`
4. **Após controller + rotas:** `git commit -m "feat: adiciona controller e rotas de atividades"`
5. **Após `app.js` e testar POST/GET:** `git commit -m "feat: configura servidor Express"`
6. **Após o README:** `git commit -m "docs: adiciona README"`
7. Só depois, `git push`.

Dicas de proteção:
- Antes de cada commit, rode `git status` e confira que **não** aparecem `node_modules/` nem `.env`.
- Nunca coloque senhas ou tokens no código.
- Se o front e o back ficarem no mesmo repositório, deixe o backend em uma pasta própria (ex.: `backend/`) e o site em `frontend/`.
