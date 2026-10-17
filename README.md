# Portfólio de Rafael Alves

Portfólio desenvolvido com React e Vite.

## Estrutura

- `FRONT-END/`: aplicação React, estilos, imagens e configuração do Vite.
- `BACK-END/`: API Express para consultar e cadastrar atividades.
- `index.html`: encaminha para a versão compilada em `FRONT-END/dist/`.

## Requisitos

- Node.js 22 ou mais recente.
- npm, instalado junto com o Node.js.

Para conferir as versões instaladas:

```powershell
node --version
npm --version
```

## Rodar o projeto localmente

O front-end e o backend devem rodar ao mesmo tempo, cada um em um terminal.

1. No primeiro terminal, inicie a API:

	```powershell
	cd BACK-END
	npm install
	npm start
	```

	A API ficará em `http://localhost:3000`.

2. No segundo terminal, inicie o front-end:

	```powershell
	cd FRONT-END
	npm ci
	npm run dev
	```

3. Acesse o endereço do Vite, normalmente `http://localhost:5173/`.

O Vite encaminha as chamadas `/api` para o backend local. Para encerrar os servidores, pressione `Ctrl+C` em cada terminal. Abrir os arquivos HTML diretamente não inicia o backend.

O GitHub Pages hospeda apenas arquivos estáticos; para usar a API publicada, será necessário hospedar o backend em um serviço separado e configurar o endereço dele.

## Como a página é montada

- `FRONT-END/index.html` fornece o elemento `#root` onde o React desenha a página.
- `FRONT-END/src/main.jsx` inicia o React e importa os estilos.
- `FRONT-END/src/App.jsx` contém os componentes e o conteúdo do portfólio.
- `FRONT-END/src/style.css` contém as regras visuais.
- `FRONT-END/src/assets/img/` contém as imagens dos projetos.

## Gerar a versão final

Dentro de `FRONT-END/`, execute:

```powershell
npm run build
```

O Vite cria os arquivos prontos para publicação em `FRONT-END/dist/`. Para testar essa versão localmente:

```powershell
npm run preview
```

Mantenha `FRONT-END/dist/` junto ao projeto ao publicar pelo GitHub Pages; a regra `.gitignore` já permite incluir essa pasta.