# Portfólio de Rafael Alves

Portfólio desenvolvido com React e Vite.

## Estrutura

- `FRONT-END/`: aplicação React, estilos, imagens e configuração do Vite.
- `BACK-END/`: espaço reservado para o futuro back-end.
- `index.html`: encaminha para a versão compilada em `FRONT-END/dist/`.

## Requisitos

- Node.js 22 ou mais recente.
- npm, instalado junto com o Node.js.

Para conferir as versões instaladas:

```powershell
node --version
npm --version
```

## Rodar no navegador

1. Abra o terminal na pasta principal do projeto.
2. Entre na pasta do front-end:

	```powershell
	cd FRONT-END
	```

3. Instale as dependências:

	```powershell
	npm ci
	```

4. Inicie o servidor de desenvolvimento:

	```powershell
	npm run dev
	```

5. Abra no navegador o endereço mostrado no terminal. Por padrão, o Vite usa `http://localhost:5173/`.
6. Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

Use o servidor Vite para desenvolver. Abrir `FRONT-END/index.html` diretamente com duplo clique não processa os módulos React.

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