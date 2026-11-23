# API do Portfólio Acadêmico

API Express para consultar e cadastrar as atividades do portfólio. Os registros são persistidos no MySQL com Sequelize.

## Requisitos

- Node.js 18 ou superior
- MySQL 8 ou compatível
- npm

## Configuração

1. Crie o banco de dados:

   ```sql
   CREATE DATABASE portfolio_escolar
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```

2. Na pasta `BACK-END`, instale as dependências, copie `.env.example` para `.env` e preencha as credenciais do MySQL:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

3. Configure também a conta administrativa:
   - `ADMIN_EMAIL`: e-mail autorizado a cadastrar atividades.
   - `ADMIN_PASSWORD_HASH`: hash scrypt no formato `sal:hash`; não use a senha em texto puro.
   - `SESSION_SECRET`: segredo aleatório exclusivo, com pelo menos 32 bytes.
   - `FRONTEND_URL`: origem autorizada; várias origens podem ser separadas por vírgula.

Para gerar o hash da senha sem armazená-la no código, execute no terminal e substitua `SUA_SENHA`:

```powershell
node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');process.stdout.write(s+':'+c.scryptSync(process.argv[1],s,64).toString('hex'))" "SUA_SENHA"
```

Gere o segredo da sessão com:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

O arquivo `.env` é ignorado pelo Git. Use senhas fortes, um usuário MySQL com permissões restritas ao banco da aplicação e HTTPS em produção.

## Execução

```powershell
npm start
```

O servidor verifica a conexão com MySQL e cria a tabela `atividades` se ela ainda não existir. Ele usa `PORT` (padrão `3000`).

## Rotas

### `POST /api/auth/login`

Recebe `{ "email": "...", "senha": "..." }` e cria uma sessão em cookie `HttpOnly`. Após cinco tentativas em 15 minutos, novos logins ficam temporariamente limitados.

- `200`: autenticação concluída.
- `401`: credenciais incorretas.
- `503`: autenticação ainda não configurada.

### `GET /api/auth/session`

Consulta a sessão atual e retorna `{ "autenticado": true|false, "email": "..." }`.

### `POST /api/auth/logout`

Encerra a sessão atual.

### `POST /api/atividades`

Cria uma atividade; exige sessão autenticada.

```json
{
  "titulo": "Mapa conceitual sobre respiração celular",
  "descricao": "Atividade desenvolvida para revisar o conteúdo.",
  "disciplina": {
    "nome_materia": "Ciências da Natureza",
    "tipo_ensino": "Comum"
  },
  "unidade": "SESI",
  "periodo": "Agosto / 2026",
  "imagem": "data:image/png;base64,...",
  "pdf": "data:application/pdf;base64,..."
}
```

Título e descrição são obrigatórios. Unidade aceita `SENAI` ou `SESI`. Imagem e PDF são opcionais, limitados a 5 MB cada; imagens aceitas: PNG, JPEG, GIF e WebP. O limite do corpo JSON é 15 MB.

- `201`: atividade criada.
- `400`: dados inválidos.
- `401`: sessão ausente ou expirada.
- `413`: corpo da requisição acima do limite.

### `GET /api/atividades`

Lista as atividades públicas em ordem decrescente de criação; retorna `[]` quando o acervo está vazio.

## CORS e cookies

O CORS aceita somente as origens em `FRONTEND_URL` e envia cookies com credenciais. Para publicar frontend e API em domínios diferentes, informe a origem completa do frontend, sem barra final. Requisições de escrita com cabeçalho `Origin` não autorizado recebem `403`.

Em produção o cookie exige HTTPS e usa `SameSite=None` para permitir o login entre origens; em desenvolvimento local usa `SameSite=Lax`. Conexões MySQL fora de `localhost`, `127.0.0.1` ou `::1` sempre usam TLS 1.2 ou superior e validam o certificado, independentemente do valor de `MYSQL_SSL`. Para MySQL local, `MYSQL_SSL=true` habilita TLS se necessário.

## Persistência

O Sequelize cria a tabela `atividades` automaticamente quando ela não existe. Imagens e PDFs são guardados no MySQL como Data URL. Para instalações existentes, faça backup do banco antes de alterações de esquema.
