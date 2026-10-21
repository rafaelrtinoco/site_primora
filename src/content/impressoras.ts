/**
 * Impressoras cobertas pelo seletor da calculadora.
 *
 * Só FDM de filamento. Impressora de resina (Elegoo Mars, Saturn) ficou de
 * fora de propósito: resina é vendida em frasco e fatiada por mililitro, então
 * os campos "peso em gramas" e "preço do rolo de 1 kg" dariam número sem
 * sentido. Incluir a Mars aqui seria pior que não ter a Mars.
 *
 * Critério da lista: os modelos de maior giro no varejo brasileiro em 2026,
 * na ordem de participação das marcas (Bambu Lab, Creality, Anycubic).
 *
 * ---- Sobre o número de watts ----
 *
 * `consumoPlaW` é consumo MÉDIO medido imprimindo, não potência de placa. A
 * distinção importa muito: a A1 tem pico de 1.100 W ao aquecer a mesa, mas a
 * média imprimindo PLA é 95 W. Usar o valor de placa inflaria o custo de
 * energia em mais de dez vezes.
 *
 * Os três modelos Bambu Lab trazem o valor publicado pelo fabricante, medido
 * por material. Os demais vêm de medição de terceiros e estão marcados como
 * estimativa, que a interface mostra ao usuário.
 *
 * TODO(dono): preço de referência muda com câmbio e com a loja. Os valores
 * abaixo são de outubro de 2026 e existem só para pré-preencher o campo, que
 * é editável. Quem comprou sabe quanto pagou.
 */

export type Material = 'pla' | 'petg' | 'abs';

export type Impressora = {
  id: string;
  nome: string;
  /** Consumo médio em watts imprimindo PLA. */
  consumoPlaW: number;
  /**
   * Câmara fechada. Não é enfeite de ficha técnica: define o quanto o consumo
   * sobe com material quente, porque a câmara fechada segura o calor e a mesa
   * reaquece menos. Ver MULTIPLICADOR_MATERIAL.
   */
  fechada: boolean;
  /** Preço de referência no varejo brasileiro, em reais. */
  precoBrl: number;
  /** De onde veio o consumo, exibido ao usuário. */
  origem: 'fabricante' | 'estimativa';
};

/**
 * Quanto o material multiplica o consumo em relação ao PLA.
 *
 * Os dois valores de ABS saem de medição do próprio fabricante, e não de
 * chute: na A1, de quadro aberto, o medido foi 200 W em ABS contra 95 W em
 * PLA, ou seja 2,11x. Na P1S, de câmara fechada, foi 140 W contra 105 W, ou
 * 1,33x. A diferença entre os dois é justamente a câmara.
 *
 * O PETG é interpolação, não medição: a mesa trabalha a 70-80 °C contra 60 °C
 * do PLA, abaixo dos 100 °C do ABS. Está marcado como estimativa na interface.
 */
export const MULTIPLICADOR_MATERIAL: Record<
  Material,
  { aberta: number; fechada: number; nome: string; estimado: boolean }
> = {
  pla: { aberta: 1, fechada: 1, nome: 'PLA', estimado: false },
  petg: { aberta: 1.25, fechada: 1.15, nome: 'PETG', estimado: true },
  abs: { aberta: 2.11, fechada: 1.33, nome: 'ABS ou ASA', estimado: false },
};

export const impressoras: Impressora[] = [
  {
    id: 'bambu-a1-mini',
    nome: 'Bambu Lab A1 mini',
    consumoPlaW: 80,
    fechada: false,
    precoBrl: 2200,
    origem: 'fabricante',
  },
  {
    id: 'bambu-a1',
    nome: 'Bambu Lab A1',
    consumoPlaW: 95,
    fechada: false,
    precoBrl: 3250,
    origem: 'fabricante',
  },
  {
    id: 'bambu-p1s',
    nome: 'Bambu Lab P1S',
    consumoPlaW: 105,
    fechada: true,
    precoBrl: 7000,
    origem: 'fabricante',
  },
  {
    id: 'ender-3-v3-se',
    nome: 'Creality Ender 3 V3 SE',
    consumoPlaW: 120,
    fechada: false,
    precoBrl: 1650,
    origem: 'estimativa',
  },
  {
    id: 'ender-3-v3-ke',
    nome: 'Creality Ender 3 V3 KE',
    consumoPlaW: 125,
    fechada: false,
    precoBrl: 2250,
    origem: 'estimativa',
  },
  {
    id: 'creality-k1c',
    nome: 'Creality K1C',
    consumoPlaW: 130,
    fechada: true,
    precoBrl: 4000,
    origem: 'estimativa',
  },
  {
    id: 'anycubic-kobra-s1',
    nome: 'Anycubic Kobra S1 Combo',
    consumoPlaW: 125,
    fechada: true,
    precoBrl: 5600,
    origem: 'estimativa',
  },
];

/** Marca a opção de informar o custo da hora na mão, sem escolher modelo. */
export const IMPRESSORA_MANUAL = 'manual';

/**
 * Tarifa média residencial com impostos no Brasil em 2026.
 *
 * Vale como ponto de partida, não como verdade: a tarifa vai de R$ 0,48
 * (Cooperzem, SC) a R$ 1,22 (Certrel, SC) conforme a distribuidora. O campo é
 * editável e a interface sugere copiar o valor da própria conta de luz.
 */
export const TARIFA_KWH_PADRAO = 1;

/**
 * Vida útil considerada na depreciação.
 *
 * 2.000 horas é a hipótese conservadora usual para máquina de entrada sem
 * troca de peça de desgaste. Quem faz manutenção e troca bico, correia e
 * chapa chega bem além disso, e por isso o campo é editável.
 */
export const VIDA_UTIL_HORAS_PADRAO = 2000;
