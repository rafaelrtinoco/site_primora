/**
 * Consentimento de cookies / LGPD.
 *
 * Estado atual do site: não há analytics, pixel nem qualquer cookie de
 * terceiro instalado. Este módulo existe para que, quando forem instalados, o
 * consentimento já seja pré-requisito — e não algo lembrado depois.
 *
 * Regra de ouro: nenhum script das categorias opcionais pode ser carregado
 * antes de `getConsent()` retornar `true` para a categoria dele.
 */

export type Categoria = 'essenciais' | 'analise' | 'marketing';

export type Consentimento = {
  /** Sempre true: sem eles o site não funciona, e não são opcionais na LGPD. */
  essenciais: true;
  analise: boolean;
  marketing: boolean;
  /** ISO. A LGPD exige poder comprovar quando o consentimento foi dado. */
  data: string;
  /** Suba a versão quando as categorias mudarem: invalida escolhas antigas. */
  versao: number;
};

export const VERSAO_CONSENTIMENTO = 1;
const STORAGE_KEY = 'primora:consentimento';
export const CONSENT_EVENT = 'primora:consentimento-alterado';

export const CATEGORIAS: {
  id: Exclude<Categoria, 'essenciais'>;
  nome: string;
  descricao: string;
}[] = [
  {
    id: 'analise',
    nome: 'Estatísticas',
    descricao:
      'Permitem entender como as pessoas navegam pelo site, quais páginas são mais vistas e onde elas desistem. Os dados são agregados, sem identificar você.',
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    descricao:
      'Permitem medir o resultado de anúncios e exibir conteúdo relacionado à Primora em outras plataformas.',
  },
];

export function lerConsentimento(): Consentimento | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;

    const dados = JSON.parse(bruto) as Consentimento;
    /* Escolha feita sob outro conjunto de categorias precisa ser refeita. */
    if (dados.versao !== VERSAO_CONSENTIMENTO) return null;

    return dados;
  } catch {
    /* localStorage bloqueado (modo privado, política do navegador): trata
       como "ainda não decidiu" em vez de quebrar a página. */
    return null;
  }
}

export function salvarConsentimento(escolha: {
  analise: boolean;
  marketing: boolean;
}): Consentimento {
  const registro: Consentimento = {
    essenciais: true,
    analise: escolha.analise,
    marketing: escolha.marketing,
    data: new Date().toISOString(),
    versao: VERSAO_CONSENTIMENTO,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registro));
  } catch {
    /* Sem persistência, o banner reaparece na próxima visita — que é o
       comportamento correto: na dúvida, perguntar de novo. */
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: registro }));
  return registro;
}

/** Use antes de carregar qualquer script opcional. */
export function getConsent(categoria: Categoria): boolean {
  if (categoria === 'essenciais') return true;
  return lerConsentimento()?.[categoria] ?? false;
}

/** Abre o painel de preferências a partir de qualquer lugar (ex.: rodapé). */
export const ABRIR_PREFERENCIAS_EVENT = 'primora:abrir-preferencias';

export function abrirPreferencias() {
  window.dispatchEvent(new Event(ABRIR_PREFERENCIAS_EVENT));
}
