/**
 * Tabela de taxas dos marketplaces, usada pela calculadora.
 *
 * Mesma regra de procedência que vale em `site.ts`: número aqui dentro não é
 * chute. Cada plataforma carrega `vigenteDesde` e `fonte`, e a interface mostra
 * as duas coisas ao usuário, porque uma tarifa sem data é uma tarifa que vai
 * envelhecer em silêncio.
 *
 * As três mudaram de regra em 2026, e é por isso que a calculadora deixa todo
 * percentual editável: a tarifa por unidade do Mercado Livre virou variável por
 * peso e dimensão, e nenhum valor fixo acerta todos os casos. O padrão abaixo
 * serve de ponto de partida, não de verdade.
 *
 * TODO(dono): conferir na central de cada plataforma antes de divulgar a
 * calculadora. As fontes públicas divergem em detalhes (a faixa acima de
 * R$ 500 da Shopee aparece como R$ 26 em umas e R$ 28 em outras).
 */

export type FaixaTaxa = {
  /** Teto da faixa, inclusive. `null` marca a última faixa, sem teto. */
  ate: number | null;
  /** Fração, não porcentagem: 0.14 significa 14%. */
  percentual: number;
  /** Valor cobrado por item vendido, em reais. */
  fixo: number;
};

/** Custo opcional que o vendedor pode ligar ou desligar (hoje só o TikTok). */
export type AdicionalOpcional = {
  rotulo: string;
  descricao: string;
  percentual: number;
  /** Teto do adicional, em reais. `null` = sem teto. */
  teto: number | null;
  /** Se a plataforma já liga por padrão para o vendedor. */
  ligadoPorPadrao: boolean;
};

export type Marketplace = {
  id: MarketplaceId;
  nome: string;
  /** Faixas em ordem crescente de preço. */
  faixas: FaixaTaxa[];
  adicional: AdicionalOpcional | null;
  /** O que o usuário precisa saber para não confiar cegamente no resultado. */
  observacao: string;
  /** Data em que a regra atual entrou em vigor, no formato que vai para a tela. */
  vigenteDesde: string;
  fonte: string;
};

export type MarketplaceId = 'shopee' | 'tiktok' | 'mercadoLivre';

export const marketplaces: Marketplace[] = [
  {
    id: 'shopee',
    nome: 'Shopee',
    /* O degrau dos R$ 80 é o detalhe que mais pega vendedor desprevenido:
       abaixo dele a comissão é 20%, acima cai para 14% mas a taxa por item
       pula de R$ 4 para R$ 16. Anunciar a R$ 79,90 pode render menos que
       anunciar a R$ 85. */
    faixas: [
      { ate: 7.99, percentual: 0.5, fixo: 0 },
      { ate: 79.99, percentual: 0.2, fixo: 4 },
      { ate: 99.99, percentual: 0.14, fixo: 16 },
      { ate: 199.99, percentual: 0.14, fixo: 20 },
      { ate: 499.99, percentual: 0.14, fixo: 26 },
      { ate: null, percentual: 0.14, fixo: 26 },
    ],
    adicional: null,
    observacao:
      'O Programa de Frete Grátis virou obrigatório e já está embutido na comissão. O teto de R$ 100 de comissão por item deixou de existir, então ticket alto paga o percentual cheio. Valores de vendedor CNPJ.',
    vigenteDesde: '1 de março de 2026',
    fonte: 'https://seller.shopee.com.br/edu/article/4825',
  },
  {
    id: 'tiktok',
    nome: 'TikTok Shop',
    /* Tabela única, sem variação por categoria, o que torna o TikTok o mais
       simples dos três de calcular. O degrau fica nos R$ 50. */
    faixas: [
      { ate: 49.99, percentual: 0.1, fixo: 4 },
      { ate: null, percentual: 0.06, fixo: 6 },
    ],
    adicional: {
      rotulo: 'Programa de Frete Grátis',
      descricao:
        'Adesão automática, com saída opcional. Cobra 6% sobre o valor do produto, limitado a R$ 50 por item.',
      percentual: 0.06,
      teto: 50,
      ligadoPorPadrao: true,
    },
    observacao:
      'Tabela única para todas as categorias. A comissão incide sobre o preço depois do desconto dado pelo vendedor, sem contar cupom bancado pela plataforma. Vendedor novo tem 0% de comissão por 60 dias, limitado a R$ 17 mil.',
    vigenteDesde: '15 de julho de 2026',
    fonte: 'https://seller-br.tiktok.com/university/essay?knowledge_id=10006074',
  },
  {
    id: 'mercadoLivre',
    nome: 'Mercado Livre',
    /* Único dos três em que o percentual depende da categoria e do tipo de
       anúncio, então o padrão aqui é só um meio de caminho: 14% é o valor
       típico do Clássico em Casa e Brinquedos, que é onde peça impressa
       costuma ser anunciada. Premium fica perto de 19%.

       A tarifa por unidade só incide abaixo de R$ 79. Desde março de 2026 ela
       varia com peso e dimensão, e os R$ 6,50 abaixo são a mediana relatada,
       não um valor de tabela. */
    faixas: [
      { ate: 78.99, percentual: 0.14, fixo: 6.5 },
      { ate: null, percentual: 0.14, fixo: 0 },
    ],
    adicional: null,
    observacao:
      'A comissão muda por categoria e por tipo de anúncio: Clássico fica entre 10% e 14%, Premium entre 15% e 19%, porque embute o parcelamento sem juros. Ajuste o percentual para o da sua categoria. Acima de R$ 79 não há tarifa por unidade, mas o frete passa a ser responsabilidade do anúncio.',
    vigenteDesde: '2 de março de 2026',
    fonte: 'https://www.mercadolivre.com.br/ajuda/tarifas-por-vender-um-produto_1415',
  },
];

/** Acesso por id, para a interface não varrer a lista toda a cada render. */
export const marketplacePorId: Record<MarketplaceId, Marketplace> =
  Object.fromEntries(marketplaces.map((m) => [m.id, m])) as Record<
    MarketplaceId,
    Marketplace
  >;
