import type { ReactNode } from 'react';
import { RevealGroup, RevealItem } from './Reveal';

type SectionHeaderProps = {
  title: ReactNode;
  /** Faq e Process não têm subtítulo — por isso opcional */
  description?: ReactNode;
  eyebrow?: string;
  /** Deve casar com o labelledBy da <Section> */
  id?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
};

/**
 * Cabeçalho de seção. Congela o que hoje diverge entre as 7 cópias:
 * mb-16 vs mb-20, mb-4 vs mb-6 e max-w-2xl vs max-w-3xl.
 */
export default function SectionHeader({
  title,
  description,
  eyebrow,
  id,
  align = 'center',
  tone = 'light',
}: SectionHeaderProps) {
  const dark = tone === 'dark';

  return (
    <RevealGroup
      className={`mb-14 max-w-[46rem] md:mb-16 ${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      }`}
    >
      {eyebrow && (
        <RevealItem
          as="p"
          className={`eyebrow mb-4 ${dark ? 'text-on-dark-accent' : 'text-ink-brand'}`}
        >
          {eyebrow}
        </RevealItem>
      )}

      <RevealItem>
        <h2
          id={id}
          className={`text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-bold ${
            dark ? 'text-on-dark' : 'text-ink-strong'
          }`}
        >
          {title}
        </h2>
      </RevealItem>

      {description && (
        <RevealItem
          as="p"
          className={`mt-5 text-lg ${dark ? 'text-on-dark-body' : 'text-ink-muted'}`}
        >
          {description}
        </RevealItem>
      )}
    </RevealGroup>
  );
}
