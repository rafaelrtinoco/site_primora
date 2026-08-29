/**
 * Fonte única de conteúdo do site.
 *
 * Regra que vale para todo este arquivo: campo `null` ou lista vazia significa
 * "ainda não temos o dado real" e o bloco correspondente NÃO é renderizado.
 * Nada de placeholder plausível — foi assim que "João Silva", "(11) 99999-9999"
 * e o "+24%" do dashboard acabaram publicados.
 */

export type Stat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** URL pública que comprova o número. Obrigatória para nota/avaliação. */
  source?: string;
};

export type Depoimento = {
  quote: string;
  nome: string;
  cargo: string;
  empresa: string;
};

export type Plano = {
  nome: string;
  /**
   * Frase de resultado: para quem o plano é e o que ele resolve.
   * É o que o cliente lê primeiro — o plano se apresenta como etapa do
   * negócio dele, não como cesta de unidades.
   */
  chamada: string;
  /** Em reais. `null` exibe "Sob consulta" em vez de omitir o preço. */
  precoInicial: number | null;
  /**
   * Especificação em prosa, exibida em corpo menor.
   * As quantidades continuam declaradas — sem elas o cliente não consegue
   * julgar o preço —, mas como lastro do valor, não como argumento de venda.
   * Contar posts na chamada principal colocaria a Primora competindo em
   * volume com freelancer, que é o jogo errado.
   */
  inclui: string;
  destaque?: boolean;
  badge?: string;
};

export const site = {
  nome: 'Primora Soluções',

  contato: {
    email: 'contato@primorasolucoes.com.br',
    /** TODO(dono): telefone real. Era "(11) 99999-9999", um placeholder. */
    telefone: null as string | null,
    /**
     * Formato internacional, só dígitos: 55 + DDD + número.
     * Enquanto for `null`, o botão flutuante não é renderizado e o formulário
     * não tem para onde enviar.
     */
    whatsapp: '5511976487829' as string | null,
    /** Mensagem que já vem escrita quando o visitante abre a conversa. */
    whatsappMensagem:
      'Olá! Vim pelo site da Primora e gostaria de saber mais sobre os planos.',
    cidade: 'São Paulo, SP',
  },

  redes: {
    /** TODO(dono): URLs reais. Os links eram href="#". */
    instagram: null as string | null,
    linkedin: null as string | null,
  },

  /**
   * Prazo de entrega. Existia contradição no site: o FAQ dizia "15 a 20 dias"
   * e a seção de estrutura digital dizia "poucos dias". Valor único aqui.
   */
  prazoEntrega: '15 a 20 dias',

  /**
   * Faixa de métricas do Hero.
   *
   * Vazia de propósito: os números que apareceram no esboço de layout
   * (+120 corretores, 8 anos, 4.9★) eram ilustrativos e não foram confirmados.
   * Enquanto estiver vazia, o Hero exibe o fallback qualitativo abaixo.
   *
   * Atenção ao incluir uma nota do tipo "4.9 ★": sem `source` apontando para um
   * perfil público verificável, isso é publicidade enganosa (CDC art. 37),
   * não apenas um problema de design.
   */
  metricas: [] as Stat[],

  /** Exibido no lugar da faixa de métricas enquanto não houver números reais. */
  diferenciais: [
    'Operacional completo',
    'Renovações sob controle',
    'Sinistros acompanhados',
    'Suporte em horário comercial',
  ],

  /**
   * TODO(dono): 2 ou 3 depoimentos reais (nome, cargo, empresa).
   * Os anteriores eram fictícios — "João Silva" era, inclusive, o mesmo nome
   * usado como placeholder do campo de nome no formulário.
   * Enquanto vazio, a seção inteira não é renderizada.
   */
  depoimentos: [] as Depoimento[],

  planos: [
    {
      nome: 'START',
      chamada: 'Para quem está montando a presença digital agora.',
      precoInicial: 497,
      inclui:
        'Instagram otimizado, 8 posts e 8 stories por mês, landing page e suporte.',
    },
    {
      nome: 'GROWTH',
      chamada:
        'Para quem já tem movimento e precisa de estrutura para sustentar o crescimento.',
      precoInicial: 1097,
      destaque: true,
      badge: 'Mais completo',
      inclui:
        '12 posts e 12 stories por mês, 2 vídeos, site profissional, chat automatizado no WhatsApp e consultoria mensal.',
    },
    {
      nome: 'PRIMORA PRO',
      chamada:
        'Para quem quer volume e consistência em todos os canais, com estratégia acompanhada de perto.',
      precoInicial: 1997,
      inclui:
        '16 posts e 16 stories por mês, 4 vídeos, site completo, chat automatizado no WhatsApp e consultoria estratégica.',
    },
    {
      nome: 'PERSONALIZADO',
      chamada:
        'Para quem precisa de um recorte diferente dos três.',
      /* Sem preço de partida de propósito: o valor sai do escopo, e não o
         contrário. */
      precoInicial: null,
      inclui:
        'Conteúdo, site, chat automatizado, consultoria e assessoria operacional combinados na medida da sua corretora — inclusive só uma dessas frentes.',
    },
  ] as Plano[],

  /**
   * Assessoria operacional — serviço próprio, e não item embutido num plano.
   *
   * O motivo é estrutural: a assessoria escala por tamanho de carteira, o
   * marketing escala por volume de conteúdo. São eixos diferentes. Embutir a
   * assessoria no plano mais caro obrigava a cobrar o pior caso de carteira de
   * todo mundo — e afastava o cliente que só quer marketing.
   */
  assessoria: {
    faixas: [
      { apolices: 30, preco: 1500 },
      { apolices: 60, preco: 1700 },
      { apolices: 90, preco: 1900 },
      { apolices: 120, preco: 2100 },
    ] as { apolices: number; preco: number }[],
  },
};
