import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from './ui/WhatsAppIcon';
import { site } from '../content/site';

/**
 * Botão flutuante de WhatsApp.
 *
 * Só é renderizado quando existe um número real em `site.contato.whatsapp` —
 * um botão de contato que não leva a lugar nenhum é pior que a ausência dele.
 */
export default function WhatsAppFab() {
  const numero = site.contato.whatsapp;

  /* Só aparece depois que a pessoa rolou um pouco: no primeiro instante ela
     ainda está lendo o Hero, e um botão surgindo por cima disso atrapalha. */
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!numero) return;

    const onScroll = () => setVisivel(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [numero]);

  if (!numero) return null;

  const href = `https://wa.me/${numero}?text=${encodeURIComponent(
    site.contato.whatsappMensagem,
  )}`;

  return (
    <AnimatePresence>
      {visivel && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a Primora no WhatsApp"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25 }}
          className="group fixed bottom-5 right-5 z-[85] flex items-center gap-0 overflow-hidden rounded-control bg-[#25D366] py-4 pl-4 pr-4 text-white shadow-e3 transition-[gap,padding,background-color] duration-300 hover:bg-[#1DA851] md:hover:gap-2.5 md:hover:pr-5"
        >
          <WhatsAppIcon size={26} />
          {/* O rótulo se revela no hover em telas grandes; no toque, o ícone
              sozinho já é universalmente reconhecido. */}
          <span className="hidden max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-[12rem] group-hover:opacity-100 md:inline">
            Falar no WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
