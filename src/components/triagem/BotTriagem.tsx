import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { campoClasses, BOTAO_WHATSAPP } from '../ui/estilosCompartilhados';
import { useTriagem } from './useTriagem';
import { DUR, EASE } from '../../lib/motion';

type BotTriagemProps = {
  /** Chamado depois que o link do WhatsApp já foi aberto (ou tentado). */
  onEnviar: (linkWhatsApp: string, popupBloqueado: boolean) => void;
  onVoltarFormulario: () => void;
};

/* Cada passo entra com o mesmo deslocamento curto do Hero (Hero.tsx), não
   com <Reveal>: o painel já está visível quando o passo troca, e
   whileInView num nó que monta dentro da viewport pisca. O MotionConfig de
   App.tsx cuida do prefers-reduced-motion, porque isto é framer-motion. */
const entradaPasso = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.base, ease: EASE },
};

/**
 * Alternativa ao formulário da CTA para quem chega sem saber o que precisa.
 * Pergunta de escolha única, sem texto livre além do nome no passo final; ao
 * final monta a mesma mensagem em formato `*Campo:*` que o formulário usa e
 * entrega pelo mesmo `wa.me` (src/lib/whatsapp.ts, via useTriagem). Nenhum
 * resultado ou diagnóstico é fabricado: o bot só coleta e repassa.
 */
export default function BotTriagem({ onEnviar, onVoltarFormulario }: BotTriagemProps) {
  const { perguntas, passo, respostas, ultimoPasso, responder, voltar, enviar } =
    useTriagem({ onEnviar });

  const tituloRef = useRef<HTMLLegendElement>(null);
  const tituloFinalRef = useRef<HTMLHeadingElement>(null);

  /* Sem isso o teclado fica preso no passo anterior: cada pergunta nova
     precisa levar o foco, mesma técnica de CookieConsent.tsx. */
  useEffect(() => {
    if (ultimoPasso) {
      tituloFinalRef.current?.focus();
    } else {
      tituloRef.current?.focus();
    }
  }, [passo, ultimoPasso]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const dados = new FormData(form);
    enviar(
      String(dados.get('nome') ?? '').trim(),
      String(dados.get('_honey') ?? ''),
    );
  }

  return (
    <div className="mt-6">
      <p className="text-sm leading-relaxed text-ink-muted">
        É assim que funciona o atendimento automatizado que instalamos no seu
        WhatsApp: menu, resposta fixa, e uma pessoa quando sai do roteiro.
      </p>

      {!ultimoPasso ? (
        <motion.div key={passo} {...entradaPasso} className="mt-6">
          <p role="status" aria-live="polite" className="eyebrow text-ink-accent">
            Pergunta {passo + 1} de {perguntas.length}
            <span className="sr-only">: {perguntas[passo].pergunta}</span>
          </p>

          <fieldset className="m-0 mt-2 min-w-0 border-0 p-0">
            <legend
              ref={tituloRef}
              tabIndex={-1}
              className="p-0 text-lg font-bold text-ink-strong outline-none"
            >
              {perguntas[passo].pergunta}
            </legend>

            <div className="mt-4 flex flex-col gap-2">
              {perguntas[passo].opcoes.map((opcao) => {
                const selecionada = respostas[passo] === opcao.rotulo;
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    onClick={() => responder(opcao.rotulo)}
                    aria-pressed={selecionada}
                    className={`flex w-full items-center gap-2 rounded-frame border px-4 py-3 text-left transition-colors duration-200 ${
                      selecionada
                        ? 'border-moss-700 bg-surface-muted font-semibold text-ink-strong'
                        : 'border-line text-ink-body hover:border-moss-700 hover:text-ink-strong'
                    }`}
                  >
                    {selecionada && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        aria-hidden="true"
                        className="shrink-0 text-moss-700"
                      />
                    )}
                    {opcao.rotulo}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {passo > 0 ? (
            <button
              type="button"
              onClick={voltar}
              className="mt-5 block w-full text-center text-sm font-semibold text-ink-accent underline underline-offset-4"
            >
              Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={onVoltarFormulario}
              className="mt-5 block w-full text-center text-sm font-semibold text-ink-accent underline underline-offset-4"
            >
              Prefiro preencher o formulário
            </button>
          )}
        </motion.div>
      ) : (
        <motion.form key="final" {...entradaPasso} onSubmit={handleSubmit} className="mt-6 space-y-4">
          <p role="status" aria-live="polite" className="eyebrow text-ink-accent">
            Último passo
          </p>
          <h4
            ref={tituloFinalRef}
            tabIndex={-1}
            className="mt-2 text-lg font-bold text-ink-strong outline-none"
          >
            Para quem enviamos sua triagem?
          </h4>

          {/* Honeypot: fora da tela e fora da ordem de tabulação, não
              display:none, que alguns bots detectam. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="triagem-honey">Não preencha este campo</label>
            <input
              id="triagem-honey"
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="triagem-nome"
              className="mb-1.5 block text-sm font-medium text-ink-body"
            >
              Nome completo
            </label>
            <input
              id="triagem-nome"
              name="nome"
              type="text"
              required
              autoComplete="name"
              className={campoClasses}
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              id="triagem-consentimento"
              name="consentimento"
              type="checkbox"
              required
              value="Sim"
              className="mt-1 size-4 shrink-0 rounded border-line-strong text-moss-700"
            />
            <label htmlFor="triagem-consentimento" className="text-sm text-ink-muted">
              Autorizo a Praxis Digital a usar meus dados para entrar em
              contato, conforme a{' '}
              <a
                href="/privacidade.html"
                className="font-medium text-ink-accent underline underline-offset-2"
              >
                Política de Privacidade
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-control py-4 font-bold shadow-e1 transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-e2 ${BOTAO_WHATSAPP}`}
          >
            <WhatsAppIcon size={20} />
            Enviar pelo WhatsApp
          </button>

          <button
            type="button"
            onClick={voltar}
            className="block w-full text-center text-sm font-semibold text-ink-accent underline underline-offset-4"
          >
            Voltar
          </button>
        </motion.form>
      )}
    </div>
  );
}
