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
- **`src/components/calculadora/`**: a ferramenta. `Calculadora` (estado do passo 1), `Precificador` (passo 2), `SeletorImpressora`, `CampoNumero`, `CampoSelect`, `CampoTempo`, `HeroCalculadora`.
- **`src/lib/` e `src/content/`**: a conta e os dados, sem React.

### A conta vive em `src/lib/calculadora.ts`

**Tudo ali é função pura, sem React e sem DOM.** É o que permite conferir um cálculo lendo uma função só, em vez de caçar a conta no meio de um componente, e é o que torna a matemática verificável fora do navegador. Mantenha assim: componente formata, `calculadora.ts` calcula.

Convenção de unidade, para não se perder: peso em gramas, preço do rolo em reais por quilo, tempo em **horas decimais**, e **percentual de entrada em pontos** (`10` significa 10%), porque é como o usuário digita. As frações (`0.14`) ficam contidas em `marketplaces.ts`.

Tempo é o único caso em que a unidade da interface não é a unidade da conta: a pessoa digita horas e minutos separados, e `lerTempoHoras` converte para decimal na fronteira. Daqui para dentro, `tempoHoras` é sempre decimal.

Quatro funções importam:

- `calcularCusto` — filamento + máquina + reserva para falhas, e o preço sugerido para venda direta.
- `calcularCustoHora` — energia + depreciação, a partir do modelo de impressora.
- `calcularPrecoSugerido` — o passo 2, pelo método do divisor.
- `calcularPlataforma` — quanto sobra num preço dado. **Hoje sem chamador**, ver "O que ficou órfão".

**Formatação e leitura de entrada moram no mesmo módulo, e é intencional.** "Componente formata" quer dizer que ele escolhe onde o número aparece, não que ele monta a string: `formatarBRL`, `formatarPct`, `formatarDuracao`, `lerNumero` e `lerTempoHoras` são as únicas portas de entrada e saída. Os `Intl.NumberFormat` são instanciados uma vez no escopo do módulo, porque construir um por render é caro. Nunca escreva `R$ ${valor.toFixed(2)}` num componente: além de perder o separador pt-BR, cria uma segunda formatação para divergir da primeira. O `.toFixed(2).replace('.', ',')` que aparece em dois `placeholder` do `Precificador` é a exceção, e é só porque placeholder não é resultado.

**Nenhuma função devolve `NaN` ou `Infinity`, e o guarda é uma só.** O helper privado `numero()` zera tudo que não seja finito e positivo, e é por onde passa cada entrada antes de entrar em qualquer conta. Isso significa que **valor negativo é silenciosamente tratado como zero**, o que é a escolha certa num formulário de texto livre, e que vida útil zero não vira divisão por zero (`calcularCustoHora` devolve depreciação 0). Se você adicionar um campo, passe pelo `numero()`.

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

Normalmente converge em duas ou três. Quando não converge, o motivo é real e não é bug, e a função marca `faixaInstavel: true` para a interface avisar. Não "conserte" isso escolhendo uma faixa em silêncio.

**Quem não converge é o Mercado Livre, não a Shopee.** A intuição manda olhar para o degrau dos R$ 80 da Shopee, onde a comissão cai de 20% para 14% e a taxa por item sobe de R$ 4 para R$ 16, mas varrendo custo, embalagem, margem e imposto nas três plataformas aparecem **3.042 casos no Mercado Livre e zero na Shopee e no TikTok Shop**. O motivo é que no Mercado Livre a comissão é 14% dos dois lados e só a taxa por item muda, de R$ 6,50 para zero acima de R$ 79: cobrir os R$ 6,50 empurra o preço para cima de R$ 79, onde a taxa não existe, e sem ela o preço cai de volta para baixo de R$ 79. Repro com os valores padrão da interface: Mercado Livre, custo R$ 50, margem 20%, imposto 0, que devolve R$ 75,76 com taxa por item R$ 0,00.

**Nesse estado o preço sai subestimado, e é por isso que o aviso importa.** `precoVenda` é calculado com a última faixa testada, que pode não ser a faixa em que ele cai: no caso acima, R$ 75,76 cai na faixa que cobra R$ 6,50, mas foi calculado com taxa zero. Qualquer texto que descreva esse aviso precisa dizer isso, e não pode atribuir o fenômeno à Shopee.

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

#### `TODO(dono)` não é tarefa sua

O marcador aparece sete vezes (`marketplaces.ts`, `impressoras.ts`, quatro vezes em `site.ts` e uma no `index.html`) e tem um significado específico: **é informação que só o dono do negócio pode fornecer**, não dívida técnica para o agente resolver. Conferir a tarifa real da Shopee na central do vendedor, dizer quanto a máquina custou, decidir o domínio de produção, confirmar as URLs de rede social. Preencher um desses com valor plausível transforma um "não confirmado" visível num número que parece verificado, que é exatamente o que a regra de procedência deste repositório existe para evitar. Resolva um `TODO(dono)` só quando o usuário trouxer o dado.

`src/content/site.ts` é herança da landing e **só continua no grafo porque o `Footer` lê `site.nome`, `site.contato` e `site.redes`**; os outros 11 importadores do arquivo estão todos órfãos. A regra antiga dele ainda vale para o que sobrou: campo `null` ou lista vazia significa dado não confirmado, e o bloco que consome não renderiza. O `src/lib/planoSelecionado.ts` idem: está vivo apenas porque `site.ts` importa uma constante dele.

Na prática isso deixa o rodapé com **um canal de contato só**: `email` e `telefone` estão `null`, e as duas redes também, então o único link que renderiza é o do WhatsApp (`5511962660439`). **Esse número é o mesmo que `public/privacidade.html` declara como canal do titular dos dados**, em dois lugares. Trocar ou remover o WhatsApp do `site.ts` exige atualizar a política no mesmo commit, senão a página legal passa a apontar para um canal que não existe.

### O que ficou órfão

21 arquivos em `src/` sem referência a partir de `main.tsx`. O Vite os remove da build, então eles não pesam no bundle, mas o `tsc -b` ainda os checa.

- **Seções da antiga landing**: `Hero`, `Solutions`, `Trafego`, `Ia`, `Ferramentas`, `Process`, `Plans`, `Testimonials`, `Faq`, `CTA`.
- **Contato e atendimento**: `WhatsAppFab`, `ceci/CeciChat`, `triagem/BotTriagem`, `triagem/useTriagem`, `lib/whatsapp.ts`. Saíram porque a mensagem pré-escrita falava de planos que a página não oferece mais.
- **Cena 3D**: `ferramentas/CenaFerramentas`, `ferramentas/construirCena`, `lib/brandGlyphs.ts`.
- **Primitivos sem uso atual**: `ui/Counter`, `ui/WhatsAppIcon`.
- **Da própria calculadora**: `calculadora/CartaoPlataforma`, que mostrava quanto sobra em cada plataforma. Saiu do passo 1 porque três cartões de marketplace competiam com a conta principal e confundiam quem está começando. `calcularPlataforma` em `calculadora.ts` é a função que o alimentava, hoje também sem chamador.

**Uma copy ficou apontando para o cartão que saiu, e foi corrigida em 22/10/2026.** O aviso de `faixaInstavel`, em `Precificador.tsx`, mandava "conferir a faixa no cartão da plataforma", e esse cartão não existe mais. Puxando o fio apareceram mais duas referências erradas na mesma frase: "o campo ao lado", que só é verdade a partir de `lg`, e a atribuição do fenômeno à Shopee, que na prática nunca o produz. Vale como exemplo do que procurar ao tirar uma seção de composição: **a referência órfã sobra na copy, onde nenhum compilador reclama e nenhum grep de âncora pega.**

**`three` continua no `package.json` e fora do bundle.** Só `construirCena.ts` o importa, e ele está órfão. Se alguma coisa voltar a referenciar a cena, a regra antiga volta a valer: `three` nunca pode cair no chunk principal, e o acesso tem que ser por `React.lazy`, condicionado a viewport, movimento reduzido e suporte a WebGL.

## Regras de interface

**O estilo é Tailwind v4, CSS-first.** Todos os tokens vivem no bloco `@theme` de `src/index.css`. Não existe `tailwind.config.js` e nenhum deve ser adicionado: o v4 com `@tailwindcss/postcss` não carrega esse arquivo sozinho, então um config seria código morto em silêncio e uma segunda fonte de verdade.

**A paleta é cinco cores de marca mais quatro tons derivados.** `#ffffff`, `#171915`, `#2e3823`, `#070905`, `#DBEB17`, expostos como `carbon-950/900/800`, `moss-700/600` e `acid-400/500/800`, com tokens semânticos em cima (`ink-strong/body/muted/accent`, `on-dark*`, `surface*`, `line*`). Os namespaces evitam de propósito os `lime-*`/`stone-*` do próprio Tailwind: sobrescrever um namespace nativo repintaria em silêncio qualquer classe legada, enquanto qualquer `brand-*`/`blue-*`/`gray-*` sobrevivente é legado que aparece limpo num grep. `--color-danger-*` é a única cor fora da paleta, e é funcional (estado de erro), nunca decorativa.

**A regra de cor mais importante de todas: `#DBEB17` tem 1,32:1 sobre branco.** Nas seções claras ele nunca é texto, nunca é ícone fino, nunca é borda: aparece só como *preenchimento*, com `carbon-950` em cima (15,15:1). O acento textual no claro é `ink-accent` (#5a6b00, 5,94:1) ou `moss-700` (12,31:1). Nas superfícies escuras o limão dá 15,15:1 / 13,86:1 / 9,33:1 e é o acento em tudo.

**A página inteira é escura hoje.** `Section` tem `tone="dark"` por padrão e cinco tons no total (`light`, `muted`, `dark`, `darkAlt`, `moss`); a calculadora usa `dark` no passo 1 e `darkAlt` no passo 2, só para separar os dois. Como não sobrou nenhuma seção clara na composição, **todo `text-acid-*` do código ativo está sobre fundo escuro**, que é o que torna o limão legítimo como texto ali.

**No escuro, estado de erro é `text-danger-border`, nunca `text-danger-ink`.** O ink (`#b42318`) sobre `carbon-950` dá cerca de 2:1 e é ilegível; o border (`#fecdca`) é o tom claro da tríade e é o que o passo 2 usa no aviso de preço impossível. E erro nunca é sinalizado só por cor: o aviso sempre traz a explicação em texto, porque cor sozinha não atende 1.4.1 do WCAG.

**O passo 2 não tem estado de prejuízo, e isso é consequência da matemática.** `calcularPrecoSugerido` resolve o preço *a partir* da margem pedida, então o lucro que ele devolve é sempre a margem pedida: não existe combinação de entrada que produza lucro negativo ali. O único estado ruim possível é `viavel: false`, quando comissão + imposto + margem somam 100% ou mais. O rótulo "Prejuízo" e a troca de cor do número existem no `CartaoPlataforma`, que está órfão, porque lá a conta era a inversa (preço dado, sobra calculada). Não procure "Prejuízo" no código ativo.

**Campo de formulário tem duas variantes**, em `src/components/ui/estilosCompartilhados.ts`: `campoClasses` para fundo claro e `campoClassesEscuro` para fundo escuro. A calculadora usa a escura. Não escreva classe de input à mão.

`CampoNumero` guarda o valor **como string, nunca como number**. Com number o campo não pode ficar vazio, e apagar o conteúdo para digitar outro valor viraria um `0` teimoso no meio da edição. A conversão acontece uma vez, em `lerNumero`, na hora de calcular, e aceita vírgula como separador decimal. `inputMode="decimal"` abre o teclado numérico no celular sem recorrer a `type="number"`, que traz setinha de incremento e rejeita vírgula em parte dos navegadores.

**`CampoTempo` é dois inputs, e isso foi escolha de teclado, não de layout.** O slicer informa duração como "5h 32min", e o campo precisa aceitar minuto. Um campo único em `hh:mm` obrigaria `inputMode="text"`, porque **o teclado numérico do celular não tem a tecla de dois pontos**: seria teclado alfabético completo para digitar número, justamente para o público mais provável de estar no celular. Dois campos numéricos funcionam em qualquer teclado e não têm ambiguidade de leitura. O campo de horas ainda assim aceita `5:30` e `5h30`, colado ou digitado (digitar só o separador move o foco para os minutos), porque no desktop a pessoa copia a duração inteira do slicer.

Minuto acima de 59 **não é truncado nem rejeitado**: `lerTempoHoras` faz `horas + minutos/60`, então 90 min vale 1,5 h, que é o que a pessoa quis dizer. Não "conserte" isso com um clamp em 59.

**Ajuste fino fica atrás de um botão, não na tela.** Hoje existe **um** painel desse tipo no código ativo: o "Ajustar energia e depreciação" do `SeletorImpressora` (`id="ajuste-maquina"`), que reúne material, tarifa de kWh, preço da máquina e vida útil. O padrão é botão com `aria-expanded` e `aria-controls`, painel fechado por padrão, e é o que mantém a tela com dois ou três campos para quem está começando sem tirar precisão de quem quer. O mesmo padrão aparece no `CartaoPlataforma`, que está órfão: **se você for contar os painéis, conte só o ativo.** As taxas do passo 2 ficam à vista, sem disclosure.

**Campo vazio não significa a mesma coisa nos dois passos**, e confundir os dois produz conta errada:

- No passo 2, vazio **delega**. `custoManual` vazio usa o custo que desceu do passo 1; `comissao` e `taxaFixa` vazios viram `null` e deixam a faixa do marketplace decidir (exceto no modo "Outro", onde vazio vale zero, porque não há faixa para consultar).
- No painel de máquina, vazio **vale zero**. `lerNumero('')` devolve 0, então apagar a tarifa de energia zera o custo de energia e apagar a vida útil zera a depreciação, em vez de restaurar `TARIFA_KWH_PADRAO` e `VIDA_UTIL_HORAS_PADRAO`. O padrão existe como *estado inicial* pré-preenchido, não como fallback de campo vazio. O botão "Limpar" é o que restaura.

**Raio e elevação são tokens próprios**, pelo mesmo motivo dos namespaces de cor: redefinir `--radius-lg` repintaria em silêncio qualquer `rounded-lg` legado, sem aparecer no diff. `--radius-control` (pílula, para botão e badge), `--radius-frame` (14px, moldura de ícone e input), `--radius-card` (18px) e `--radius-panel` (24px) são os únicos raios a usar. A elevação é `--shadow-e1/e2/e3`, e **nada passa de e3**: esse teto é o que faz de `shadow-2xl` uma violação de regra, não uma questão de gosto. `.card` (claro) e `.card-dark` (escuro), em `@layer components`, são as superfícies padrão; no escuro a separação vem de borda mais um fundo levemente mais claro, e não de sombra, porque sombra não se lê sobre `carbon-950`.

**Os arquivos de logo são coloridos** (wordmark limão e "P" com gradiente). O logo antigo da Primora era azul-marinho chapado e precisava de `brightness-0 invert` sobre superfície escura; **aplicar esse filtro nos arquivos atuais achata o gradiente num borrão branco.** Escolha o arquivo adequado à superfície: `praxis-horizontal-lime.png` no escuro, `praxis-horizontal-escuro.png` no claro.

**Dois arquivos de `public/` são derivados, não masters da marca.** `praxis-favicon.png` (96px) é o ícone da aba e `praxis-simbolo-720.webp` é o símbolo decorativo atrás do título do Hero. Os dois saem de `praxis-simbolo.png`, o master de 1080px, que pesa 567 kB. Se a marca mudar, regere os derivados, e não aponte a marcação de volta para o master.

**Outros seis arquivos de `public/`** (`praxis-simbolo-mono.png`, `praxis-vertical-lime.png`, `praxis-vertical-escuro.png`, `praxis-wordmark-lime.png`, `praxis-wordmark-escuro.png`, `praxis-wordmark-branco.png`, cerca de 740 kB) não têm referência em `src/` nem nas páginas legais. O Vite copia tudo de `public/` para `dist/`, então eles vão para produção sem estar linkados. Trate como kit de marca mantido de propósito, não como peso morto para apagar de primeira.

Dois casos a mais no mesmo diretório, que o inventário acima não cobre:

- **`praxis-horizontal-escuro.png` tem um consumidor só, e é o `og:image`.** Nenhuma superfície clara sobrou na composição, então o arquivo da versão escura do logo serve hoje apenas de imagem de compartilhamento no `index.html`. Isso importa porque é a mesma tag que está com caminho relativo e esperando o domínio.
- **`Ceci.jpeg` (86 kB) é referenciado só pelo `CeciChat`, que está órfão.** Ele continua sendo copiado para `dist/`, igual aos seis acima, e sai para produção sem estar linkado em nada.

**`calculadora.png`, na raiz, está no `.gitignore`.** É a captura de referência usada para desenhar a ferramenta, e traz um e-mail visível na interface capturada. O repositório é público: não commite esse arquivo nem outros prints do mesmo tipo.

Não introduza: gradiente em botão ou em texto, fundo com `filter: blur()`, `rounded-3xl`/`shadow-2xl`, `transition-all`, nem paleta decorativa por card. Tudo isso foi removido de propósito: era o que fazia o site parecer gerado por IA.

Duas leituras erradas que essa lista costuma provocar:

- **A proibição é `filter: blur()`, não `backdrop-filter`.** O `backdrop-blur-md` da navbar é legítimo: ele desfoca o que está atrás de uma barra de ~60px de altura, enquanto um `blur-[100px]` decorativo força um buffer offscreen do tamanho do elemento, repintado a cada frame. O grep de verificação (`blur-\[`) pega só o segundo caso, de propósito.
- **No lugar de `transition-all`, escreva a lista.** A convenção no código é `transition-colors duration-200` em link e botão, e lista explícita quando precisa de mais de uma propriedade (a navbar usa `transition-[background-color,box-shadow,padding] duration-300`; o `.card`/`.card-dark` declara `transform`, `box-shadow`/`background-color` e `border-color` em CSS). O objetivo é nunca transicionar layout por acidente.

**Quatro classes escritas à mão em `index.css` não são Tailwind e não devem ser reinventadas inline**: `.eyebrow` (o rótulo acima dos títulos), `.hero-title` e `.hero-sub` (os dois `clamp()` de tipografia do hero) e `.hero-grid` (a grade fina de fundo, que é o que separa "editorial" de névoa de IA). Elas convivem com `.card`/`.card-dark`.

**Ícones.** Sempre pelo `<IconFrame>`, que escala o tamanho do Phosphor junto com a moldura. `@phosphor-icons/react` com `weight="duotone"`; é a camada duotone que dá massa ao ícone, em vez do traço fino de 1,5px.

### Animação

O `<MotionConfig reducedMotion="user">` do `App.tsx` resolve `prefers-reduced-motion` de forma global **só para o framer-motion**. Use `<Reveal>`/`<RevealGroup>` em vez de escrever `initial`/`whileInView` à mão.

Para escalonar a entrada de uma lista, use `staggerDelay` de `src/lib/motion.ts`, que já tem teto embutido (`Math.min(index, max)`, no máximo 0,30s). Era o `index * 0.1` sem teto que fazia o último card de uma grade de dez aparecer quase 1s depois dos outros.

**Quatro animações são declaradas em CSS e por isso ficam fora do alcance do MotionConfig**: `.hero-mesh`, `.hero-symbol`, `.marquee-track` e `scroll-behavior`. Cada uma carrega seu próprio `@media (prefers-reduced-motion: no-preference)` no `index.css`. Toda animação nova em CSS precisa fazer o mesmo: `grep -o "prefers-reduced-motion" dist/assets/*.css | wc -l` tem que casar com o número de animações em CSS (hoje 4). Use `grep -o | wc -l`, e não `grep -c`: o CSS buildado é minificado numa linha só, então `grep -c` conta essa linha e imprime `1` independente de quantas consultas sobreviveram.

Das quatro, `.marquee-track` **não tem mais consumidor**: a faixa de setores vivia no `Hero` antigo, hoje órfão. `HeroCalculadora` usa `.hero-mesh` e `.hero-symbol`.

**Espaçamento e âncora pertencem ao `<Section>`**: é ele que define o ritmo vertical (`py-20 md:py-28`) e o `scroll-mt-28` que compensa a navbar fixa. Não coloque `py-*` direto numa seção.

**O `HeroCalculadora` é a exceção declarada**, e não um descuido: ele é um `<section id="hero">` cru, com `pb-16 pt-36 md:pb-24 md:pt-48` próprio, porque precisa de `relative isolate overflow-hidden` para conter as camadas de fundo (`.hero-mesh`, `.hero-grid`, o símbolo em `z-index: -1`) e de um topo muito maior que o das outras seções para não passar embaixo da navbar transparente. Não "conserte" envolvendo em `<Section>`.

O `<Section>` tem uma prop `bleed` que desliga o container interno, para seção que sangra até a borda. Nenhuma seção ativa usa.

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

**Boa parte das skills dele pressupõe outra stack.** `code-review-b2` aplica checklist de Vertical Slice / DDD / Flask, e `security-check` e `spec-driven-development` partem de um backend que não existe aqui. As dez `threejs-*` só fazem sentido se a cena 3D voltar. Das 18 em `.claude/skills/`, as que de fato servem a este repositório são `frontend-design`, `frontend-ui-engineering`, `performance-optimization` e `browser-testing-with-devtools`, e a última precisa do MCP do Chrome DevTools configurado, que o `.mcp.json` daqui não traz (ele está vazio).

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

**Linha de base do bundle, para reconhecer regressão:** em 22/10/2026 o `build` sai com `index.js` de 422,27 kB (128,89 kB gzip) e `index.css` de 45,49 kB (8,72 kB gzip), de 4.984 módulos. O JS é quase todo React mais framer-motion mais os ícones Phosphor em uso. Um salto de centenas de kB quase sempre significa uma de duas coisas: `three` voltou ao grafo, ou um `import * as` de `@phosphor-icons/react` trouxe a biblioteca de ícones inteira em vez dos nomes usados.

Com zero ocorrências, `grep -c` imprime `0` e sai com código 1. O `0` impresso é o resultado desejado; o status de erro é esperado.

Depois, no navegador: preencher com o exemplo de 120 g e conferir que custo e preço sugerido aparecem nos dois passos; trocar o modelo de impressora e ver o custo da hora mudar; no campo de tempo, digitar `5:30` no campo de horas e confirmar que ele se parte em 5 e 30 com o foco indo para os minutos, e que a memória de cálculo mostra "5 h 30 min" e não "5,5 h"; abrir o painel "Ajustar energia e depreciação"; colocar margem de 90% com comissão de 20% no passo 2 e confirmar o aviso de preço impossível (a soma passa de 100%, e esse é o único estado de erro do passo 2); escolher Mercado Livre com custo R$ 50, margem 20% e imposto 0 para cair no degrau dos R$ 79 e ver o aviso de faixa instável (a Shopee não produz esse estado, ver acima); Tab do topo ao fim (o anel de foco limão tem que ser visível em todo campo, `select` incluso, e `Esc` fecha o menu mobile); larguras 320/768/1024/1440 sem rolagem horizontal; e DevTools → Rendering → `prefers-reduced-motion: reduce` para confirmar que a malha e o símbolo do hero param e que os cálculos seguem funcionando.
