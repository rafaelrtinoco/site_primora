# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este arquivo é escrito em pt-BR, como o resto do projeto. Caminhos, comandos, identificadores de código e tokens de design ficam no original.

## Projeto

Praxis Digital, site de uma página (pt-BR) para uma agência digital. React 19 + Vite + TypeScript + Tailwind CSS v4 + framer-motion. Sem backend, sem router, sem runner de teste.

O público são cinco segmentos de venda consultiva: corretoras de seguros, imobiliárias, contabilidade, advocacia e serviços administrativos. **Quatro dos cinco têm regra própria de publicidade**, e isso é conteúdo, não curiosidade: vive em `site.setores`.

Serviços vendidos: conteúdo e redes sociais, sites e landing pages, arte digital e **gestão de tráfego pago**. A agência vendia antes um apoio operacional para seguros ("assessoria operacional"); esse serviço foi descontinuado e a seção dele deu lugar a `Trafego.tsx`. Não reintroduza.

## Comandos

```bash
npm install
npm run dev         # Vite dev server
npm run build       # tsc -b && check:copy && vite build (checa tipos primeiro)
npm run check:copy  # scripts/check-copy.mjs: sem travessão, jargão ou placeholder conhecido em texto visível
npm run gen:glyphs  # regenera src/lib/brandGlyphs.ts a partir do simple-icons (ver abaixo)
npm run lint        # eslint .
npm run preview
```

Não há teste. A verificação é `build` + `lint` + conferência manual (ver abaixo).

Não existe um `npm run typecheck` isolado: a checagem de tipos é a etapa `tsc -b` de dentro do `build`, acima. O `.claude/settings.json` pré-autoriza `Bash(npm run typecheck:*)` de qualquer forma (é boilerplate compartilhado do starter pack, ver "Ferramental que não é do site"); rodar só devolve "missing script".

## Arquitetura

`src/main.tsx` → `src/App.tsx` → `src/pages/Home.tsx`. O `Home.tsx` compõe todas as seções na ordem de rolagem; a navegação é só por âncora na mesma página.

A ordem é Hero → Solutions → Trafego → Ia → Ferramentas → Process → Plans → Testimonials → Faq → CTA. **Os nomes de arquivo estão em inglês, a copy e parte dos ids de âncora não**: `Solutions.tsx` é a seção "Serviços" (`id="solutions"`), uma das duas exceções em `tone="light"`. `Testimonials` e `Ferramentas` não renderizam nada enquanto as listas correspondentes de `site.ts` estiverem vazias, então uma seção que desapareceu da página normalmente é conteúdo, não bug. A antiga seção FreeAudit foi fundida no `CTA` (mesma mensagem, e o único botão dela rolava até o CTA de qualquer forma) e não deve voltar.

Duas camadas em `src/components/`:

- **`src/components/ui/`**: primitivos, sem copy dentro. `Section`, `SectionHeader`, `Button`, `IconFrame`, `Reveal`/`RevealGroup`/`RevealItem`, `Counter`, `WhatsAppIcon`.
- **`src/components/`**: um arquivo por seção da página, cada um consumindo esses primitivos.

`src/lib/motion.ts` guarda as variantes de animação, o easing e a config de viewport. `src/content/site.ts` guarda todo o conteúdo disputável (contato, setores, métricas, depoimentos, preços de plano e de tráfego).

### Sem backend, sem router

**O formulário de contato é um deep link `wa.me`, não um envio.** O `handleSubmit` do `CTA.tsx` monta o texto da mensagem com `montarMensagem` e chama `window.open` *de forma síncrona, dentro do handler do clique*: nenhum `await` pode ficar antes dessa chamada, ou o navegador bloqueia o popup. A URL resultante também fica em estado, então um popup bloqueado degrada para um botão manual de "abrir WhatsApp" em vez de virar beco sem saída. Um campo honeypot (`_honey`) fica fora da tela por posicionamento absoluto, e não com `display:none`, porque alguns bots tratam o segundo caso de forma especial. Nenhum dado sai do navegador do visitante até ele apertar enviar dentro do próprio WhatsApp, e a Política de Privacidade está escrita sobre essa premissa: não é só escolha de UX.

**A comunicação entre seções usa `CustomEvent` de window com namespace**, porque não há router nem store compartilhada. Dois módulos de `src/lib/` existem só para servir de contrato de evento:

- `planoSelecionado.ts`: `PLANO_EVENT` (`praxis:plano-selecionado`), disparado por Plans e Trafego quando um plano ou faixa de tráfego é clicado, consumido pelo CTA para pré-selecionar o `<select>` de plano do formulário.
- `consent.ts`: `ABRIR_PREFERENCIAS_EVENT`, disparado pelo link de "preferências de cookies" do rodapé, consumido pelo `CookieConsent` para reabrir o painel.

O evento é sempre melhoria, nunca dependência: o `<select>` do CTA continua um controle manual plenamente usável se o evento nunca chegar. Mantenha qualquer sinal novo entre componentes nesse padrão, com o mesmo prefixo `praxis:`.

**Escada de z-index das camadas sobrepostas.** Colisão aqui é invisível até duas camadas realmente se empilharem, então mantenha qualquer novo elemento fixo ou sticky fora destes valores: navbar (`z-50`) → FAB do WhatsApp (`z-[85]`) → painel de chat da Ceci (`z-[86]`, ancorado logo acima do FAB que o abre) → banner de cookie (`z-[90]`) → diálogo de preferências de cookie (`z-[95]`) → link de pular para o conteúdo (`z-[100]`).

### Regras que importam aqui

**O estilo é Tailwind v4, CSS-first.** Todos os tokens vivem no bloco `@theme` de `src/index.css`. Não existe `tailwind.config.js` e nenhum deve ser adicionado: o v4 com `@tailwindcss/postcss` não carrega esse arquivo sozinho, então um config seria código morto em silêncio e uma segunda fonte de verdade.

**A paleta é cinco cores de marca mais quatro tons derivados.** `#ffffff`, `#171915`, `#2e3823`, `#070905`, `#DBEB17`, expostos como `carbon-950/900/800`, `moss-700/600` e `acid-400/500/800`, com tokens semânticos em cima (`ink-strong/body/muted/accent`, `on-dark*`, `surface*`, `line*`). Os namespaces evitam de propósito os `lime-*`/`stone-*` do próprio Tailwind: sobrescrever um namespace nativo repintaria em silêncio qualquer classe legada, enquanto qualquer `brand-*`/`blue-*`/`gray-*` sobrevivente é legado que aparece limpo num grep. `--color-danger-*` é a única cor fora da paleta, e é funcional (estado de erro), nunca decorativa.

**A regra de cor mais importante de todas: `#DBEB17` tem 1,32:1 sobre branco.** Nas seções claras ele nunca é texto, nunca é ícone fino, nunca é borda: aparece só como *preenchimento*, com `carbon-950` em cima (15,15:1). O acento textual no claro é `ink-accent` (#5a6b00, 5,94:1) ou `moss-700` (12,31:1). Nas superfícies escuras o limão dá 15,15:1 / 13,86:1 / 9,33:1 e é o acento em tudo.

**Os botões de ação do WhatsApp usam o limão do tema, não o verde da marca WhatsApp.** A constante `BOTAO_WHATSAPP` do `CTA.tsx` e o FAB do `WhatsAppFab.tsx` eram originalmente `#25D366`/`#1DA851` fixos no código, uma sexta cor fora da paleta; hoje os dois usam `bg-acid-400 text-carbon-950 hover:bg-acid-500`, a mesma combinação da variante primária do `Button` (contraste 15,15:1). Foi escolha deliberada para manter todo botão de ação dentro das cinco cores, mesmo perdendo o reconhecimento imediato do verde do WhatsApp. Não reintroduza `#25D366` para "resgatar a fidelidade da marca" sem falar antes com o dono do projeto.

**Os logos de marca são a única exceção deliberada à paleta de cinco cores, e ela está contida numa seção só.** O `Ferramentas.tsx` extruda o logo real de cada ferramenta do dia a dia (Instagram, Facebook, Meta Ads, Google Ads, Canva, CapCut, WhatsApp) sobre um tile 3D, no hex oficial da marca, inclusive o `#25D366` do glifo do WhatsApp ali, que é aceitável justamente porque identifica uma ferramenta e não é botão de ação. Isso é tratado como o `--color-danger-*`: cor fora da paleta, admitida só por ser funcional. A regra de contenção: a cor de marca aparece **só no glifo do logo** (`src/lib/brandGlyphs.ts`, gerado, ver abaixo). Face do tile, chanfro, luz de borda, fundo do chip, fundo da seção e todo o resto seguem `carbon-*`/`moss-*`/`acid-*`. Não estenda essa exceção para outro lugar sem falar com o dono do projeto.

**A página é predominantemente escura.** O `Section` tem `tone="dark"` por padrão; Serviços e FAQ são as exceções claras declaradas. O `Section` tem cinco tons no total (`light`, `muted`, `dark`, `darkAlt`, `moss`), usados para variação discreta entre seções escuras consecutivas (Process, Testimonials e Trafego usam `darkAlt`; Ia usa `moss`). `<html>` e `<body>` carregam o fundo escuro para o overscroll do iOS não piscar branco.

**Raio e elevação também são tokens próprios**, pelo mesmo motivo dos namespaces de cor: redefinir `--radius-lg` repintaria em silêncio qualquer `rounded-lg` legado, sem aparecer no diff. `--radius-control` (pílula, para botão e badge), `--radius-frame` (14px, moldura de ícone e input), `--radius-card` (18px) e `--radius-panel` (24px) são os únicos raios a usar. A elevação é `--shadow-e1/e2/e3`, e **nada passa de e3**: esse teto é o que faz de `shadow-2xl` uma violação de regra, não uma questão de gosto. `.card` (claro) e `.card-dark` (escuro), em `@layer components`, são as superfícies de card padrão; no escuro a separação vem de borda mais um fundo um pouco mais claro, e não de sombra, porque sombra não se lê sobre `carbon-950`.

**Os arquivos de logo são coloridos** (wordmark limão e "P" com gradiente). O logo antigo da Primora era azul-marinho chapado e precisava de `brightness-0 invert` sobre superfície escura; **aplicar esse filtro nos arquivos atuais achata o gradiente num borrão branco.** Escolha o arquivo adequado à superfície: `praxis-horizontal-lime.png` no escuro, `praxis-horizontal-escuro.png` no claro.

**Dois arquivos de `public/` são derivados, não masters da marca.** `praxis-favicon.png` (96px) é o ícone da aba, e `praxis-simbolo-720.webp` é o símbolo decorativo atrás do título do Hero. Os dois saem de `praxis-simbolo.png`, o master de 1080px, que pesa 567 kB e antes era servido cru para os dois usos: é o maior asset do projeto e nenhum dos dois usos precisa de um pixel dessa resolução. Se a marca mudar, regere os derivados a partir do master, e não aponte a marcação de volta para o master.

**Outros seis arquivos de `public/` (`praxis-simbolo-mono.png`, `praxis-vertical-lime.png`, `praxis-vertical-escuro.png`, `praxis-wordmark-lime.png`, `praxis-wordmark-escuro.png`, `praxis-wordmark-branco.png`, cerca de 740 kB no total) não têm referência nenhuma em `src/` nem nas duas páginas legais.** O Vite copia tudo que está em `public/` para `dist/` de qualquer forma, então eles vão para produção em todo build sem estar linkados. Trate como um kit de marca mantido de propósito, não como peso morto para apagar de primeira; se uma tarefa pedir remoção de asset não usado, confirme antes com o dono do projeto.

Não introduza: gradiente em botão ou em texto, fundo com `filter: blur()`, `rounded-3xl`/`shadow-2xl`, `transition-all`, nem paleta decorativa por card. Tudo isso foi removido de propósito: era o que fazia o site parecer gerado por IA.

**Ícones.** Sempre pelo `<IconFrame>`, que escala o tamanho do Phosphor junto com a moldura. `@phosphor-icons/react` com `weight="duotone"`; é a camada duotone que dá massa ao ícone, em vez do traço fino de 1,5px.

### Animação

O `<MotionConfig reducedMotion="user">` do `App.tsx` resolve `prefers-reduced-motion` de forma global **só para o framer-motion**. Use `<Reveal>`/`<RevealGroup>` em vez de escrever `initial`/`whileInView` à mão.

Para escalonar a entrada de uma lista, use `staggerDelay` de `src/lib/motion.ts`, que já tem teto embutido (`Math.min(index, max)`, no máximo 0,30s). Era exatamente o `index * 0.1` sem teto que fazia o último card de uma grade de dez aparecer quase 1s depois dos outros.

**Quatro animações são declaradas em CSS e por isso ficam fora do alcance do MotionConfig**: `.hero-mesh`, `.hero-symbol` (a marca girando atrás do título), `.marquee-track` (a faixa de setores) e `scroll-behavior`. Cada uma carrega seu próprio `@media (prefers-reduced-motion: no-preference)` no `index.css`. Toda animação nova em CSS precisa fazer o mesmo: `grep -o "prefers-reduced-motion" dist/assets/*.css | wc -l` tem que casar com o número de animações em CSS (hoje 4). Use `grep -o | wc -l`, e não `grep -c`: o CSS buildado é minificado numa linha só, então `grep -c` conta essa linha e imprime `1` independente de quantas consultas sobreviveram.

O `Counter` é a outra exceção: ele lê `useReducedMotion()` direto, porque precisa saltar para o valor final em vez de animar mais devagar.

A cena 3D de Ferramentas é mais uma exceção: o loop de `requestAnimationFrame` dela é JS puro guiado pelo Three.js, não framer-motion, então o `MotionConfig` também não a alcança. Ver "A cena 3D de Ferramentas", abaixo, para como ela é pausada.

**Espaçamento e âncora pertencem ao `<Section>`**: é ele que define o ritmo vertical e o `scroll-mt` que compensa a navbar fixa. Não coloque `py-*` direto numa seção.

### A cena 3D de Ferramentas

`Ferramentas.tsx` (entre `Ia` e `Process`) é a única seção com canvas WebGL: as sete ferramentas que a agência opera no dia a dia, como logos extrudados em tiles que orbitam devagar, feito com Three.js puro em vez de react-three-fiber. Uma dependência em vez de três, e controle direto do loop de render, que é exatamente o que tem que parar sob movimento reduzido, fora da tela e com a aba oculta.

**O `three` não pode cair no bundle principal.** O único `import * as THREE from 'three'` do projeto está em `src/components/ferramentas/construirCena.ts`. O `src/components/ferramentas/CenaFerramentas.tsx` é a fronteira do chunk: ele importa `construirCena` e o `Ferramentas.tsx` só chega nele por `React.lazy(() => import(...))`, condicionado a `useInView`, `!useReducedMotion()` e uma checagem de suporte a WebGL. Depois de mexer em qualquer coisa aqui, confirme com `npm run build && grep -c WebGLRenderer dist/assets/index-*.js`, que tem que imprimir `0`. O símbolo só deve existir no chunk separado `CenaFerramentas-*.js`.

**Ferramenta sem glifo desaparece da cena, sem erro nenhum.** O `Ferramentas.tsx` monta a lista da cena com `site.ferramentas.filter((f) => f.slug in brandGlyphs)`. Se você adicionar uma ferramenta em `site.ts` sem rodar `npm run gen:glyphs`, ela ganha um chip na lista de baixo (sem glifo, porque o componente `Glifo` devolve `null` para slug desconhecido) e **nenhum tile na cena 3D**, em silêncio. Mexer na lista de `site.ferramentas` implica mexer em `MARCAS`/`FALLBACKS` de `scripts/gen-brand-glyphs.mjs` e rodar o gerador.

**A camada acessível dessa seção não é a cena.** O host da cena é `aria-hidden="true"`, e a `GradeEstatica` (fallback para quem não tem WebGL, para movimento reduzido e para o Suspense) também. Quem carrega a informação é a lista de chips com `aria-pressed` mais o parágrafo `role="status" aria-live="polite"` que descreve a ferramenta ativa, e esses dois existem nos três estados. A cena é decoração; o texto é o conteúdo. Não mova informação para dentro do canvas.

**`src/lib/brandGlyphs.ts` é gerado, não escrito à mão.** O `npm run gen:glyphs` (`scripts/gen-brand-glyphs.mjs`) puxa o SVG oficial e o hex de cada marca da devDependency `simple-icons` (licença CC0-1.0), e cai num glifo Phosphor com `weight="fill"`, colorido com o `acid-400` do tema em vez de um hex de marca, para as ferramentas ausentes desse pacote (hoje Canva e CapCut). Rode o script de novo depois de subir a versão do `simple-icons` ou do `@phosphor-icons/react`; ele lança erro em vez de emitir um tile em branco em silêncio se um slug que ele espera tiver desaparecido. Nunca edite o arquivo gerado à mão.

**Descartar não é opcional.** O StrictMode do React 19 monta todo componente duas vezes em dev. Sem o `renderer.dispose()` / `forceContextLoss()` / descarte de geometria e material explícitos que o `construirCena.ts` roda no `dispose()` que ele devolve, isso cria dois contextos WebGL e vaza o primeiro.

### Política de conteúdo

`src/content/site.ts` é a fonte única de contato, setores, métricas, depoimentos e preços. **Campo `null` ou lista vazia significa que o dado não está confirmado, e o bloco que o consome não deve renderizar.** Nunca coloque um placeholder de aparência plausível no lugar: depoimento inventado, um telefone `(11) 99999-9999` e uma métrica fictícia de "+24%" já foram publicados exatamente assim. Uma claim de nota ou avaliação precisa, além disso, de uma URL em `source`; sem ela é publicidade enganosa, não apenas um problema de design.

Hoje estão `null` ou vazios de propósito: `contato.email` (o atendimento é só por WhatsApp), `contato.telefone`, `redes.*`, `metricas`, `depoimentos`.

Duas claims precisam continuar redigidas com precisão:

- **Tráfego pago.** O fee de gestão e a verba de mídia são separados, e o site diz isso. A verba o cliente paga direto para Google ou Meta, na conta dele. `trafego.verbaMinima` é apresentada como recomendação, não como exigência.
- **IA.** A agência usa IA *no processo próprio*: pesquisa, primeiro rascunho, leitura de números, com uma pessoa aprovando o que vai ao ar. O chatbot de WhatsApp incluído nos planos é um **fluxo de resposta fixa, não um agente de IA**, e o `Ia.tsx` diz isso explicitamente. A copy nunca pode misturar os dois.

**O preço é um valor de partida por bloco, não preço por card.** `precoInicialPlanos` e `trafego.precoInicial` aparecem uma vez cada, no cabeçalho da respectiva seção. Os cards não mostram preço individual, por decisão registrada no próprio `site.ts`: o valor final sai do diagnóstico gratuito, e fixar um número por card obrigaria a agência a honrar um preço antes de conhecer o escopo real. A flag `sobMedida` (hoje só no plano PERSONALIZADO) esconde qualquer preço e troca o rótulo do CTA para "Montar meu plano". Não "devolva os preços aos cards" sem falar com o dono do projeto.

As páginas legais são HTML estático em `public/` (`privacidade.html`, `termos.html`), já que adicionar um router para duas páginas de texto é desproporcional. As duas ainda têm campos `[A DEFINIR]` e precisam de revisão de um advogado. O mesmo dado que falta bloqueia uma segunda coisa: o `og:image` e o `og:url` do `index.html` são caminhos relativos, e Facebook, LinkedIn e WhatsApp descartam caminho relativo ao desdobrar um link compartilhado, então hoje o link é compartilhado sem imagem. Um domínio de produção resolve ao mesmo tempo os campos `[A DEFINIR]` e as tags Open Graph.

**Voz.** A copy é pt-BR, segunda pessoa (`você`), frases curtas, sem travessão em nada que o visitante leia (texto em JSX, `alt`, `aria-label`, `meta description`). Comentário de código está isento, porque não é texto visível, **exceto no `index.html`**: a remoção de comentário do `check-copy.mjs` só entende sintaxe de comentário de JS (`//`, `/* */`), não o `<!-- -->` do HTML, então um travessão ou palavra proibida dentro de comentário HTML ali continua reprovando o check. O `scripts/check-copy.mjs` (`npm run check:copy`, ligado no `build`) aplica a regra do travessão, uma lista de jargão proibido ("solução completa", "excelência", "parceiro estratégico"...) e duas regras de placeholder conhecido (um telefone `99999-9999` e "João Silva"), varrendo `src/**/*.{ts,tsx}` e `index.html`, e pulando linha de comentário. Dois subagentes em `.claude/agents/` carregam o conjunto completo de regras: `copywriter-conversao` para reescrever copy, `landing-page-cro` para estrutura de conversão por seção (promessa → prova → oferta → objeção → ação). Os dois já conhecem as duas claims não negociáveis acima e a regra da prova social vazia, então acioná-los não exige repetir este arquivo.

O `README.md` não documenta nada sobre este site: ele é o README do B2 Tech Claude Code Starter Pack, que pega carona neste repositório. Ver "Ferramental que não é do site".

### Consentimento (LGPD)

`src/lib/consent.ts` é um portão construído antes do que ele controla: o site hoje carrega **zero** analytics e zero pixel, e o `CookieConsent.tsx` diz isso ao usuário. A regra do cabeçalho do próprio módulo continua valendo para qualquer adição futura: **nenhum script de categoria opcional (`analise`, `marketing`) pode carregar antes de `getConsent(categoria)` devolver `true` para ela.** Adicionar GA ou o Meta Pixel, portanto, nunca é uma tag `<script>` jogada no `index.html`: é um carregamento condicional ao consentimento, atrás do `getConsent`.

`VERSAO_CONSENTIMENTO` tem que subir sempre que as categorias rastreadas mudarem; subir invalida toda escolha armazenada, o que é correto: um consentimento dado sob outro conjunto de categorias (ou, como aconteceu no rebrand Primora → Praxis, sob outro controlador de dados) não se transfere. O `lerConsentimento` trata um `localStorage` bloqueado ou indisponível como "ainda não decidiu", em vez de lançar erro, então o banner simplesmente reaparece na próxima visita no lugar de quebrar a página. O painel de preferências é um modal de verdade: foco preso, `Esc` para fechar, e foco devolvido a quem o abriu ao fechar.

## Ferramental que não é do site

O repositório carrega um segundo artefato, sem relação com o site: o **B2 Tech Claude Code Starter Pack**, um setup genérico de agentes para projetos Python/Flask + Next.js/GCP. `README.md`, `claude-lendo.png`, `.claude-plugin/plugin.json` (`name: b2tech-starter`), `.claude/skills/` e `.claude/hooks/` pertencem a ele, não a este site. Quando o assunto é mapear a arquitetura do site, esses caminhos são ruído.

`.claude/agents/` é a exceção: `copywriter-conversao`, `landing-page-cro` e `auditoria-tecnica` foram escritos para este projeto. Os dois primeiros estão descritos em "Voz", acima; `auditoria-tecnica` roda a varredura de segurança, desempenho e acessibilidade, e sabe quais itens do checklist genérico não se aplicam a uma SPA sem backend.

**As skills dele pressupõem outra stack.** `code-review-b2` aplica um checklist de Vertical Slice / DDD / Flask, e `security-check` e `spec-driven-development` partem de um backend que não existe aqui. Acioná-las nesta base revisa o código contra o critério errado. As skills `threejs-*` são as que têm uso plausível, em Ferramentas.

**Os hooks de `.claude/settings.json` mudam de fato o loop do agente, então vale saber o que eles fazem.** O `post-edit-format.sh` roda em todo `Write|Edit`: chama `eslint --fix` no arquivo editado e **sai com código 2 quando o eslint falha**, o que chega ao Claude como erro. Um erro de hook logo depois de uma edição normalmente é regra de lint, não arquivo malformado. Ele também chama `npx --no-install prettier`, mas o prettier não é dependência aqui, então esse caminho não faz nada em silêncio: **não há formatador neste repositório** e o estilo é sustentado por convenção. O `pre-bash-guard.sh` bloqueia padrões destrutivos de Bash (`rm -rf /`, `curl | sh`, `git push --force origin main`, `DROP TABLE`) antes de rodarem, e o `pre-commit-secrets.sh` varre os arquivos em stage no `git commit`/`git push`. Um quarto arquivo, `block-secrets.sh`, está em `.claude/hooks/` mas não está ligado a nenhum hook do `settings.json`; ele não roda.

`.claude/skills/commit/SKILL.md` também é boilerplate do starter pack, não é específico do site: é o slash command `/commit` genérico (põe em stage, gera mensagem de conventional commit, commita, nunca faz push).

## Verificação manual

```bash
# estes não devem retornar nada além de comentários
grep -rniE "primora" src/ index.html
grep -rnE "(brand|blue|gray|slate|indigo|cyan|emerald)-[0-9]" src/
grep -rn "brightness-0 invert" src/
grep -rniE "assessor|apólice|sinistro|back-office" src/
grep -rnE 'blur-\[|transition-all|rounded-3xl|href="#"' src/

# todo resultado tem que estar sobre superfície escura: leia, não apenas conte
grep -rn "text-acid\|border-acid\|ring-acid" src/

# número de WhatsApp tem que sair de site.contato.whatsapp, nunca escrito no código
grep -rn "wa.me/[0-9]" src/

# nenhum analytics ou pixel fora do portão de consentimento em src/lib/consent.ts
# (espere um resultado legítimo: setPixelRatio em construirCena.ts, API do Three.js, não rastreamento)
grep -rniE "gtag|googletagmanager|fbq|analytics|pixel" src/ index.html
```

```bash
npm run check:copy   # zero travessão, jargão ou placeholder conhecido em texto visível
```

Os dois `scripts/*.mjs` resolvem a raiz do projeto com `fileURLToPath`, nunca com `new URL(...).pathname`. Este checkout fica num caminho que contém espaço, e o `.pathname` devolve o `%20` da URL sem decodificar, o que fazia o `check:copy` morrer com `ENOENT` em `src/` e levava o `build` junto.

```bash
# o three.js tem que ficar fora do chunk principal, carregando só quando Ferramentas se aproxima da viewport
npm run build && grep -c WebGLRenderer dist/assets/index-*.js   # tem que imprimir 0
```

Com zero ocorrências, o `grep -c` imprime `0` e sai com código 1. O `0` impresso é o resultado desejado; o status de erro é esperado.

Depois: logo legível na navbar antes *e* depois de rolar; Tab do topo até o fim (o anel de foco limão tem que ser visível sobre escuro *e* sobre branco, o FAQ abre, `Esc` fecha o menu mobile, clicar num label foca o input correspondente); larguras 320/768/1024/1440 sem rolagem horizontal (olho na marquee, que sangra de propósito); DevTools → Rendering → emular `prefers-reduced-motion: reduce` e confirmar que a mesh do hero, o símbolo girando, a marquee **e a cena 3D de Ferramentas** param todos (a cena não deve nem carregar o chunk sob movimento reduzido, confira na aba Network), que os contadores mostram o valor final e que o FAQ ainda abre.
