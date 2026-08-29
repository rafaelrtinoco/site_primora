import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  VARIANTS,
  VIEWPORT,
  staggerContainer,
  staggerDelay,
  type VariantName,
} from '../../lib/motion';

/* Mapa de módulo: chamar motion.create() dentro do render remontaria o nó a
   cada renderização. */
const TAGS = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  p: motion.p,
} as const;

type Tag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  variant?: VariantName;
  /** Posição no grupo: gera o atraso escalonado, com teto. */
  index?: number;
  delay?: number;
  className?: string;
};

/**
 * Entrada padrão de qualquer bloco ao surgir na tela.
 *
 * `prefers-reduced-motion` não é tratado aqui: o <MotionConfig reducedMotion="user">
 * em App.tsx cuida disso globalmente, preservando a opacidade e descartando o
 * deslocamento.
 */
export function Reveal({
  children,
  as = 'div',
  variant = 'fadeUp',
  index,
  delay,
  className,
}: RevealProps) {
  const Tag = TAGS[as];
  const computed = delay ?? staggerDelay(index ?? 0);

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={VARIANTS[variant]}
      transition={computed ? { delay: computed } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  as?: Tag;
  stagger?: number;
  className?: string;
};

/**
 * Container que escalona os filhos. Os filhos usam <RevealItem>, que apenas
 * declara os variants — o Framer propaga o estado do pai, então nenhum filho
 * repete initial/whileInView/viewport.
 */
export function RevealGroup({
  children,
  as = 'div',
  stagger = 0.06,
  className,
}: RevealGroupProps) {
  const Tag = TAGS[as];

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(stagger)}
      className={className}
    >
      {children}
    </Tag>
  );
}

type RevealItemProps = {
  children: ReactNode;
  as?: Tag;
  variant?: VariantName;
  className?: string;
};

export function RevealItem({
  children,
  as = 'div',
  variant = 'fadeUp',
  className,
}: RevealItemProps) {
  const Tag = TAGS[as];

  return (
    <Tag variants={VARIANTS[variant]} className={className}>
      {children}
    </Tag>
  );
}
