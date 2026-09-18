import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { campoClasses, BOTAO_WHATSAPP } from '../ui/estilosCompartilhados';
import { useTriagem } from '../triagem/useTriagem';
import { X } from '@phosphor-icons/react';

/* Avatar ilustrado da Ceci, fornecido pelo dono do projeto. object-top porque
   o retrato é vertical e o recorte quadrado do avatar precisa manter rosto e
   ombros, não o restante da cena atrás dela. */
import CeciAvatar from '/Ceci.jpeg';

type CeciChatProps = {
  onFechar: () => void;
};

const SAUDACAO =
  'Oi! Eu sou a Ceci, atendimento automatizado da Praxis Digital. Vou te fazer algumas perguntas rápidas para te direcionar certo.';

/** Bolha da Ceci: alinhada à esquerda, tom neutro. */
function BolhaCeci({ texto }: { texto: string }) {
  return (
    <div className="flex justify-start">
      <p className="max-w-[85%] rounded-card rounded-bl-none bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink-body">
        {texto}
      </p>
    </div>
  );
}

/** Bolha da resposta escolhida: alinhada à direita, sobre moss-700 (12.31:1). */
function BolhaUsuario({ texto }: { texto: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-card rounded-br-none bg-moss-700 px-4 py-2.5 text-sm leading-relaxed text-on-dark-body">
        {texto}
      </p>
    </div>
  );
}

/** Indicador de "digitando", puramente decorativo: sem texto para anunciar. */
function BolhaDigitando() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-card rounded-bl-none bg-surface-muted px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="size-1.5 rounded-full bg-ink-muted"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Chat flutuante da Ceci, acionado pelo menu do WhatsAppFab.
 *
 * Usa a mesma base da triagem da CTA (useTriagem, site.triagem): as
 * perguntas e o formato da mensagem final são idênticos, só a roupagem
 * visual muda, de lista de botões para bolhas de conversa. Nenhum resultado
 * é fabricado: cada bolha da Ceci é uma pergunta fixa ou uma confirmação,
 * nunca um diagnóstico calculado.
 *
 * Sem aria-modal nem trava de Tab: diferente do painel de cookies, este
 * flutua sobre a página sem escurecer o resto, então prender o Tab dentro
 * dele seria inesperado. Fecha por X, Esc, ou pelo próprio botão do FAB.
 */
export default function CeciChat({ onFechar }: CeciChatProps) {
  const [nomeEnviado, setNomeEnviado] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ href: string; bloqueado: boolean } | null>(
    null,
  );

  const { perguntas, passo, respostas, ultimoPasso, responder, enviar } = useTriagem({
    onEnviar: (href, bloqueado) => setResultado({ href, bloqueado }),
  });

  const reducedMotion = useReducedMotion();

  /* Identifica o "turno" atual (pergunta em exibição, ou a confirmação
     final). prontoParaMostrar é derivado, não resetado à mão: quando o
     turno muda, ele deixa de bater com o último turno revelado e a bolha
     de "digitando" volta sozinha, sem setState síncrono dentro do efeito. */
  const turnoAtual = resultado ? 'resultado' : String(passo);
  const [turnoRevelado, setTurnoRevelado] = useState<string | null>(null);
  const prontoParaMostrar = turnoRevelado === turnoAtual;

  const listaRef = useRef<HTMLDivElement>(null);
  const fecharBotaoRef = useRef<HTMLButtonElement>(null);

  /* Foco vai pro botão de fechar assim que o chat abre: é o primeiro
     controle útil, e sem isso o teclado fica preso no botão do FAB. */
  useEffect(() => {
    fecharBotaoRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFechar]);

  /* Atraso só cosmético, para a bolha nova entrar como se a Ceci estivesse
     "digitando". Nunca atrasa o window.open: enviar() já rodou de forma
     síncrona dentro do clique antes deste efeito disparar. Pulado com
     movimento reduzido, porque é espera artificial, não animação. */
  useEffect(() => {
    const atraso = reducedMotion ? 0 : 550;
    const id = window.setTimeout(() => setTurnoRevelado(turnoAtual), atraso);
    return () => window.clearTimeout(id);
  }, [turnoAtual, reducedMotion]);

  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [passo, nomeEnviado, prontoParaMostrar]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const dados = new FormData(form);
    const nome = String(dados.get('nome') ?? '').trim();
    const honey = String(dados.get('_honey') ?? '');

    if (enviar(nome, honey)) setNomeEnviado(nome);
  }

  return (
    <motion.div
      role="dialog"
      aria-labelledby="ceci-titulo"
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-5 z-[86] flex max-h-[70vh] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-e3"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line p-4">
        <div className="flex items-center gap-3">
          <img
            src={CeciAvatar}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full border border-line object-cover object-top"
          />
          <div>
            <p id="ceci-titulo" className="font-bold text-ink-strong">
              Ceci
            </p>
            <p className="text-xs text-ink-muted">Atendimento automatizado.</p>
          </div>
        </div>
        <button
          ref={fecharBotaoRef}
          type="button"
          onClick={onFechar}
          aria-label="Fechar chat da Ceci"
          className="-m-2 rounded-frame p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink-accent"
        >
          <X size={20} weight="bold" />
        </button>
      </div>

      <div
        ref={listaRef}
        role="log"
        aria-live="polite"
        aria-label="Conversa com a Ceci"
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        <BolhaCeci texto={SAUDACAO} />

        {perguntas.slice(0, passo).map((pergunta, i) => (
          <div key={pergunta.pergunta} className="space-y-2">
            <BolhaCeci texto={pergunta.pergunta} />
            <BolhaUsuario texto={respostas[i]} />
          </div>
        ))}

        {!ultimoPasso &&
          (prontoParaMostrar ? (
            <BolhaCeci texto={perguntas[passo].pergunta} />
          ) : (
            <BolhaDigitando />
          ))}

        {ultimoPasso && (
          <>
            <BolhaCeci texto="Perfeito. Para quem eu confirmo essa triagem?" />
            {nomeEnviado && <BolhaUsuario texto={nomeEnviado} />}
            {nomeEnviado &&
              (prontoParaMostrar ? (
                <BolhaCeci
                  texto={
                    resultado?.bloqueado
                      ? 'Sua mensagem está pronta, mas seu navegador bloqueou a abertura automática.'
                      : 'Prontinho! Abri seu WhatsApp com a triagem preenchida. É só tocar em enviar.'
                  }
                />
              ) : (
                <BolhaDigitando />
              ))}
          </>
        )}
      </div>

      {!ultimoPasso && prontoParaMostrar && (
        <div className="flex flex-wrap gap-2 border-t border-line p-4">
          {perguntas[passo].opcoes.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => responder(opcao.rotulo)}
              className="rounded-control border border-line px-4 py-2 text-sm text-ink-body transition-colors duration-200 hover:border-moss-700 hover:text-ink-strong"
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      )}

      {ultimoPasso && !nomeEnviado && prontoParaMostrar && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-line p-4">
          {/* Honeypot: fora da tela e fora da ordem de tabulação, não
              display:none, que alguns bots detectam. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="ceci-honey">Não preencha este campo</label>
            <input
              id="ceci-honey"
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="ceci-nome" className="sr-only">
              Nome completo
            </label>
            <input
              id="ceci-nome"
              name="nome"
              type="text"
              required
              autoComplete="name"
              placeholder="Seu nome completo"
              className={campoClasses}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="ceci-consentimento"
              name="consentimento"
              type="checkbox"
              required
              value="Sim"
              className="mt-1 size-4 shrink-0 rounded border-line-strong text-moss-700"
            />
            <label htmlFor="ceci-consentimento" className="text-xs text-ink-muted">
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
            className={`flex w-full items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-bold ${BOTAO_WHATSAPP}`}
          >
            <WhatsAppIcon size={18} />
            Enviar pelo WhatsApp
          </button>
        </form>
      )}

      {resultado?.bloqueado && prontoParaMostrar && (
        <div className="border-t border-line p-4">
          <a
            href={resultado.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-semibold ${BOTAO_WHATSAPP}`}
          >
            <WhatsAppIcon size={18} />
            Abrir WhatsApp
          </a>
        </div>
      )}
    </motion.div>
  );
}
