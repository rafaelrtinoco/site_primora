import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Logo from '/primora_horizontal.png';

const navLinks = [
  { name: 'Marketing', href: '#solutions' },
  { name: 'Assessoria', href: '#assessoria' },
  { name: 'Como Funciona', href: '#process' },
  { name: 'Planos', href: '#plans' },
  { name: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  /* Sobre o Hero escuro o menu é transparente; ao rolar vira sólido claro.
     O logo é azul-marinho, então precisa ser invertido para branco enquanto
     está sobre o fundo escuro — senão fica ilegível. */
  const overHero = !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-[background-color,box-shadow,padding] duration-300 ${
        overHero
          ? 'bg-transparent py-5'
          : 'bg-surface/90 py-3 shadow-e1 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <a href="#hero" className="flex items-center" aria-label="Primora Soluções — início">
            <img
              src={Logo}
              alt="Primora Soluções"
              className={`h-10 w-auto transition-[filter] duration-300 ${
                overHero ? 'brightness-0 invert' : ''
              }`}
            />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  overHero
                    ? 'text-on-dark-body hover:text-on-dark'
                    : 'text-ink-muted hover:text-ink-brand'
                }`}
              >
                {link.name}
              </a>
            ))}
            <Button
              href="#cta"
              size="md"
              variant={overHero ? 'inverse' : 'primary'}
            >
              Diagnóstico gratuito
            </Button>
          </nav>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden ${overHero ? 'text-on-dark' : 'text-ink-strong'}`}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X size={26} weight="bold" />
            ) : (
              <List size={26} weight="bold" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full w-full border-b border-line bg-surface shadow-e2 lg:hidden"
          >
            <nav
              aria-label="Principal (mobile)"
              className="flex flex-col gap-1 px-4 py-5"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-frame px-3 py-3 text-base font-medium text-ink-body transition-colors duration-200 hover:bg-brand-50 hover:text-ink-brand"
                >
                  {link.name}
                </a>
              ))}
              <Button
                href="#cta"
                size="md"
                fullWidth
                className="mt-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Diagnóstico gratuito
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
