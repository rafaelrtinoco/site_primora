import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import Button from './ui/Button';
import Counter from './ui/Counter';
import { site } from '../content/site';
import { DUR, EASE } from '../lib/motion';

/* Acima da dobra usa initial/animate, não whileInView: o conteúdo já está
   visível no carregamento e whileInView causaria um piscar. */
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.base, ease: EASE, delay },
});

function StatsBand() {
  const temMetricas = site.metricas.length > 0;

  return (
    <div className="border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        {temMetricas ? (
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {site.metricas.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-2 py-8 md:py-10 ${
                  i > 0 ? 'md:border-l md:border-white/10' : ''
                } ${i % 2 === 1 ? 'border-l border-white/10 md:border-l' : ''}`}
              >
                <dd className="text-3xl font-bold text-on-dark md:text-4xl">
                  <Counter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </dd>
                <dt className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-dark-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : (
          /* Fallback qualitativo enquanto não houver números confirmados.
             Mesmo peso visual, zero risco de publicar dado inventado. */
          <ul className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-4">
            {site.diferenciais.map((item, i) => (
              <li
                key={item}
                className={`px-2 py-6 text-sm font-medium text-on-dark-body md:py-8 ${
                  i > 0 ? 'md:border-l md:border-white/10' : ''
                }`}
              >
                <span className="mr-3 text-on-dark-accent" aria-hidden="true">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-surface-invert"
    >
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="container mx-auto px-4 pb-16 pt-36 md:pb-24 md:pt-48 lg:px-8">
        <motion.p
          {...enter(0)}
          className="eyebrow mb-6 text-on-dark-accent"
        >
          Marketing e assessoria operacional para corretoras
        </motion.p>

        {/* Sem animação de opacidade: este h1 é o elemento de LCP da página e
            animá-lo a partir de 0 atrasaria a métrica. */}
        <h1 id="hero-title" className="hero-title text-on-dark">
          <span className="block">Estrutura digital</span>
          <span className="block">para corretoras</span>
          <span className="block text-on-dark-accent">que querem crescer.</span>
        </h1>

        <motion.p
          {...enter(0.12)}
          className="hero-sub mt-8 text-on-dark-body"
        >
          Você vende. A gente cuida do operacional, do marketing que atrai
          clientes ao back-office que sustenta a carteira.
        </motion.p>

        <motion.div
          {...enter(0.2)}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Button href="#cta" variant="inverse" size="lg" icon={ArrowRight}>
            Agendar diagnóstico
          </Button>
          <a
            href="#solutions"
            className="inline-flex items-center justify-center px-2 py-2 font-semibold text-on-dark-body underline-offset-8 transition-colors duration-200 hover:text-on-dark hover:underline"
          >
            Conhecer soluções
          </a>
        </motion.div>
      </div>

      <StatsBand />
    </section>
  );
}
