import { motion } from 'framer-motion';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import IconFrame from './ui/IconFrame';
import { RevealGroup, RevealItem } from './ui/Reveal';
import { EASE, VIEWPORT } from '../lib/motion';
import { site } from '../content/site';

const steps = [
  {
    number: '01',
    title: 'Diagnóstico',
    desc: 'Analisamos sua presença digital, seu funil e seu momento de mercado.',
  },
  {
    number: '02',
    title: 'Planejamento',
    desc: 'Definimos posicionamento, canais e metas para os próximos ciclos.',
  },
  {
    number: '03',
    title: 'Produção',
    desc: 'Construímos site, conteúdo e automações da sua estrutura.',
  },
  {
    number: '04',
    title: 'Entrega',
    desc: 'Colocamos tudo no ar e treinamos você para operar o dia a dia.',
  },
  {
    number: '05',
    title: 'Otimização',
    desc: 'Acompanhamos os números e ajustamos a estratégia todo mês.',
  },
];

export default function Process() {
  return (
    <Section id="process" tone="muted" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        eyebrow="Como funciona"
        title="Um processo transparente, do diagnóstico à otimização"
        description={`Cada etapa tem entregável e prazo definidos. Sua estrutura de base entra no ar em ${site.prazoEntrega}.`}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Trilho da timeline — decorativo, só a partir de lg */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-8 hidden h-px w-full bg-line-strong lg:block"
        />
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute left-0 top-8 hidden h-px w-full origin-left bg-brand-500 lg:block"
        />

        {/* <ol> porque é uma sequência ordenada — antes eram divs soltas.
            Era md:grid-cols-5 (≈114px por passo em 768px). */}
        <RevealGroup
          as="ul"
          stagger={0.08}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {steps.map((step) => (
            <RevealItem
              key={step.number}
              as="li"
              className="relative flex flex-col items-center text-center"
            >
              <IconFrame size="lg" tone="outline" className="relative z-10 bg-surface">
                {step.number}
              </IconFrame>
              <h3 className="mb-2 mt-5 font-bold text-ink-strong">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {step.desc}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
