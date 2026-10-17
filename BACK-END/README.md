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

## Rotas

### POST `/api/atividades` — criar atividade
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
- **400 Bad Request** → `{ "erro": "Dados inválidos.", "detalhes": ["..."] }`

### GET `/api/atividades` — listar atividades
- **200 OK** → lista JSON (`[]` se estiver vazia).

## Como testar (Thunder Client ou Postman)
1. Inicie com `npm start`.
2. `GET http://localhost:3000/api/atividades` → deve retornar `[]`.
3. `POST http://localhost:3000/api/atividades` com *Body → JSON* (exemplo acima) → deve retornar 201.
4. Envie um POST com `"titulo": "   "` → deve retornar 400 com a mensagem de erro.
5. Repita o GET → a atividade criada deve aparecer.

## Arquivos
| Arquivo | Função |
|---|---|
| `src/models/Atividade.js` | Entidade `Atividade` + validações (não importa controller/rotas) |
| `src/controllers/atividadeController.js` | Guarda a lista em memória, chama o model e responde HTTP |
| `src/routes/atividadeRoutes.js` | Liga `POST` e `GET` às funções do controller |
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
- Sem login, autenticação ou banco de dados (fora do escopo desta etapa).
- Imagens e PDFs ficam em memória como Data URL e são perdidos quando o servidor reinicia.
- Apenas criar e listar (sem editar ou excluir).
- O site React consulta e cadastra atividades pela API; atividades de exemplo continuam aparecendo junto com os registros da API.
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
