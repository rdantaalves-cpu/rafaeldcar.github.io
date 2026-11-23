# Portfólio Acadêmico

Portfólio responsivo feito com React e Vite, com API Express e persistência MySQL via Sequelize. A aplicação apresenta projetos, atividades escolares e o percurso de Rafael Danta Alves Cardozo no SESI e no SENAI.

## Requisitos

- Node.js 20.19 ou superior, ou 22.12 ou superior (requisito do Vite atual)
- npm
- MySQL 8 ou compatível

## Executar localmente

Configure primeiro o MySQL e as variáveis de ambiente conforme [BACK-END/README.md](./BACK-END/README.md). Em seguida, inicie a API e o frontend em terminais separados:

```powershell
Set-Location BACK-END
npm install
Copy-Item .env.example .env
npm start
```

```powershell
Set-Location FRONT-END
npm install
npm run dev
```

O Vite atende normalmente em `http://localhost:5173` e encaminha `/api` para `http://localhost:3000`. O backend precisa de uma instância MySQL ativa e configurada para iniciar.

Se frontend e API estiverem em origens diferentes, configure `VITE_API_URL` no ambiente do frontend com o endereço base da API e inclua a origem exata do frontend em `FRONTEND_URL` no backend. Para permitir mais de uma origem, separe-as por vírgula.

## Build

```powershell
Set-Location FRONT-END
npm run build
npm run preview
```

O Vite gera a versão de publicação em `FRONT-END/dist/`. Hospede o frontend e a API em serviços compatíveis; hospedagem de arquivos estáticos, como GitHub Pages, não executa o backend nem disponibiliza MySQL.

## Estrutura

- `FRONT-END/src/EstudioApp.jsx`: interface e fluxos do portfólio.
- `FRONT-END/src/estudio.css`: identidade visual responsiva.
- `FRONT-END/src/api/atividades.js`: comunicação HTTP com a API.
- `BACK-END/src/app.js`: Express, CORS e inicialização da API.
- `BACK-END/src/database.js`: conexão MySQL via Sequelize.
- `BACK-END/src/models/Atividade.js`: modelo, validação e serialização das atividades.
- `BACK-END/src/controllers/`: operações de atividades e autenticação.