import { Quotes } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';

export default function Testimonials() {
  /* Enquanto não houver depoimentos verificáveis, a seção inteira não é
     renderizada. Os anteriores eram inventados — inclusive "João Silva", que
     era também o placeholder do campo de nome do formulário. */
  if (site.depoimentos.length === 0) return null;

  return (
    <Section id="testimonials" tone="muted" labelledBy="testimonials-title">
      <SectionHeader
        id="testimonials-title"
        eyebrow="Clientes"
        title="O que nossos clientes dizem"
      />

      <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {site.depoimentos.map((depoimento) => (
          <RevealItem key={depoimento.nome} className="card relative p-8">
            <Quotes
              size={36}
              weight="fill"
              aria-hidden="true"
              className="absolute right-6 top-6 text-brand-100"
            />
            <blockquote className="relative z-10 text-ink-body">
              <p>{depoimento.quote}</p>
            </blockquote>
            <figcaption className="mt-8 border-t border-line pt-5">
              <p className="font-bold text-ink-strong">{depoimento.nome}</p>
              <p className="text-sm text-ink-muted">
                {depoimento.cargo} · {depoimento.empresa}
              </p>
            </figcaption>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
