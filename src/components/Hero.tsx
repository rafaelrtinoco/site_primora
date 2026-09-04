import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import Button from './ui/Button';
import Counter from './ui/Counter';
import Simbolo from '/praxis-simbolo.png';
import { site } from '../content/site';
import { DUR, EASE } from '../lib/motion';

/* Acima da dobra usa initial/animate, não whileInView: o conteúdo já está
   visível no carregamento e whileInView causaria um piscar. */
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.base, ease: EASE, delay },
});

/**
 * Faixa de setores em loop.
 *
 * A lista é renderizada duas vezes e o trilho anda -50%, então a emenda cai
 * exatamente onde a cópia começa e o loop não tem costura visível. A cópia
 * inteira é `aria-hidden` e o leitor de tela recebe a lista real, uma vez só.
 *
 * A animação é CSS (`.marquee-track`), fora do alcance do MotionConfig — o
 * `prefers-reduced-motion` dela está declarado no index.css.
 */
function SetoresMarquee() {
  const nomes = site.setores.map((s) => s.nome);

  return (
    <div className="border-y border-white/10 py-5">
      <ul className="sr-only">
        {nomes.map((nome) => (
          <li key={nome}>{nome}</li>
        ))}
      </ul>

      <div className="overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copia) => (
            <div key={copia} className="flex shrink-0 items-center">
              {nomes.map((nome) => (
                <span key={nome} className="flex items-center">
                  <span className="whitespace-nowrap px-8 text-sm font-semibold uppercase tracking-[0.18em] text-on-dark-muted">
                    {nome}
                  </span>
                  <span className="size-1.5 shrink-0 rounded-full bg-acid-400" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricasBand() {
  return (
    <div className="border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
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
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-surface-dark"
    >
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      {/* Símbolo da marca girando devagar atrás do título. Fica em opacidade
          muito baixa de propósito: ele é textura, não ilustração. */}
      <img
        src={Simbolo}
        alt=""
        aria-hidden="true"
        className="hero-symbol -right-[18%] top-[6%] w-[min(78vw,640px)] md:-right-[8%]"
      />

      <div className="container mx-auto px-4 pb-16 pt-36 md:pb-24 md:pt-48 lg:px-8">
        <motion.p {...enter(0)} className="eyebrow mb-6 text-on-dark-accent">
          Marketing digital, conteúdo e tráfego pago
        </motion.p>

        {/* Sem animação de opacidade: este h1 é o elemento de LCP da página e
            animá-lo a partir de 0 atrasaria a métrica. */}
        <h1 id="hero-title" className="hero-title text-on-dark">
          <span className="block">Marketing digital</span>
          <span className="block">para quem depende</span>
          <span className="block text-on-dark-accent">
            de confiança para vender.
          </span>
        </h1>

        <motion.p {...enter(0.12)} className="hero-sub mt-8 text-on-dark-body">
          Conteúdo, site e anúncio para corretoras, imobiliárias, escritórios de
          contabilidade e advocacia — com IA no processo e gente decidindo o que
          vai ao ar.
        </motion.p>

        <motion.div
          {...enter(0.2)}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Button href="#cta" size="lg" icon={ArrowRight}>
            Agendar diagnóstico
          </Button>
          <a
            href="#plans"
            className="inline-flex items-center justify-center px-2 py-2 font-semibold text-on-dark-body underline-offset-8 transition-colors duration-200 hover:text-on-dark hover:underline"
          >
            Ver planos e preços
          </a>
        </motion.div>
      </div>

      {/* A faixa de métricas só existe se houver número confirmado. Enquanto
          `site.metricas` estiver vazia, os setores atendidos ocupam o lugar —
          é informação verdadeira, e não um número ilustrativo. */}
      {site.metricas.length > 0 && <MetricasBand />}
      <SetoresMarquee />
    </section>
  );
}
