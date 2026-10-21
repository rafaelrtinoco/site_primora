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

/* Mesmo campo, sobre superfície escura. A separação vem da borda clara e de um
   fundo levemente mais claro que a seção, pela mesma razão do `.card-dark`:
   sombra não se lê sobre carbon-950. A borda de foco é o limão, que no escuro
   tem 9.33:1 e é o acento legítimo. */
export const campoClassesEscuro =
  'w-full rounded-frame border border-white/12 bg-white/5 px-4 py-3 text-on-dark ' +
  'placeholder:text-on-dark-muted/60 transition-colors duration-200 focus:border-acid-400';

/* Antes era o verde do WhatsApp, fora da paleta da marca. Trocado pelo limão
   do tema para manter as cinco cores da Praxis em todo botão de ação:
   carbon-950 sobre acid-400 é a mesma combinação usada no Button primary,
   15.15:1 de contraste. */
export const BOTAO_WHATSAPP = 'bg-acid-400 text-carbon-950 hover:bg-acid-500';
