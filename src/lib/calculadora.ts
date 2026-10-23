/**
 * Matemática da calculadora de custos de impressão 3D.
 *
 * Tudo aqui é função pura, sem React e sem acesso a DOM: é o que permite
 * conferir uma conta lendo uma função só, em vez de caçar o cálculo no meio
 * do componente. A interface só formata o que estas funções devolvem.
 *
 * Convenção de unidade, para não se perder no meio da conta:
 *   - peso em gramas, preço do rolo em reais por quilo;
 *   - tempo em horas, custo da hora em reais;
 *   - percentual de entrada em pontos (10 = 10%), porque é assim que o usuário
 *     digita; as frações de `marketplaces.ts` (0.1) ficam contidas lá.
 */

import type { AdicionalOpcional, FaixaTaxa, Marketplace } from '../content/marketplaces';
import {
  MULTIPLICADOR_MATERIAL,
  type Impressora,
  type Material,
} from '../content/impressoras';

export type EntradaCusto = {
  /** Gramas de filamento da peça fatiada. */
  pesoPecaG: number;
  /** Valor pago pelo rolo de 1 kg. */
  precoRoloKg: number;
  /** Duração total informada pelo slicer. */
  tempoHoras: number;
  /** Energia elétrica mais depreciação da máquina, por hora. */
  custoHora: number;
  /** Reserva para falhas, em pontos percentuais. */
  reservaFalhasPct: number;
  /** Lucro desejado sobre o custo, em pontos percentuais. */
  lucroDesejadoPct: number;
};

export type ResultadoCusto = {
  custoFilamento: number;
  custoImpressora: number;
  /** Filamento mais máquina, antes da reserva. */
  custoBase: number;
  reservaFalhas: number;
  /** O que a peça custa de verdade: base mais reserva. É o piso do preço. */
  custoTotal: number;
  lucroEmbutido: number;
  /** Preço de venda que entrega o lucro desejado, ignorando taxa de marketplace. */
  precoSugerido: number;
};

/** Zero em vez de NaN: campo vazio é 0, não erro. */
function numero(valor: number): number {
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

export function calcularCusto(entrada: EntradaCusto): ResultadoCusto {
  const custoFilamento = (numero(entrada.pesoPecaG) / 1000) * numero(entrada.precoRoloKg);
  const custoImpressora = numero(entrada.tempoHoras) * numero(entrada.custoHora);
  const custoBase = custoFilamento + custoImpressora;

  /* A reserva incide sobre o custo, não sobre o preço final: ela cobre o
     material e as horas perdidas numa impressão que falhou, e perda de
     impressão não tem lucro embutido. */
  const reservaFalhas = custoBase * (numero(entrada.reservaFalhasPct) / 100);
  const custoTotal = custoBase + reservaFalhas;

  const lucroEmbutido = custoTotal * (numero(entrada.lucroDesejadoPct) / 100);

  return {
    custoFilamento,
    custoImpressora,
    custoBase,
    reservaFalhas,
    custoTotal,
    lucroEmbutido,
    precoSugerido: custoTotal + lucroEmbutido,
  };
}

/**
 * Faixa de taxa que se aplica a um preço.
 *
 * As faixas vêm em ordem crescente e a última tem `ate: null`, então a
 * primeira que couber é a resposta. Preço zero cai na primeira faixa, que é o
 * comportamento certo: a plataforma cobraria por ela se a venda acontecesse.
 */
export function faixaPara(faixas: FaixaTaxa[], preco: number): FaixaTaxa {
  return faixas.find((faixa) => faixa.ate === null || preco <= faixa.ate) ?? faixas[0];
}

/** Sobrescrita manual das taxas, quando o vendedor sabe a dele. */
export type AjusteTaxas = {
  /** Pontos percentuais. `null` = usa o da faixa. */
  percentual: number | null;
  /** Reais por item. `null` = usa o da faixa. */
  fixo: number | null;
};

export const SEM_AJUSTE: AjusteTaxas = { percentual: null, fixo: null };

export type ResultadoPlataforma = {
  /** Percentual de fato aplicado, em pontos, já considerando o ajuste manual. */
  percentualAplicado: number;
  comissao: number;
  taxaFixa: number;
  adicional: number;
  taxasTotais: number;
  /** O que a plataforma repassa: preço menos taxas. */
  liquido: number;
  /** O que sobra depois de pagar a produção. Pode ser negativo. */
  lucroReal: number;
  /** Lucro real sobre o preço de venda, em pontos percentuais. */
  margemRealPct: number;
  /** Taxas sobre o preço de venda, em pontos percentuais. */
  pesoTaxasPct: number;
};

function calcularAdicional(
  adicional: AdicionalOpcional | null,
  ligado: boolean,
  preco: number,
): number {
  if (!adicional || !ligado) return 0;
  const bruto = preco * adicional.percentual;
  return adicional.teto === null ? bruto : Math.min(bruto, adicional.teto);
}

/**
 * Quanto sobra ao vender `preco` numa plataforma, já descontada a produção.
 *
 * `custoTotal` é o `custoTotal` de `calcularCusto`, e não o preço sugerido:
 * o que a peça custou é o que precisa ser coberto, o lucro é o resto.
 */
export function calcularPlataforma(
  marketplace: Marketplace,
  preco: number,
  custoTotal: number,
  ajuste: AjusteTaxas = SEM_AJUSTE,
  adicionalLigado = marketplace.adicional?.ligadoPorPadrao ?? false,
): ResultadoPlataforma {
  const precoValido = numero(preco);
  const faixa = faixaPara(marketplace.faixas, precoValido);

  const percentualAplicado =
    ajuste.percentual !== null && Number.isFinite(ajuste.percentual)
      ? ajuste.percentual
      : faixa.percentual * 100;

  const taxaFixa =
    ajuste.fixo !== null && Number.isFinite(ajuste.fixo) ? ajuste.fixo : faixa.fixo;

  const comissao = precoValido * (percentualAplicado / 100);
  const adicional = calcularAdicional(
    marketplace.adicional,
    adicionalLigado,
    precoValido,
  );

  const taxasTotais = comissao + taxaFixa + adicional;
  const liquido = precoValido - taxasTotais;
  const lucroReal = liquido - custoTotal;

  return {
    percentualAplicado,
    comissao,
    taxaFixa,
    adicional,
    taxasTotais,
    liquido,
    lucroReal,
    margemRealPct: precoValido > 0 ? (lucroReal / precoValido) * 100 : 0,
    pesoTaxasPct: precoValido > 0 ? (taxasTotais / precoValido) * 100 : 0,
  };
}

/* -------------------------------------------------------------------------
   Preço de venda a partir da margem desejada

   É a conta inversa de `calcularPlataforma`: em vez de perguntar quanto sobra
   num preço, pergunta que preço faz a margem sobreviver às taxas.

   O ponto crítico é que a conta é uma DIVISÃO, não uma soma de percentuais.
   Comissão, imposto e margem incidem todos sobre o preço de venda, que é
   justamente a incógnita. Somar 20% de margem ao custo e depois deixar o
   marketplace tirar 20% do preço resulta em prejuízo:

     custo 40 + 20% = 48, comissão de 20% sobre 48 = 9,60, sobra 38,40.

   Dividindo pelo complemento a conta fecha:

     40 / (1 - 0,20 - 0,20) = 66,67, comissão 13,33, sobra 53,34, lucro 13,33,
     que é exatamente 20% de 66,67.

   Por isso a margem aqui é margem sobre o PREÇO DE VENDA (margem de
   contribuição), e não markup sobre o custo. São coisas diferentes e
   confundi-las é o erro mais comum deste tipo de planilha.
   ------------------------------------------------------------------------- */

export type EntradaPreco = {
  /** Custo de produzir a peça. Vem do `custoTotal` de `calcularCusto`. */
  custoProduto: number;
  embalagem: number;
  /** Comissão em pontos percentuais. `null` usa a faixa do marketplace. */
  comissaoPct: number | null;
  /** Taxa por item em reais. `null` usa a faixa do marketplace. */
  taxaFixa: number | null;
  /** Imposto sobre a receita, em pontos. Zero para quem não recolhe. */
  impostoPct: number;
  /** Margem desejada sobre o preço de venda, em pontos. */
  margemPct: number;
  /** Quando presente, preenche comissão e taxa fixa pela faixa de preço. */
  marketplace: Marketplace | null;
};

export type ResultadoPreco = {
  /** `false` quando a soma dos percentuais chega a 100% e não há preço possível. */
  viavel: boolean;
  /** Comissão + imposto + margem, em pontos. */
  somaPercentual: number;
  precoVenda: number;
  comissao: number;
  imposto: number;
  taxaFixa: number;
  custosDiretos: number;
  lucro: number;
  /** Lucro sobre o preço. Serve de prova: tem que bater com a margem pedida. */
  margemConferida: number;
  comissaoPctAplicada: number;
  faixaAplicada: FaixaTaxa | null;
  /**
   * O preço calculado cai numa faixa de taxa diferente da usada no cálculo, e
   * as duas se alternam sem convergir.
   *
   * Na tabela de outubro de 2026 quem produz isso é o **Mercado Livre**, não a
   * Shopee: a comissão é 14% dos dois lados e só a taxa por item muda, de
   * R$ 6,50 para zero acima de R$ 79. Cobrir os R$ 6,50 empurra o preço acima
   * de R$ 79, onde a taxa não existe, e sem ela o preço cai de volta para
   * baixo de R$ 79. Varredura de custo, embalagem, margem e imposto encontra
   * 3.042 casos no Mercado Livre e zero na Shopee e no TikTok Shop.
   *
   * Quando isso acontece, `precoVenda` sai calculado com a ÚLTIMA faixa
   * testada, que pode não ser a faixa em que ele cai. No caso do Mercado Livre
   * isso significa um preço R$ 6,50 abaixo do que cobriria a taxa real, e é
   * por isso que a interface precisa avisar em vez de esconder.
   */
  faixaInstavel: boolean;
};

function precoComTaxas(
  entrada: EntradaPreco,
  comissaoPct: number,
  taxaFixa: number,
): { preco: number; divisor: number } {
  const somaPercentual =
    comissaoPct + numero(entrada.impostoPct) + numero(entrada.margemPct);
  const divisor = 1 - somaPercentual / 100;

  const custosAbsolutos =
    numero(entrada.custoProduto) + numero(entrada.embalagem) + taxaFixa;

  return { preco: divisor > 0 ? custosAbsolutos / divisor : 0, divisor };
}

/**
 * Preço de venda que entrega a margem pedida depois de todas as taxas.
 *
 * Quando um marketplace é informado, comissão e taxa por item saem da faixa de
 * preço, mas a faixa depende do preço, que é o que estamos calculando. A saída
 * é iterar: calcula com uma faixa, reavalia a faixa no preço obtido, repete
 * até estabilizar. Converge em duas ou três voltas no caso normal, e quando
 * não converge devolve o preço da última faixa testada e marca
 * `faixaInstavel`. Ver a documentação desse campo em `ResultadoPreco`: na
 * tabela de hoje quem não converge é o Mercado Livre, no degrau dos R$ 79.
 */
export function calcularPrecoSugerido(entrada: EntradaPreco): ResultadoPreco {
  const manualCompleto = entrada.comissaoPct !== null && entrada.taxaFixa !== null;

  let comissaoPct = entrada.comissaoPct ?? 0;
  let taxaFixa = entrada.taxaFixa ?? 0;
  let faixa: FaixaTaxa | null = null;
  let instavel = false;

  if (entrada.marketplace && !manualCompleto) {
    const vistas = new Set<FaixaTaxa>();
    /* Chute inicial: o custo sem taxa nenhuma. Qualquer ponto de partida
       converge, mas começar por baixo faz a primeira faixa ser a mais barata,
       o que evita sugerir preço inflado quando as faixas se alternam. */
    let preco = numero(entrada.custoProduto) + numero(entrada.embalagem);

    for (let volta = 0; volta < 8; volta++) {
      const candidata = faixaPara(entrada.marketplace.faixas, preco);

      if (vistas.has(candidata)) {
        /* Já passamos por esta faixa: ou convergiu, ou está oscilando. */
        instavel = faixa !== null && faixa !== candidata;
        break;
      }
      vistas.add(candidata);
      faixa = candidata;

      comissaoPct = entrada.comissaoPct ?? candidata.percentual * 100;
      taxaFixa = entrada.taxaFixa ?? candidata.fixo;

      const { preco: novo } = precoComTaxas(entrada, comissaoPct, taxaFixa);
      if (novo === preco) break;
      preco = novo;
    }
  }

  const { preco: precoVenda, divisor } = precoComTaxas(entrada, comissaoPct, taxaFixa);
  const viavel = divisor > 0 && precoVenda > 0;

  const comissao = precoVenda * (comissaoPct / 100);
  const imposto = precoVenda * (numero(entrada.impostoPct) / 100);
  const custosDiretos = numero(entrada.custoProduto) + numero(entrada.embalagem);
  const lucro = precoVenda - comissao - imposto - taxaFixa - custosDiretos;

  return {
    viavel,
    somaPercentual:
      comissaoPct + numero(entrada.impostoPct) + numero(entrada.margemPct),
    precoVenda: viavel ? precoVenda : 0,
    comissao: viavel ? comissao : 0,
    imposto: viavel ? imposto : 0,
    taxaFixa,
    custosDiretos,
    lucro: viavel ? lucro : 0,
    margemConferida: viavel && precoVenda > 0 ? (lucro / precoVenda) * 100 : 0,
    comissaoPctAplicada: comissaoPct,
    faixaAplicada: faixa,
    faixaInstavel: instavel,
  };
}

export type EntradaCustoHora = {
  impressora: Impressora;
  material: Material;
  /** Reais por kWh, como vem na conta de luz. */
  tarifaKwh: number;
  /** Quanto a máquina custou, em reais. */
  precoMaquina: number;
  /** Horas de trabalho consideradas na depreciação. */
  vidaUtilHoras: number;
};

export type ResultadoCustoHora = {
  /** Consumo médio em watts, já ajustado pelo material. */
  consumoW: number;
  custoEnergiaHora: number;
  custoDepreciacaoHora: number;
  /** A soma, que é o que alimenta o campo "custo da hora". */
  custoHora: number;
};

/**
 * Custo de uma hora de máquina: energia mais depreciação.
 *
 * A depreciação costuma dominar por larga margem, e é o que torna este cálculo
 * útil: numa A1 a R$ 3.250 com 2.000 h de vida útil, a hora de depreciação dá
 * R$ 1,63 contra R$ 0,10 de energia. Quem calcula só a conta de luz subestima
 * o custo de máquina em mais de dez vezes.
 */
export function calcularCustoHora(entrada: EntradaCustoHora): ResultadoCustoHora {
  const fator = MULTIPLICADOR_MATERIAL[entrada.material];
  const multiplicador = entrada.impressora.fechada ? fator.fechada : fator.aberta;
  const consumoW = entrada.impressora.consumoPlaW * multiplicador;

  const custoEnergiaHora = (consumoW / 1000) * numero(entrada.tarifaKwh);

  /* Vida útil zero deixaria a depreciação em Infinity e contaminaria o preço
     sugerido inteiro. Campo vazio vira "sem depreciação", não divisão por zero. */
  const vidaUtil = numero(entrada.vidaUtilHoras);
  const custoDepreciacaoHora = vidaUtil > 0 ? numero(entrada.precoMaquina) / vidaUtil : 0;

  return {
    consumoW,
    custoEnergiaHora,
    custoDepreciacaoHora,
    custoHora: custoEnergiaHora + custoDepreciacaoHora,
  };
}

/**
 * Lê o que o usuário digitou num campo numérico.
 *
 * Aceita vírgula como separador decimal, porque é o que um teclado brasileiro
 * produz e porque `<input type="number">` em pt-BR já devolve vírgula em parte
 * dos navegadores. Campo vazio devolve 0, não NaN: a calculadora trata vazio
 * como "ainda não informado", nunca como erro.
 */
export function lerNumero(texto: string): number {
  const limpo = texto.replace(/\s/g, '').replace(',', '.');
  if (limpo === '') return 0;
  const valor = Number(limpo);
  return Number.isFinite(valor) && valor >= 0 ? valor : 0;
}

/**
 * Tempo de impressão a partir de dois campos, horas e minutos.
 *
 * O slicer informa a duração como "5h 32min", e pedir que a pessoa converta
 * 32 minutos em 0,533 h à mão é onde o erro entra: arredondar para 5,5 h já
 * joga o custo de máquina 2% fora antes de qualquer taxa, e arredondar para
 * 5 h perde meia hora de depreciação por peça.
 *
 * Minuto acima de 59 não é erro e não é truncado: quem digita 90 quis dizer
 * 1,5 h, e é isso que a conta recebe.
 */
export function lerTempoHoras(horas: string, minutos: string): number {
  return lerNumero(horas) + lerNumero(minutos) / 60;
}

/**
 * Duração em texto, para a memória de cálculo.
 *
 * "5 h 30 min" lê melhor que "5,5 h" num painel cuja função é deixar a pessoa
 * conferir o que digitou. Arredonda para o minuto, que é a menor unidade que
 * o campo aceita.
 */
export function formatarDuracao(horasDecimais: number): string {
  if (!Number.isFinite(horasDecimais) || horasDecimais <= 0) return '0 min';

  const totalMinutos = Math.round(horasDecimais * 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas.toLocaleString('pt-BR')} h`;
  return `${horas.toLocaleString('pt-BR')} h ${minutos} min`;
}

const MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatarBRL(valor: number): string {
  return MOEDA.format(Number.isFinite(valor) ? valor : 0);
}

export function formatarPct(pontos: number): string {
  if (!Number.isFinite(pontos)) return '0%';
  /* Uma casa só quando precisa: "14%" lê melhor que "14,0%", mas "12,5%"
     não pode virar "13%" num comparativo de margem. */
  const arredondado = Math.round(pontos * 10) / 10;
  return `${arredondado.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}
