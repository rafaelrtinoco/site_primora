# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este arquivo é escrito em pt-BR, como o resto do projeto. Caminhos, comandos, identificadores de código e tokens de design ficam no original.

## Projeto

Calculadora de custos e precificação para impressão 3D (pt-BR), em página única. React 19 + Vite + TypeScript + Tailwind CSS v4 + framer-motion. Sem backend, sem router, sem runner de teste.

O público é quem está começando em impressão 3D e quer saber quanto cobrar. Isso é restrição de produto, não observação: a página é organizada em **dois passos numerados** porque abrir com sete campos e três tabelas de comissão afasta exatamente essa pessoa.

- **Passo 1, custo da peça** (`id="calculadora"`): filamento, hora de máquina e reserva para falhas viram o custo real, mais um preço para venda direta, sem marketplace.
- **Passo 2, preço no marketplace** (`id="precificador"`): comissão, taxa por item e imposto entram na conta e devolvem o preço de anúncio. Recebe o custo do passo 1 pronto.

### Este repositório já foi outra coisa

Até outubro de 2026 a página era a landing da **Praxis Digital**, uma agência de marketing digital. O projeto mudou de rumo e a calculadora tomou o lugar do site.

**As seções de marketing não foram apagadas, apenas tiradas da composição.** São 21 arquivos órfãos em `src/`, sem nenhuma referência a partir de `main.tsx`, preservados caso algo precise voltar. Isso tem duas consequências práticas:

1. **`tsc -b` ainda checa esses arquivos**, então eles precisam continuar compilando. Quebrar um tipo que só eles usam derruba o `build`.
2. **Ao mapear a arquitetura, eles são ruído.** A marca Praxis segue no logo, no rodapé e nas páginas legais, e isso é intencional: a dona da ferramenta é a mesma empresa.

A lista está em "O que ficou órfão", abaixo.

## Comandos

```bash
npm install
npm run dev         # Vite dev server
npm run build       # tsc -b && check:copy && vite build (checa tipos primeiro)
npm run check:copy  # scripts/check-copy.mjs: sem travessão, jargão ou placeholder conhecido em texto visível
npm run gen:glyphs  # regenera src/lib/brandGlyphs.ts a partir do simple-icons
npm run lint        # eslint .
npm run preview
```

Não há teste. A verificação é `build` + `lint` + conferência manual (ver abaixo), e para a matemática há uma receita de verificação descrita em "Como conferir a conta".

Não existe um `npm run typecheck` isolado: a checagem de tipos é a etapa `tsc -b` de dentro do `build`. O `.claude/settings.json` pré-autoriza `Bash(npm run typecheck:*)` de qualquer forma (é boilerplate do starter pack, ver "Ferramental que não é do site"); rodar só devolve "missing script".

`npm run gen:glyphs` **não tem mais consumidor na página**: `src/lib/brandGlyphs.ts` só era lido pela seção Ferramentas, hoje órfã. O script continua funcionando e o arquivo continua válido, mas regenerá-lo não muda nada no que vai ao ar.

## Arquitetura

`src/main.tsx` → `src/App.tsx` → `src/pages/Home.tsx`. O `Home.tsx` compõe: `Navbar` → `HeroCalculadora` → `Calculadora` → `Footer` → `CookieConsent`. A navegação é só por âncora na mesma página.

**São duas seções, mas um componente só na composição.** `Calculadora.tsx` devolve um Fragment com a própria `<Section>` mais `<Precificador custoProducao={custo.custoTotal} />`. Duas `<Section>` irmãs, nunca aninhadas: cada uma é dona do próprio ritmo vertical e do próprio fundo.

**O custo desce como prop, de propósito.** O projeto tem um contrato de `CustomEvent` com prefixo `praxis:` (ver `src/lib/consent.ts`), mas a regra desse contrato é que evento serve para **enriquecimento, nunca para dependência**. O `Precificador` existe em função do custo do passo 1, então prop é o caminho honesto. Não troque por evento.

O fluxo é de mão única: o custo desce, o preço sugerido não sobe. Ligar os dois lados criaria laço de atualização difícil de ler.

Três camadas em `src/`:

- **`src/components/ui/`**: primitivos, sem copy dentro. `Section`, `SectionHeader`, `Button`, `IconFrame`, `Reveal`/`RevealGroup`/`RevealItem`, `estilosCompartilhados.ts`.
- **`src/components/calculadora/`**: a ferramenta. `Calculadora` (estado do passo 1), `Precificador` (passo 2), `SeletorImpressora`, `CampoNumero`, `CampoSelect`, `HeroCalculadora`.
- **`src/lib/` e `src/content/`**: a conta e os dados, sem React.

### A conta vive em `src/lib/calculadora.ts`

**Tudo ali é função pura, sem React e sem DOM.** É o que permite conferir um cálculo lendo uma função só, em vez de caçar a conta no meio de um componente, e é o que torna a matemática verificável fora do navegador. Mantenha assim: componente formata, `calculadora.ts` calcula.

Convenção de unidade, para não se perder: peso em gramas, preço do rolo em reais por quilo, tempo em horas, e **percentual de entrada em pontos** (`10` significa 10%), porque é como o usuário digita. As frações (`0.14`) ficam contidas em `marketplaces.ts`.

Quatro funções importam:

- `calcularCusto` — filamento + máquina + reserva para falhas, e o preço sugerido para venda direta.
- `calcularCustoHora` — energia + depreciação, a partir do modelo de impressora.
- `calcularPrecoSugerido` — o passo 2, pelo método do divisor.
- `calcularPlataforma` — quanto sobra num preço dado. **Hoje sem chamador**, ver "O que ficou órfão".

#### A regra que não pode ser quebrada: é divisão, não soma

Comissão, imposto e margem incidem todos sobre o **preço de venda**, que é justamente a incógnita. Somar a margem ao custo e deixar a plataforma descontar o percentual depois dá prejuízo:

```
errado:  custo 40 + 20% = 48, comissão de 20% sobre 48 = 9,60, imposto 6% = 2,88  →  sobra -4,48
certo:   40 / (1 - 0,20 - 0,06 - 0,20) = 74,07, comissão 14,81, imposto 4,44       →  sobra 14,81 = 20% de 74,07
```

Por isso a margem em `calcularPrecoSugerido` é **margem sobre o preço de venda** (margem de contribuição), e não markup sobre o custo. São coisas diferentes, e confundi-las é o erro mais comum deste tipo de planilha. O painel de resultado mostra a "margem conferida" no fim justamente para a conta se provar sozinha: se ela não bater com a margem pedida, o cálculo está errado e fica visível.

Quando a soma dos percentuais chega a 100%, não existe preço possível: cada real a mais de preço vira taxa e margem na mesma proporção. A função devolve `viavel: false` em vez de preço negativo ou `Infinity`, e a interface explica em vez de mostrar `R$ 0,00`.

#### A faixa de taxa depende do preço, que depende da faixa

Shopee e TikTok Shop cobram por faixa de preço, e o preço é o que estamos calculando. `calcularPrecoSugerido` resolve iterando: calcula com uma faixa, reavalia a faixa no preço obtido, repete até estabilizar, com teto de 8 voltas.

Normalmente converge em duas ou três. Quando não converge, o motivo é real e não é bug: **no degrau dos R$ 80 da Shopee a comissão cai de 20% para 14% mas a taxa por item sobe de R$ 4 para R$ 16**, e existe uma faixa de preço inalcançável entre as duas. Nesse caso a função marca `faixaInstavel: true` e a interface avisa. Não "conserte" isso escolhendo uma faixa em silêncio.

#### Watt é consumo médio medido, nunca potência de placa

`consumoPlaW` em `src/content/impressoras.ts` é a **média medida durante a impressão**. A distinção vale dez vezes o resultado: a Bambu Lab A1 tem pico de 1.100 W ao aquecer a mesa e média de 95 W imprimindo PLA. Usar o número da etiqueta infla o custo de energia em mais de 10x.

O multiplicador por material em `MULTIPLICADOR_MATERIAL` **sai de medição do fabricante, não de estimativa**, e é por isso que cada impressora carrega um campo `fechada`:

- A1, quadro aberto: 200 W em ABS contra 95 W em PLA, ou seja 2,11x.
- P1S, câmara fechada: 140 W contra 105 W, ou seja 1,33x.

A diferença entre os dois é literalmente a câmara, que segura o calor e faz a mesa reaquecer menos. O PETG é o único interpolado, e está marcado como estimativa na interface. Se for mexer nesses fatores, mexa com medição na mão.

### Conteúdo com procedência

`src/content/impressoras.ts` e `src/content/marketplaces.ts` seguem a mesma regra: **número aqui dentro não é chute**. Cada entrada carrega de onde veio, e as plataformas carregam `vigenteDesde` e `fonte`, que a interface mostra ao usuário. Tarifa sem data é tarifa que envelhece em silêncio.

As três plataformas mudaram de regra em 2026 (Shopee em 1/3, Mercado Livre em 2/3, TikTok Shop em 15/7) e as fontes públicas divergem em detalhes. Por isso **toda taxa é editável na interface**: a comissão do Mercado Livre varia de 10% a 19% por categoria e tipo de anúncio, e a tarifa por unidade virou variável por peso e dimensão. Nenhum valor fixo acerta todos os casos, e o padrão existe como ponto de partida.

Só FDM de filamento. **Impressora de resina ficou de fora de propósito**: resina é vendida em frasco e fatiada por mililitro, então os campos "peso em gramas" e "preço do rolo de 1 kg" dariam número sem sentido. O motivo está escrito no topo do arquivo para ninguém "corrigir" a ausência depois.

`src/content/site.ts` é herança da landing e **só continua no grafo porque o `Footer` lê `site.contato`**. A regra antiga dele ainda vale para o que sobrou: campo `null` ou lista vazia significa dado não confirmado, e o bloco que consome não renderiza. O `src/lib/planoSelecionado.ts` idem: está vivo apenas porque `site.ts` importa uma constante dele.

### O que ficou órfão

21 arquivos em `src/` sem referência a partir de `main.tsx`. O Vite os remove da build, então eles não pesam no bundle, mas o `tsc -b` ainda os checa.

- **Seções da antiga landing**: `Hero`, `Solutions`, `Trafego`, `Ia`, `Ferramentas`, `Process`, `Plans`, `Testimonials`, `Faq`, `CTA`.
- **Contato e atendimento**: `WhatsAppFab`, `ceci/CeciChat`, `triagem/BotTriagem`, `triagem/useTriagem`, `lib/whatsapp.ts`. Saíram porque a mensagem pré-escrita falava de planos que a página não oferece mais.
- **Cena 3D**: `ferramentas/CenaFerramentas`, `ferramentas/construirCena`, `lib/brandGlyphs.ts`.
- **Primitivos sem uso atual**: `ui/Counter`, `ui/WhatsAppIcon`.
- **Da própria calculadora**: `calculadora/CartaoPlataforma`, que mostrava quanto sobra em cada plataforma. Saiu do passo 1 porque três cartões de marketplace competiam com a conta principal e confundiam quem está começando. `calcularPlataforma` em `calculadora.ts` é a função que o alimentava, hoje também sem chamador.

**`three` continua no `package.json` e fora do bundle.** Só `construirCena.ts` o importa, e ele está órfão. Se alguma coisa voltar a referenciar a cena, a regra antiga volta a valer: `three` nunca pode cair no chunk principal, e o acesso tem que ser por `React.lazy`, condicionado a viewport, movimento reduzido e suporte a WebGL.

## Regras de interface

**O estilo é Tailwind v4, CSS-first.** Todos os tokens vivem no bloco `@theme` de `src/index.css`. Não existe `tailwind.config.js` e nenhum deve ser adicionado: o v4 com `@tailwindcss/postcss` não carrega esse arquivo sozinho, então um config seria código morto em silêncio e uma segunda fonte de verdade.

**A paleta é cinco cores de marca mais quatro tons derivados.** `#ffffff`, `#171915`, `#2e3823`, `#070905`, `#DBEB17`, expostos como `carbon-950/900/800`, `moss-700/600` e `acid-400/500/800`, com tokens semânticos em cima (`ink-strong/body/muted/accent`, `on-dark*`, `surface*`, `line*`). Os namespaces evitam de propósito os `lime-*`/`stone-*` do próprio Tailwind: sobrescrever um namespace nativo repintaria em silêncio qualquer classe legada, enquanto qualquer `brand-*`/`blue-*`/`gray-*` sobrevivente é legado que aparece limpo num grep. `--color-danger-*` é a única cor fora da paleta, e é funcional (estado de erro), nunca decorativa.

**A regra de cor mais importante de todas: `#DBEB17` tem 1,32:1 sobre branco.** Nas seções claras ele nunca é texto, nunca é ícone fino, nunca é borda: aparece só como *preenchimento*, com `carbon-950` em cima (15,15:1). O acento textual no claro é `ink-accent` (#5a6b00, 5,94:1) ou `moss-700` (12,31:1). Nas superfícies escuras o limão dá 15,15:1 / 13,86:1 / 9,33:1 e é o acento em tudo.

**A página inteira é escura hoje.** `Section` tem `tone="dark"` por padrão e cinco tons no total (`light`, `muted`, `dark`, `darkAlt`, `moss`); a calculadora usa `dark` no passo 1 e `darkAlt` no passo 2, só para separar os dois. Como não sobrou nenhuma seção clara na composição, **todo `text-acid-*` do código ativo está sobre fundo escuro**, que é o que torna o limão legítimo como texto ali.

**Prejuízo não é sinalizado só por cor.** Quando o lucro fica negativo, o número usa `text-danger-border` e não `text-danger-ink`: o ink é escuro demais sobre `carbon-950`, dá cerca de 2:1. E o rótulo acima muda para "Prejuízo", com aviso em texto logo abaixo, porque cor sozinha não atende 1.4.1 do WCAG.

**Campo de formulário tem duas variantes**, em `src/components/ui/estilosCompartilhados.ts`: `campoClasses` para fundo claro e `campoClassesEscuro` para fundo escuro. A calculadora usa a escura. Não escreva classe de input à mão.

`CampoNumero` guarda o valor **como string, nunca como number**. Com number o campo não pode ficar vazio, e apagar o conteúdo para digitar outro valor viraria um `0` teimoso no meio da edição. A conversão acontece uma vez, em `lerNumero`, na hora de calcular, e aceita vírgula como separador decimal. `inputMode="decimal"` abre o teclado numérico no celular sem recorrer a `type="number"`, que traz setinha de incremento e rejeita vírgula em parte dos navegadores.

**Ajuste fino fica atrás de um botão, não na tela.** O padrão se repete em três lugares (taxas por plataforma, energia e depreciação): botão com `aria-expanded` e `aria-controls`, painel fechado por padrão. É o que mantém a tela com dois ou três campos para quem está começando, sem tirar precisão de quem quer. Campo vazio nesses painéis significa "usa o padrão", nunca zero.

**Raio e elevação são tokens próprios**, pelo mesmo motivo dos namespaces de cor: redefinir `--radius-lg` repintaria em silêncio qualquer `rounded-lg` legado, sem aparecer no diff. `--radius-control` (pílula, para botão e badge), `--radius-frame` (14px, moldura de ícone e input), `--radius-card` (18px) e `--radius-panel` (24px) são os únicos raios a usar. A elevação é `--shadow-e1/e2/e3`, e **nada passa de e3**: esse teto é o que faz de `shadow-2xl` uma violação de regra, não uma questão de gosto. `.card` (claro) e `.card-dark` (escuro), em `@layer components`, são as superfícies padrão; no escuro a separação vem de borda mais um fundo levemente mais claro, e não de sombra, porque sombra não se lê sobre `carbon-950`.

**Os arquivos de logo são coloridos** (wordmark limão e "P" com gradiente). O logo antigo da Primora era azul-marinho chapado e precisava de `brightness-0 invert` sobre superfície escura; **aplicar esse filtro nos arquivos atuais achata o gradiente num borrão branco.** Escolha o arquivo adequado à superfície: `praxis-horizontal-lime.png` no escuro, `praxis-horizontal-escuro.png` no claro.

**Dois arquivos de `public/` são derivados, não masters da marca.** `praxis-favicon.png` (96px) é o ícone da aba e `praxis-simbolo-720.webp` é o símbolo decorativo atrás do título do Hero. Os dois saem de `praxis-simbolo.png`, o master de 1080px, que pesa 567 kB. Se a marca mudar, regere os derivados, e não aponte a marcação de volta para o master.

**Outros seis arquivos de `public/`** (`praxis-simbolo-mono.png`, `praxis-vertical-lime.png`, `praxis-vertical-escuro.png`, `praxis-wordmark-lime.png`, `praxis-wordmark-escuro.png`, `praxis-wordmark-branco.png`, cerca de 740 kB) não têm referência em `src/` nem nas páginas legais. O Vite copia tudo de `public/` para `dist/`, então eles vão para produção sem estar linkados. Trate como kit de marca mantido de propósito, não como peso morto para apagar de primeira.

**`calculadora.png`, na raiz, está no `.gitignore`.** É a captura de referência usada para desenhar a ferramenta, e traz um e-mail visível na interface capturada. O repositório é público: não commite esse arquivo nem outros prints do mesmo tipo.

Não introduza: gradiente em botão ou em texto, fundo com `filter: blur()`, `rounded-3xl`/`shadow-2xl`, `transition-all`, nem paleta decorativa por card. Tudo isso foi removido de propósito: era o que fazia o site parecer gerado por IA.

**Ícones.** Sempre pelo `<IconFrame>`, que escala o tamanho do Phosphor junto com a moldura. `@phosphor-icons/react` com `weight="duotone"`; é a camada duotone que dá massa ao ícone, em vez do traço fino de 1,5px.

### Animação

O `<MotionConfig reducedMotion="user">` do `App.tsx` resolve `prefers-reduced-motion` de forma global **só para o framer-motion**. Use `<Reveal>`/`<RevealGroup>` em vez de escrever `initial`/`whileInView` à mão.

Para escalonar a entrada de uma lista, use `staggerDelay` de `src/lib/motion.ts`, que já tem teto embutido (`Math.min(index, max)`, no máximo 0,30s). Era o `index * 0.1` sem teto que fazia o último card de uma grade de dez aparecer quase 1s depois dos outros.

**Quatro animações são declaradas em CSS e por isso ficam fora do alcance do MotionConfig**: `.hero-mesh`, `.hero-symbol`, `.marquee-track` e `scroll-behavior`. Cada uma carrega seu próprio `@media (prefers-reduced-motion: no-preference)` no `index.css`. Toda animação nova em CSS precisa fazer o mesmo: `grep -o "prefers-reduced-motion" dist/assets/*.css | wc -l` tem que casar com o número de animações em CSS (hoje 4). Use `grep -o | wc -l`, e não `grep -c`: o CSS buildado é minificado numa linha só, então `grep -c` conta essa linha e imprime `1` independente de quantas consultas sobreviveram.

Das quatro, `.marquee-track` **não tem mais consumidor**: a faixa de setores vivia no `Hero` antigo, hoje órfão. `HeroCalculadora` usa `.hero-mesh` e `.hero-symbol`.

**Espaçamento e âncora pertencem ao `<Section>`**: é ele que define o ritmo vertical e o `scroll-mt` que compensa a navbar fixa. Não coloque `py-*` direto numa seção.

### Escada de z-index

Colisão aqui é invisível até duas camadas se empilharem, então mantenha qualquer novo elemento fixo ou sticky fora destes valores: navbar (`z-50`) → FAB do WhatsApp (`z-[85]`, órfão) → painel de chat da Ceci (`z-[86]`, órfão) → banner de cookie (`z-[90]`) → diálogo de preferências (`z-[95]`) → link de pular para o conteúdo (`z-[100]`).

Os painéis de resultado usam `lg:sticky lg:top-28`, sem z-index próprio: eles grudam dentro do fluxo da seção e não disputam com nada da escada.

### Voz

A copy é pt-BR, segunda pessoa (`você`), frases curtas, sem travessão em nada que o visitante leia (texto em JSX, `alt`, `aria-label`, `meta description`). Comentário de código está isento, porque não é texto visível, **exceto no `index.html`**: a remoção de comentário do `check-copy.mjs` só entende sintaxe de JS (`//`, `/* */`), não o `<!-- -->` do HTML, então travessão dentro de comentário HTML ali continua reprovando o check.

O `scripts/check-copy.mjs` (`npm run check:copy`, ligado no `build`) aplica a regra do travessão, uma lista de jargão proibido ("solução completa", "excelência", "parceiro estratégico"...) e duas regras de placeholder conhecido (um telefone `99999-9999` e "João Silva"), varrendo `src/**/*.{ts,tsx}` e `index.html`. **Não varre `public/*.html`**, então as páginas legais ficam por sua conta.

Com o público sendo iniciante, há uma regra a mais: **jargão de marketplace não abre a página**. O hero já trouxe "20% + R$ 4 até R$ 79,99" e isso cobra um repertório que essa pessoa ainda não tem. Tabela de taxa vive no passo 2, onde o contexto já foi construído.

Dois subagentes em `.claude/agents/` carregam o conjunto completo de regras de copy: `copywriter-conversao` para reescrever texto e `landing-page-cro` para estrutura de conversão por seção. Os dois foram escritos para a antiga landing de agência, então conhecem regras de claim e prova social que já não se aplicam aqui: use o julgamento ao acionar.

## Consentimento (LGPD) e páginas legais

`src/lib/consent.ts` é um portão construído antes do que ele controla: o site carrega **zero** analytics e zero pixel, e o `CookieConsent.tsx` diz isso ao usuário. A regra do cabeçalho do módulo continua valendo: **nenhum script de categoria opcional (`analise`, `marketing`) pode carregar antes de `getConsent(categoria)` devolver `true` para ela.** Adicionar GA ou Meta Pixel nunca é uma tag `<script>` no `index.html`: é carregamento condicional atrás do `getConsent`.

`VERSAO_CONSENTIMENTO` tem que subir sempre que as categorias rastreadas mudarem; subir invalida toda escolha armazenada, o que é correto. O `lerConsentimento` trata `localStorage` bloqueado como "ainda não decidiu" em vez de lançar erro, então o banner reaparece na próxima visita no lugar de quebrar a página. O painel de preferências é modal de verdade: foco preso, `Esc` para fechar, foco devolvido a quem abriu.

**A calculadora não coleta nada.** Os números digitados são processados no navegador e nunca saem dele: não há servidor, não há formulário, não há cadastro. Isso não é só arquitetura, é a premissa em que a Política de Privacidade está escrita. **Qualquer mudança que passe a transmitir dado do usuário exige reescrever `public/privacidade.html` junto, no mesmo commit.**

As páginas legais são HTML estático em `public/` (`privacidade.html`, `termos.html`), já que adicionar um router para duas páginas de texto é desproporcional. Foram reescritas em 21/10/2026 para descrever a calculadora, e **ainda precisam de revisão de um advogado**, o que está dito no topo das duas.

Dois pontos das páginas legais que valem atenção ao mexer:

- **O Google Fonts está divulgado.** `index.html` e as duas páginas legais carregam Montserrat de `fonts.googleapis.com`, o que entrega o IP do visitante ao Google. Não há cookie de terceiro, mas há esse fluxo, e a política o declara. Se você remover o Google Fonts (servindo a fonte localmente), atualize a seção 3 da política.
- **Os termos têm uma cláusula de estimativa.** A seção 3 do `termos.html` declara que os valores são estimativa, não aconselhamento contábil, e lista as premissas: consumo medido e não de placa, preço de referência das máquinas, taxas na data indicada, alíquota nominal do Simples. **Se mudar uma premissa do cálculo, essa cláusula muda junto.**

**Falta o domínio de produção.** O `og:image` do `index.html` é caminho relativo e não existe `og:url`; Facebook, LinkedIn e WhatsApp descartam caminho relativo ao desdobrar um link, então o link compartilhado sai sem imagem. Um domínio resolve isso.

## Ferramental que não é do site

O repositório carrega um segundo artefato, sem relação com o projeto: o **B2 Tech Claude Code Starter Pack**, um setup genérico de agentes para Python/Flask + Next.js/GCP. `README.md`, `claude-lendo.png`, `.claude-plugin/plugin.json` (`name: b2tech-starter`), `.claude/skills/` e `.claude/hooks/` pertencem a ele. O `README.md` não documenta nada sobre esta calculadora.

`.claude/agents/` é a exceção: `copywriter-conversao`, `landing-page-cro` e `auditoria-tecnica` foram escritos para este repositório, na época da landing.

**As skills dele pressupõem outra stack.** `code-review-b2` aplica checklist de Vertical Slice / DDD / Flask, e `security-check` e `spec-driven-development` partem de um backend que não existe aqui. As `threejs-*` só fazem sentido se a cena 3D voltar.

**Os hooks de `.claude/settings.json` mudam o loop do agente.** `post-edit-format.sh` roda em todo `Write|Edit`: chama `eslint --fix` no arquivo editado e **sai com código 2 quando o eslint falha**, o que chega como erro. Erro de hook logo depois de uma edição normalmente é regra de lint, não arquivo malformado. Ele também chama `npx --no-install prettier`, mas prettier não é dependência aqui, então esse caminho não faz nada: **não há formatador neste repositório** e o estilo é sustentado por convenção. `pre-bash-guard.sh` bloqueia padrões destrutivos de Bash, e `pre-commit-secrets.sh` varre arquivos em stage no commit e no push. Um quarto arquivo, `block-secrets.sh`, está em `.claude/hooks/` mas não está ligado a nenhum hook; ele não roda.

`.claude/skills/commit/SKILL.md` também é boilerplate do starter pack: é o slash command `/commit` genérico.

## Como conferir a conta

Não há runner de teste, mas a matemática é verificável porque está isolada em funções puras. A receita que vem sendo usada:

```bash
# 1. Escreva um arquivo .ts na raiz importando de src/lib/calculadora
# 2. Empacote com o próprio Vite em modo SSR (resolve os imports e o TS):
cat > bundle.temp.mjs <<'EOF'
import { build } from 'vite';
await build({ logLevel: 'error', build: { ssr: 'verifica.temp.ts',
  outDir: 'dist-v-temp', emptyOutDir: true,
  rollupOptions: { output: { entryFileNames: 'v.mjs' } } } });
EOF
node bundle.temp.mjs && node dist-v-temp/v.mjs
rm -rf verifica.temp.ts bundle.temp.mjs dist-v-temp
```

Para componente, o mesmo com `plugins: [react()]`, entrada `.tsx` e `renderToString` de `react-dom/server`: pega erro de runtime e permite afirmar sobre o HTML gerado.

**Não use `node --experimental-strip-types` para importar de `src/`**: o projeto usa import sem extensão, e o type stripping do Node exige `.ts` explícito. Funciona enquanto o import for só de tipo, e quebra assim que virar import de valor.

O que vale a pena afirmar, por experiência: a margem conferida tem que bater com a pedida em qualquer combinação; nenhuma entrada pode produzir `NaN` ou `Infinity` (atenção a vida útil zero e preço zero); os multiplicadores de material têm que reproduzir os watts medidos pelo fabricante; e a faixa resolvida tem que conter o preço que ela mesma produziu, ou estar marcada como instável.

## Verificação manual

```bash
# estes não devem retornar nada além de comentários
grep -rniE "primora" src/ index.html
grep -rnE "(brand|blue|gray|slate|indigo|cyan|emerald)-[0-9]" src/
grep -rn "brightness-0 invert" src/
grep -rnE 'blur-\[|transition-all|rounded-3xl|href="#"' src/

# nenhum analytics ou pixel fora do portão em src/lib/consent.ts
# (um resultado legítimo: setPixelRatio em construirCena.ts, API do Three.js)
grep -rniE "gtag|googletagmanager|fbq|analytics|pixel" src/ index.html

# toda âncora em uso precisa ter destino na página
grep -rhoE "'#[a-z]+'|href=\"#[a-z]+\"" src/pages/Home.tsx src/components/Navbar.tsx \
  src/components/Footer.tsx src/components/calculadora/ | tr -d "'\"" | sed 's/href=//' | sort -u
grep -rhoE 'id="(calculadora|precificador|hero|main)"' src/pages/Home.tsx src/components/calculadora/ | sort -u
```

A checagem de âncora não é zelo: ao tirar as seções de marketing, `Navbar` e `Footer` ficaram com seis links para `id` que deixaram de existir. Link para âncora inexistente não dá erro, ele apenas não rola, e por isso passa despercebido.

```bash
npm run check:copy   # zero travessão, jargão ou placeholder em texto visível
```

Os dois `scripts/*.mjs` resolvem a raiz do projeto com `fileURLToPath`, nunca com `new URL(...).pathname`. Este checkout fica num caminho que contém espaço, e o `.pathname` devolve o `%20` sem decodificar, o que fazia o `check:copy` morrer com `ENOENT` em `src/` e levava o `build` junto.

```bash
# se a cena 3D voltar, three precisa continuar fora do chunk principal
npm run build && grep -c WebGLRenderer dist/assets/index-*.js   # tem que imprimir 0
grep -o "prefers-reduced-motion" dist/assets/*.css | wc -l      # tem que imprimir 4
```

Com zero ocorrências, `grep -c` imprime `0` e sai com código 1. O `0` impresso é o resultado desejado; o status de erro é esperado.

Depois, no navegador: preencher com o exemplo de 120 g e conferir que custo e preço sugerido aparecem nos dois passos; trocar o modelo de impressora e ver o custo da hora mudar; abrir os três painéis de ajuste; forçar prejuízo no passo 2 com margem alta e confirmar o aviso; Tab do topo ao fim (o anel de foco limão tem que ser visível em todo campo, `select` incluso, e `Esc` fecha o menu mobile); larguras 320/768/1024/1440 sem rolagem horizontal; e DevTools → Rendering → `prefers-reduced-motion: reduce` para confirmar que a malha e o símbolo do hero param e que os cálculos seguem funcionando.
