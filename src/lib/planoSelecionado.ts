/**
 * Ponte entre a seção de Planos e o formulário da CTA.
 *
 * O site não tem router, então não há querystring para carregar a escolha.
 * Um evento de janela resolve sem dependência nova — e o campo continua sendo
 * um <select> normal, então funciona mesmo que o evento não chegue.
 */
export const PLANO_EVENT = 'praxis:plano-selecionado';

/** Valor usado quando o visitante chega pelo bloco de tráfego pago. */
export const INTERESSE_TRAFEGO = 'Gestão de tráfego pago';
