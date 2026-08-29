import type { Variants } from 'framer-motion';

/** Expo-out: acelera rápido e assenta devagar. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = { fast: 0.25, base: 0.5, slow: 0.7 } as const;

/** Dispara um pouco antes do elemento chegar ao centro da tela. */
export const VIEWPORT = {
  once: true,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
} as const;

/** 16px, e não os 30px de hoje: deslocamento curto lê como refinado. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE },
  },
};

export const VARIANTS = { fadeUp, fade, scaleIn } as const;
export type VariantName = keyof typeof VARIANTS;

export const staggerContainer = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

/**
 * Atraso com teto. Sinistros tem 10 cards com `delay: index * 0.1`, então o
 * último aparecia 0,9s depois — atraso perceptível. Aqui nunca passa de 0,30s.
 */
export const staggerDelay = (index = 0, step = 0.06, max = 5) =>
  Math.min(index, max) * step;
