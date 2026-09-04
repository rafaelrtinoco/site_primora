import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Logo from '/praxis-horizontal-lime.png';

const navLinks = [
  { name: 'Serviços', href: '#solutions' },
  { name: 'Tráfego pago', href: '#trafego' },
  { name: 'IA', href: '#ia' },
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

  /* A barra é sempre escura depois do scroll, inclusive por cima das seções
     claras. Isso mantém um único arquivo de logo em uso — o horizontal limão —
     e evita a troca de imagem no meio da rolagem.
     O logo novo é colorido: nada de `brightness-0 invert`, que achataria o
     degradê do símbolo numa mancha branca. */
  const transparente = !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-[background-color,box-shadow,padding] duration-300 ${
        transparente
          ? 'bg-transparent py-5'
          : 'bg-carbon-900/95 py-3 shadow-e2 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <a
            href="#hero"
            className="flex items-center"
            aria-label="Praxis Digital — início"
          >
            <img src={Logo} alt="Praxis Digital" className="h-9 w-auto md:h-10" />
          </a>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-on-dark-body transition-colors duration-200 hover:text-acid-400"
              >
                {link.name}
              </a>
            ))}
            <Button href="#cta" size="md">
              Diagnóstico gratuito
            </Button>
          </nav>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="text-on-dark lg:hidden"
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
            className="absolute left-0 top-full w-full border-b border-white/10 bg-carbon-900 shadow-e3 lg:hidden"
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
                  className="rounded-frame px-3 py-3 text-base font-medium text-on-dark-body transition-colors duration-200 hover:bg-white/5 hover:text-acid-400"
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
