import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from '@phosphor-icons/react';
import {
  CATEGORIAS,
  ABRIR_PREFERENCIAS_EVENT,
  lerConsentimento,
  salvarConsentimento,
} from '../lib/consent';

export default function CookieConsent() {
  /* Inicializador lazy: o app é 100% client-side, então ler o localStorage já
     na primeira renderização é seguro e evita o banner piscar depois da
     montagem. `lerConsentimento` trata storage bloqueado internamente. */
  const [salvoInicial] = useState(lerConsentimento);
  const [bannerVisivel, setBannerVisivel] = useState(salvoInicial === null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [analise, setAnalise] = useState(salvoInicial?.analise ?? false);
  const [marketing, setMarketing] = useState(salvoInicial?.marketing ?? false);

  const painelRef = useRef<HTMLDivElement>(null);
  const focoAnterior = useRef<HTMLElement | null>(null);

  const abrirPainel = useCallback(() => {
    focoAnterior.current = document.activeElement as HTMLElement;
    const salvo = lerConsentimento();
    setAnalise(salvo?.analise ?? false);
    setMarketing(salvo?.marketing ?? false);
    setPainelAberto(true);
  }, []);

  useEffect(() => {
    window.addEventListener(ABRIR_PREFERENCIAS_EVENT, abrirPainel);
    return () => window.removeEventListener(ABRIR_PREFERENCIAS_EVENT, abrirPainel);
  }, [abrirPainel]);

  const fecharPainel = useCallback(() => {
    setPainelAberto(false);
    focoAnterior.current?.focus();
  }, []);

  /* Esc fecha e Tab fica preso dentro do painel enquanto ele está aberto. */
  useEffect(() => {
    if (!painelAberto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        fecharPainel();
        return;
      }
      if (e.key !== 'Tab' || !painelRef.current) return;

      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    painelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [painelAberto, fecharPainel]);

  function decidir(escolha: { analise: boolean; marketing: boolean }) {
    salvarConsentimento(escolha);
    setAnalise(escolha.analise);
    setMarketing(escolha.marketing);
    setBannerVisivel(false);
    setPainelAberto(false);
    focoAnterior.current?.focus();
  }

  return (
    <>
      <AnimatePresence>
        {bannerVisivel && !painelAberto && (
          <motion.div
            role="region"
            aria-label="Aviso de privacidade"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-6"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-panel border border-line bg-surface p-6 shadow-e3 lg:flex-row lg:items-center lg:gap-8">
              <Cookie
                size={32}
                weight="duotone"
                aria-hidden="true"
                className="hidden shrink-0 text-brand-600 lg:block"
              />

              <p className="grow text-sm leading-relaxed text-ink-muted">
                Usamos armazenamento essencial para o site funcionar. Com a sua
                autorização, também usaremos cookies para entender como o site é
                usado e para medir campanhas. Você escolhe — e pode mudar
                quando quiser.{' '}
                <a
                  href="/privacidade.html"
                  className="font-semibold text-ink-brand underline underline-offset-2"
                >
                  Política de Privacidade
                </a>
              </p>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={abrirPainel}
                  className="rounded-control px-5 py-3 text-sm font-semibold text-ink-brand transition-colors duration-200 hover:bg-brand-50"
                >
                  Personalizar
                </button>
                <button
                  type="button"
                  onClick={() => decidir({ analise: false, marketing: false })}
                  className="rounded-control border border-line-strong px-5 py-3 text-sm font-semibold text-ink-body transition-colors duration-200 hover:border-brand-400 hover:text-ink-brand"
                >
                  Rejeitar não essenciais
                </button>
                <button
                  type="button"
                  onClick={() => decidir({ analise: true, marketing: true })}
                  className="rounded-control bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-e1 transition-colors duration-200 hover:bg-brand-800"
                >
                  Aceitar todos
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {painelAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-end justify-center bg-brand-950/50 p-4 sm:items-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) fecharPainel();
            }}
          >
            <motion.div
              ref={painelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="consent-titulo"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-panel bg-surface p-6 shadow-e3 sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <h2
                  id="consent-titulo"
                  className="text-xl font-bold text-ink-strong"
                >
                  Preferências de privacidade
                </h2>
                <button
                  type="button"
                  onClick={fecharPainel}
                  aria-label="Fechar preferências"
                  className="-m-2 rounded-frame p-2 text-ink-muted transition-colors hover:bg-brand-50 hover:text-ink-brand"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-card border border-line bg-surface-muted p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-ink-strong">
                      Essenciais
                    </h3>
                    <span className="rounded-control bg-brand-100 px-3 py-1 text-xs font-semibold text-ink-brand">
                      Sempre ativos
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">
                    Necessários para o site funcionar e para lembrar esta sua
                    escolha. Não podem ser desativados.
                  </p>
                </div>

                {CATEGORIAS.map((categoria) => {
                  const ativo = categoria.id === 'analise' ? analise : marketing;
                  const setAtivo =
                    categoria.id === 'analise' ? setAnalise : setMarketing;

                  return (
                    <div
                      key={categoria.id}
                      className="rounded-card border border-line p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <label
                          htmlFor={`consent-${categoria.id}`}
                          className="font-semibold text-ink-strong"
                        >
                          {categoria.nome}
                        </label>
                        <input
                          id={`consent-${categoria.id}`}
                          type="checkbox"
                          checked={ativo}
                          onChange={(e) => setAtivo(e.target.checked)}
                          className="mt-1 size-5 shrink-0 rounded border-line-strong text-brand-700"
                        />
                      </div>
                      <p className="mt-2 text-sm text-ink-muted">
                        {categoria.descricao}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-xs leading-relaxed text-ink-muted">
                Hoje o site ainda não carrega nenhuma ferramenta de estatística
                ou marketing. Sua escolha fica registrada e passa a valer
                automaticamente caso alguma seja adotada. Detalhes na{' '}
                <a
                  href="/privacidade.html"
                  className="font-semibold text-ink-brand underline underline-offset-2"
                >
                  Política de Privacidade
                </a>
                .
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => decidir({ analise: false, marketing: false })}
                  className="grow rounded-control border border-line-strong px-5 py-3 text-sm font-semibold text-ink-body transition-colors duration-200 hover:border-brand-400 hover:text-ink-brand"
                >
                  Rejeitar não essenciais
                </button>
                <button
                  type="button"
                  onClick={() => decidir({ analise, marketing })}
                  className="grow rounded-control bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-e1 transition-colors duration-200 hover:bg-brand-800"
                >
                  Salvar preferências
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
