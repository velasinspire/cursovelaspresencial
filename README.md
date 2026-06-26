# Curso Presencial de Velas Artesanais — Inspire

Landing page do curso presencial de velas aromáticas. Estrutura separada em
HTML, CSS, JS e um arquivo de conteúdo editável (JSON), para facilitar
manutenção sem precisar editar código.

## Estrutura de arquivos

```
.
├── index.html              → estrutura da página (HTML puro, sem estilo/lógica embutida)
├── css/
│   ├── tailwind.css         → classes utilitárias (gerado automaticamente, não editar à mão)
│   └── styles.css           → estilos personalizados da marca (cores, animações, componentes)
├── js/
│   └── main.js               → comportamento da página (animações, formulário, leitura do content.json)
├── data/
│   └── content.json          → TEXTOS E DADOS QUE MUDAM COM FREQUÊNCIA (data, preço, vagas, link do forms, depoimento...)
├── assets/
│   └── images/                → fotos usadas na página
└── build/                     → ferramentas para recompilar o css/tailwind.css (uso opcional, só para quem for editar classes do Tailwind)
```

## Como editar o conteúdo (sem tocar no código)

Abra `data/content.json`. Esse arquivo concentra tudo que tende a mudar
de tempos em tempos:

- `course.date`, `course.time`, `course.location`, `course.spots` → data, horário, vagas
- `pricing.*` → valores do investimento (cartão/PIX)
- `testimonial.*` → o depoimento em destaque no hero
- `form.googleFormAction` → endpoint `formResponse` do Google Forms usado no envio embutido
- `site.*` → nome da marca, texto do botão do menu, frase final do rodapé

**Importante sobre como isso funciona:**

Se você só abre o `index.html` clicando duas vezes nele (endereço começando
com `file:///...`), o navegador bloqueia por segurança a leitura do
`content.json` pelo JavaScript. Nesse caso a página usa automaticamente os
valores padrão que já estão dentro de `js/main.js` (no topo do arquivo, no
objeto `DEFAULT_DATA`) — por isso a página nunca quebra, mesmo aberta
localmente.

Quando você hospedar o site em um servidor real (Hostinger, Netlify, GitHub
Pages, etc.) ou abrir através de um servidor local, o `content.json` passa a
ser lido normalmente e qualquer edição nele já aparece na página, sem
precisar tocar em nenhum código.

**Para testar localmente com o `content.json` funcionando de verdade**, rode
um servidor simples na pasta do projeto:

```bash
python3 -m http.server 8000
```

e abra `http://localhost:8000` no navegador.

**Se for continuar editando apenas pelo arquivo local (duplo clique)**,
mantenha o `data/content.json` e o objeto `DEFAULT_DATA` em `js/main.js`
sempre com os mesmos valores — copie e cole a mudança nos dois lugares.

## Como trocar as fotos

Substitua os arquivos dentro de `assets/images/` mantendo os mesmos nomes
(ou ajuste o caminho correspondente em `index.html`):

| Arquivo                       | Onde aparece                          |
|-------------------------------|----------------------------------------|
| `hero.jpg`                    | Foto principal do topo                 |
| `sobre-curso.jpg`              | Seção "Sobre o curso"                  |
| `experiencia-1/2/3.jpg`        | Galeria "experiência" (3 fotos)        |
| `ambiente-1/2.jpg`              | Seção "Um intervalo gostoso..."        |
| `vela-formulario.jpg`           | Foto ao lado do formulário             |

## Como editar estilos e classes Tailwind

`css/styles.css` contém os estilos personalizados da marca (cores, botões,
chips, animação de revelação, etc.) — pode editar livremente.

`css/tailwind.css` é **gerado automaticamente** a partir das classes usadas
no `index.html`. Se você adicionar ou remover classes do Tailwind no HTML
(ex: `text-2xl`, `grid-cols-3`), recompile assim:

```bash
cd build
npm install
npm run build
```

Isso atualiza `css/tailwind.css` com as classes corretas. Não é necessário
fazer isso para editar apenas textos do `content.json` ou trocar imagens.

## Formulário de inscrição

O botão "Quero participar" envia os dados diretamente para o Google Forms
por POST em um iframe oculto, sem redirecionar a visitante. O endpoint fica definido em
`data/content.json` → `form.googleFormAction`. Atualmente:

```
https://docs.google.com/forms/d/e/1FAIpQLSeXjSrhtcs1ZSEsIRyGsXXQ7t3UksM0sWoQd7LLiKjoq_BSSA/formResponse
```

Para trocar o formulário, atualize esse valor, os nomes `entry.*` dos campos
no `index.html` e, se for o caso, o mesmo campo dentro de `DEFAULT_DATA` em
`js/main.js`, pelo motivo explicado acima.

O Google Forms precisa estar aceitando respostas. Se o formulário estiver
fechado, exigindo login ou com a turma marcada como completa, o Google retorna
erro no `formResponse` e a página não consegue registrar a inscrição.
