import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { EASE } from '../../lib/motion';

type CounterProps = {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Número que conta ao entrar na tela.
 *
 * Este é um dos poucos pontos em que `prefers-reduced-motion` precisa de
 * tratamento explícito: o comportamento correto é *pular* para o valor final,
 * não animar mais devagar — algo que o MotionConfig global não consegue fazer.
 */
export default function Counter({
  to,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const [animated, setAnimated] = useState(0);

  useMotionValueEvent(value, 'change', (latest) => setAnimated(latest));

  useEffect(() => {
    if (reduced || !inView) return;

    const controls = animate(value, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, to, duration, value]);

  /* Derivado, não armazenado: com movimento reduzido o número já nasce no
     valor final, sem passar por um setState dentro do effect. */
  const display = reduced ? to : animated;

  const format = (n: number) =>
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <span ref={ref} className={className}>
      {/* tabular-nums evita o jitter de largura enquanto o número sobe */}
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {format(display)}
        {suffix}
      </span>
      {/* O leitor de tela recebe só o valor final, nunca um intermediário */}
      <span className="sr-only">
        {prefix}
        {format(to)}
        {suffix}
      </span>
    </span>
  );
}
