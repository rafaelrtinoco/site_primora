import type { ComponentProps, ReactNode } from 'react';
import type { Icon } from '@phosphor-icons/react';

type Variant = 'primary' | 'dark' | 'outline' | 'outlineDark';
type Size = 'md' | 'lg';

/* Fundo sólido, sem gradiente: o gradiente em botão é justamente o que faz o
   site ler como template gerado.

   `primary` é o botão limão, e ele funciona nas duas famílias de fundo porque
   o texto é carbon-950 sobre #DBEB17 — 15.15:1. O limão só é seguro assim,
   como preenchimento: como cor de texto sobre branco ele daria 1.32:1. */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-acid-400 text-carbon-950 hover:bg-acid-500 shadow-e1 hover:shadow-e2',
  dark: 'bg-carbon-950 text-on-dark hover:bg-moss-700 shadow-e1 hover:shadow-e2',
  outline:
    'border border-line-strong text-ink-body hover:border-moss-700 hover:text-ink-strong',
  outlineDark:
    'border border-white/25 text-on-dark hover:border-acid-400 hover:text-acid-400',
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
