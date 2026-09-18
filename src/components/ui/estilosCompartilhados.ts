/**
 * Classes reaproveitadas entre o formulário da CTA e o bot de triagem, para
 * as duas telas ficarem visualmente idênticas sem duplicar string de classe
 * e sem criar import circular entre `CTA.tsx` e `BotTriagem.tsx`.
 */

/* Sem focus:outline-none: o :focus-visible global do index.css é o indicador
   de foco de todo o site, e anulá-lo aqui abriria uma exceção justamente nos
   campos onde ele mais importa. */
export const campoClasses =
  'w-full rounded-frame border border-line bg-surface px-4 py-3 text-ink-body ' +
  'placeholder:text-ink-muted/70 transition-colors duration-200 focus:border-moss-700';

/* Antes era o verde do WhatsApp, fora da paleta da marca. Trocado pelo limão
   do tema para manter as cinco cores da Praxis em todo botão de ação:
   carbon-950 sobre acid-400 é a mesma combinação usada no Button primary,
   15.15:1 de contraste. */
export const BOTAO_WHATSAPP = 'bg-acid-400 text-carbon-950 hover:bg-acid-500';
