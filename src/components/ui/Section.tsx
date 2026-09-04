import type { ReactNode } from 'react';

type Tone = 'light' | 'muted' | 'dark' | 'darkAlt' | 'moss';

const TONES: Record<Tone, string> = {
  light: 'bg-surface text-ink-body',
  muted: 'bg-surface-muted text-ink-body',
  dark: 'bg-surface-dark text-on-dark-body',
  darkAlt: 'bg-surface-dark-alt text-on-dark-body',
  moss: 'bg-surface-moss text-on-dark-body',
};

type SectionProps = {
  id: string;
  children: ReactNode;
  tone?: Tone;
  /** id do <h2> da seção, para o aria-labelledby */
  labelledBy?: string;
  className?: string;
  /** Desliga o container interno, para seções que sangram até a borda */
  bleed?: boolean;
};

/**
 * Wrapper único de seção.
 *
 * Resolve de uma vez, em todas as seções: o ritmo vertical, o `scroll-mt` que
 * compensa a navbar fixa de ~112px (sem ele todo link de menu esconde o título
 * da seção), o aria-labelledby e a alternância de fundo.
 *
 * O padrão é `dark` porque a página passou a ser escura na maior parte: as
 * seções claras (Serviços e FAQ) é que são a exceção declarada.
 */
export default function Section({
  id,
  children,
  tone = 'dark',
  labelledBy,
  className = '',
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-28 py-20 md:py-28 ${TONES[tone]} ${className}`}
    >
      {bleed ? (
        children
      ) : (
        <div className="container mx-auto px-4 lg:px-8">{children}</div>
      )}
    </section>
  );
}
