import type { ComponentProps, ReactNode } from 'react';
import type { Icon } from '@phosphor-icons/react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'md' | 'lg';

/* Fundo sólido, sem gradiente: o gradiente em botão é justamente o que faz o
   site ler como template gerado. Branco sobre brand-700 dá 8.67:1. */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-e1 hover:shadow-e2',
  secondary:
    'bg-surface text-ink-brand border border-line-strong hover:border-brand-400 hover:text-brand-800',
  ghost: 'bg-brand-50 text-ink-brand hover:bg-brand-100',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50 shadow-e2',
};

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-control font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out ' +
  'hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  fullWidth?: boolean;
  className?: string;
};

type AnchorProps = BaseProps &
  Omit<ComponentProps<'a'>, keyof BaseProps> & { href: string };
type ButtonProps = BaseProps &
  Omit<ComponentProps<'button'>, keyof BaseProps> & { href?: undefined };

export default function Button(props: AnchorProps | ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'lg',
    icon: Icon,
    fullWidth,
    className = '',
    ...rest
  } = props;

  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  const content = (
    <>
      {children}
      {Icon && <Icon size={18} weight="bold" aria-hidden="true" />}
    </>
  );

  if (typeof rest.href === 'string') {
    const anchorProps = rest as ComponentProps<'a'>;
    return (
      <a {...anchorProps} className={classes}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ComponentProps<'button'>;
  return (
    <button {...buttonProps} type={buttonProps.type ?? 'button'} className={classes}>
      {content}
    </button>
  );
}
