import { site } from '../content/site';

/**
 * Monta o link de deep link do WhatsApp a partir de um texto já pronto.
 *
 * Devolve `null` quando `site.contato.whatsapp` for `null`, a mesma regra de
 * conteúdo do resto de `site.ts`: dado não confirmado, funcionalidade não
 * ativa. Os dois caminhos que entregam mensagem no WhatsApp (o formulário da
 * CTA e o bot de triagem) chamam esta função em vez de montar a URL cada um
 * do seu jeito.
 */
export function montarLinkWhatsApp(texto: string): string | null {
  if (!site.contato.whatsapp) return null;
  return `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/**
 * Abre o link do WhatsApp numa aba nova e diz se o navegador bloqueou o
 * popup.
 *
 * Precisa ser chamada de forma síncrona dentro do gesto de clique: se vier
 * depois de qualquer `await`, o navegador trata como abertura não solicitada
 * e bloqueia a aba.
 */
export function abrirWhatsApp(href: string): boolean {
  const janela = window.open(href, '_blank', 'noopener');
  return janela === null;
}
