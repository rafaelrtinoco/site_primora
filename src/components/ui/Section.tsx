import type { ReactNode } from 'react';

type Tone = 'default' | 'muted' | 'tint' | 'invert';

const TONES: Record<Tone, string> = {
  default: 'bg-surface',
  muted: 'bg-surface-muted',
  tint: 'bg-surface-tint',
  invert: 'bg-surface-invert text-on-dark-body',
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
 * Resolve de uma vez, nas 12 seções: o ritmo vertical (que hoje varia entre
 * py-20, py-24 e pt-32 pb-20), o `scroll-mt` que compensa a navbar fixa de
 * ~112px (sem ele todo link de menu esconde o título da seção), o
 * aria-labelledby e a alternância de fundo.
 */
export default function Section({
  id,
  children,
  tone = 'default',
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
