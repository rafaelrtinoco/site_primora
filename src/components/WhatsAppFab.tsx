import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCircleDots, X } from '@phosphor-icons/react';
import WhatsAppIcon from './ui/WhatsAppIcon';
import CeciChat from './ceci/CeciChat';
import { site } from '../content/site';

/**
 * Botão flutuante. Antes ia direto pro WhatsApp com um clique; agora abre um
 * menu com duas opções, falar direto ou fazer a triagem guiada com a Ceci,
 * em vez de dois botões empilhados no mesmo canto da tela.
 *
 * Usa o limão do tema (acid-400/carbon-950) no botão principal, não o verde
 * da marca do WhatsApp: mantém as cinco cores da Praxis em todo botão de
 * ação, em vez de uma sexta cor isolada só para este componente.
 *
 * Só é renderizado quando existe um número real em `site.contato.whatsapp` —
 * um botão de contato que não leva a lugar nenhum é pior que a ausência dele.
 */
export default function WhatsAppFab() {
  const numero = site.contato.whatsapp;

  /* Só aparece depois que a pessoa rolou um pouco: no primeiro instante ela
     ainda está lendo o Hero, e um botão surgindo por cima disso atrapalha. */
  const [visivel, setVisivel] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [ceciAberta, setCeciAberta] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const primeiraOpcaoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!numero) return;

    const onScroll = () => setVisivel(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [numero]);

  /* Clique fora ou Esc fecham só o menu de duas opções, não o chat da Ceci
     (esse tem o próprio Esc, tratado dentro de CeciChat). */
  useEffect(() => {
    if (!menuAberto) return;

    function aoClicarFora(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuAberto(false);
        botaoRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    primeiraOpcaoRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [menuAberto]);

  if (!numero) return null;

  const hrefDireto = `https://wa.me/${numero}?text=${encodeURIComponent(
    site.contato.whatsappMensagem,
  )}`;

  function alternar() {
    if (ceciAberta) {
      setCeciAberta(false);
      return;
    }
    setMenuAberto((aberto) => !aberto);
  }

  return (
    <>
      <AnimatePresence>
        {visivel && (
          <motion.div
            ref={wrapperRef}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-[85]"
          >
            {/* Botão primeiro no DOM, mesmo que o menu apareça visualmente
                acima dele: se viesse antes, o Tab alcançaria as opções do
                menu fechado antes do botão que o abre. */}
            <button
              ref={botaoRef}
              type="button"
              onClick={alternar}
              aria-haspopup={ceciAberta ? undefined : 'menu'}
              aria-expanded={menuAberto || ceciAberta}
              aria-label={ceciAberta ? 'Fechar chat da Ceci' : 'Falar com a Praxis Digital'}
              className="flex items-center justify-center rounded-control bg-acid-400 p-4 text-carbon-950 shadow-e3 transition-colors duration-200 hover:bg-acid-500"
            >
              {ceciAberta ? (
                <X size={26} weight="bold" />
              ) : (
                <WhatsAppIcon size={26} />
              )}
            </button>

            <AnimatePresence>
              {menuAberto && !ceciAberta && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-3 w-64 overflow-hidden rounded-card border border-line bg-surface shadow-e3"
                >
                  <a
                    ref={primeiraOpcaoRef}
                    href={hrefDireto}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuAberto(false)}
                    className="flex items-center gap-3 border-b border-line px-4 py-3 text-sm font-semibold text-ink-body transition-colors duration-200 hover:bg-surface-muted"
                  >
                    <WhatsAppIcon size={20} />
                    Falar agora
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAberto(false);
                      setCeciAberta(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink-body transition-colors duration-200 hover:bg-surface-muted"
                  >
                    <ChatCircleDots
                      size={20}
                      weight="duotone"
                      aria-hidden="true"
                      className="text-ink-accent"
                    />
                    Fazer triagem com a Ceci
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ceciAberta && (
          <CeciChat
            key="ceci-chat"
            onFechar={() => {
              setCeciAberta(false);
              botaoRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
