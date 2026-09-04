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

export type Setor = {
  nome: string;
  /**
   * O detalhe regulatório do segmento. É o que separa "atendemos advogados" de
   * "sabemos anunciar para advogados" — e é verificável, ao contrário de uma
   * promessa de resultado.
   */
  nota: string;
};

export type Plano = {
  nome: string;
  /**
   * Frase de resultado: para quem o plano é e o que ele resolve.
   * É o que o cliente lê primeiro — o plano se apresenta como etapa do
   * negócio dele, não como cesta de unidades.
   */
  chamada: string;
  /** Em reais. `null` exibe "Sob medida" em vez de omitir o preço. */
  precoInicial: number | null;
  /**
   * Especificação em prosa, exibida em corpo menor.
   * As quantidades continuam declaradas — sem elas o cliente não consegue
   * julgar o preço —, mas como lastro do valor, não como argumento de venda.
   * Contar posts na chamada principal colocaria a Praxis competindo em volume
   * com freelancer, que é o jogo errado.
   */
  inclui: string;
  destaque?: boolean;
  badge?: string;
};

export const site = {
  nome: 'Praxis Digital',

  contato: {
    /**
     * Sem e-mail por decisão: o atendimento é todo por WhatsApp. Enquanto for
     * `null`, o bloco de e-mail do rodapé e o link do CTA não são renderizados.
     * A Política de Privacidade aponta o WhatsApp como canal do titular.
     */
    email: null as string | null,
    /** TODO(dono): telefone fixo, se houver. */
    telefone: null as string | null,
    /**
     * Formato internacional, só dígitos: 55 + DDD + número.
     * Enquanto for `null`, o botão flutuante não é renderizado e o formulário
     * não tem para onde enviar.
     */
    whatsapp: '5511976487829' as string | null,
    /** Mensagem que já vem escrita quando o visitante abre a conversa. */
    whatsappMensagem:
      'Olá! Vim pelo site da Praxis Digital e gostaria de saber mais sobre os planos.',
    cidade: 'São Paulo, SP',
  },

  redes: {
    /** TODO(dono): URLs reais. Enquanto `null`, o bloco não é renderizado. */
    instagram: null as string | null,
    linkedin: null as string | null,
  },

  /** Prazo de entrega. Valor único, consumido pelo FAQ e pelo Como Funciona. */
  prazoEntrega: '15 a 20 dias',

  /**
   * Segmentos atendidos. Alimentam a faixa em loop do Hero e o bloco de
   * setores da seção de tráfego.
   *
   * As notas não são enfeite: cada um desses mercados tem regra própria de
   * publicidade, e violar a da OAB custa processo disciplinar ao cliente.
   */
  setores: [
    {
      nome: 'Corretoras de seguros',
      nota: 'produto que ninguém procura por impulso — a campanha precisa educar antes de vender',
    },
    {
      nome: 'Imobiliárias',
      nota: 'CRECI visível no criativo, como manda a Resolução COFECI 1.065/2007',
    },
    {
      nome: 'Contabilidade',
      nota: 'publicidade informativa, técnica e moderada, no espírito da NBC PG 01',
    },
    {
      nome: 'Advocacia',
      nota: 'anúncios que informam, não captam — Provimento 205/2021 da OAB',
    },
    {
      nome: 'Serviços administrativos',
      nota: 'venda consultiva e ciclo longo, com conteúdo que sustenta a decisão',
    },
  ] as Setor[],

  /**
   * Faixa de métricas do Hero.
   *
   * Vazia de propósito: os números do esboço original (+120 clientes, 8 anos,
   * 4.9★) eram ilustrativos e nunca foram confirmados. Enquanto estiver vazia,
   * o Hero exibe a faixa de setores no lugar.
   *
   * Atenção ao incluir uma nota do tipo "4.9 ★": sem `source` apontando para um
   * perfil público verificável, isso é publicidade enganosa (CDC art. 37),
   * não apenas um problema de design.
   */
  metricas: [] as Stat[],

  /**
   * TODO(dono): 2 ou 3 depoimentos reais (nome, cargo, empresa).
   * Os anteriores eram fictícios. Enquanto vazio, a seção não é renderizada.
   */
  depoimentos: [] as Depoimento[],

  planos: [
    {
      nome: 'START',
      chamada: 'Para quem está montando a presença digital agora.',
      precoInicial: 497,
      inclui:
        'Perfis otimizados, 8 posts e 8 stories por mês, landing page e suporte.',
    },
    {
      nome: 'GROWTH',
      chamada:
        'Para quem já tem movimento e precisa de estrutura para sustentar o crescimento.',
      precoInicial: 1097,
      destaque: true,
      badge: 'Mais completo',
      inclui:
        '12 posts e 12 stories por mês, 2 vídeos, site profissional, atendimento automatizado no WhatsApp e consultoria mensal.',
    },
    {
      nome: 'PRO',
      chamada:
        'Para quem quer volume e consistência em todos os canais, com estratégia acompanhada de perto.',
      precoInicial: 1997,
      inclui:
        '16 posts e 16 stories por mês, 4 vídeos, site completo, atendimento automatizado no WhatsApp e consultoria estratégica.',
    },
    {
      nome: 'PERSONALIZADO',
      chamada: 'Para quem precisa de um recorte diferente dos três.',
      /* Sem preço de partida de propósito: o valor sai do escopo, e não o
         contrário. */
      precoInicial: null,
      inclui:
        'Conteúdo, site, atendimento automatizado, consultoria e gestão de tráfego combinados na medida da sua operação — inclusive só uma dessas frentes.',
    },
  ] as Plano[],

  /**
   * Gestão de tráfego pago — serviço próprio, e não item embutido num plano.
   *
   * O motivo é estrutural, o mesmo que separava a antiga assessoria: o tráfego
   * escala por número de plataformas e volume de mídia, o conteúdo escala por
   * volume de peças. São eixos diferentes. Embutir o tráfego no plano mais caro
   * obrigaria a cobrá-lo de quem só quer conteúdo.
   */
  trafego: {
    faixas: [
      { escopo: 'Google Ads ou Meta Ads', preco: 897 },
      { escopo: 'Google Ads + Meta Ads', preco: 1297 },
      { escopo: '+ criativos e landing pages dedicadas', preco: 1797 },
    ] as { escopo: string; preco: number }[],

    /**
     * Verba mínima recomendada, em reais por mês.
     *
     * Fica escrito na página de propósito. Abaixo disso o algoritmo não junta
     * dado suficiente para sair do aprendizado, e o fee pesa demais sobre o
     * retorno. Dizer isso na página afasta parte dos leads; não dizer os afasta
     * na reunião, depois de terem ancorado nos R$ 897.
     */
    verbaMinima: 1500,
  },
};
