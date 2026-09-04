import type { ReactNode } from 'react';
import type { Icon, IconWeight } from '@phosphor-icons/react';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'brand' | 'acid' | 'invert' | 'outlineDark';

/**
 * Phosphor no peso `duotone`: a camada secundária é pintada com a mesma
 * currentColor em opacidade reduzida, o que dá massa visual ao ícone em vez
 * do traço fino de 1,5px que fazia os ícones anteriores parecerem frágeis.
 */
const SIZES: Record<Size, { frame: string; icon: number }> = {
  sm: { frame: 'size-10', icon: 22 },
  md: { frame: 'size-13', icon: 26 },
  lg: { frame: 'size-16', icon: 30 },
};

/* Hierarquia por profundidade, não por matiz — a paleta tem um acento só.
   Sobre fundo claro a moldura é escura com ícone limão (9.33:1); o inverso,
   ícone limão direto sobre branco, daria 1.32:1 e é proibido no sistema. */
const TONES: Record<Tone, string> = {
  brand: 'bg-moss-700 text-acid-400',
  acid: 'bg-acid-400 text-carbon-950',
  invert: 'bg-white/8 text-acid-400 ring-1 ring-inset ring-white/12',
  outlineDark: 'bg-carbon-950 text-acid-400 ring-1 ring-inset ring-white/15',
};

type IconFrameProps = {
  /** Passe o componente do ícone, não um elemento já instanciado */
  icon?: Icon;
  /** Escape hatch para conteúdo textual, como os números 01–05 do Process */
  children?: ReactNode;
  size?: Size;
  tone?: Tone;
  weight?: IconWeight;
  className?: string;
};

export default function IconFrame({
  icon: Icon,
  children,
  size = 'md',
  tone = 'brand',
  weight = 'duotone',
  className = '',
}: IconFrameProps) {
  const s = SIZES[size];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-frame ${s.frame} ${TONES[tone]} ${className}`}
    >
      {Icon ? (
        <Icon size={s.icon} weight={weight} aria-hidden="true" />
      ) : (
        <span className="text-base font-bold tabular-nums">{children}</span>
      )}
    </span>
  );
}
