import { useEffect, useState } from 'react';
import { CheckCircle, Envelope } from '@phosphor-icons/react';
import WhatsAppIcon from './ui/WhatsAppIcon';
import Section from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';
import { PLANO_EVENT, INTERESSE_ASSESSORIA } from '../lib/planoSelecionado';

/* Checklist que era a seção FreeAudit inteira: ela ficava imediatamente antes
   desta, com a mesma mensagem, e seu único CTA rolava 300px até aqui. */
const checklist = [
  'Instagram otimizado',
  'Posicionamento da marca',
  'Oportunidades de automação',
  'Funil de captação',
  'Experiência do cliente',
];

type Status = 'idle' | 'sucesso';

/* Sem focus:outline-none: o :focus-visible global do index.css é o indicador
   de foco de todo o site, e anulá-lo aqui abriria uma exceção justamente nos
   campos onde ele mais importa. */
const campoClasses =
  'w-full rounded-frame border border-line bg-surface px-4 py-3 text-ink-body ' +
  'placeholder:text-ink-muted/70 transition-colors duration-200 focus:border-brand-500';

/**
 * Monta a mensagem em primeira pessoa: quem envia é o lead, do WhatsApp dele
 * para o da Primora. Conversa iniciada pelo usuário não depende de API, não
 * precisa de template aprovado e não corre risco de banimento do número.
 */
function montarMensagem(dados: FormData): string {
  const valor = (campo: string) => String(dados.get(campo) ?? '').trim();
  const interesse = valor('plano') || 'Ainda não sei';

  return [
    'Olá! Vim pelo site da Primora e quero agendar um diagnóstico.',
    '',
    `*Nome:* ${valor('name')}`,
    `*E-mail:* ${valor('email')}`,
    `*WhatsApp:* ${valor('phone')}`,
    `*Interesse:* ${interesse}`,
  ].join('\n');
}

export default function CTA() {
  const [status, setStatus] = useState<Status>('idle');
  const [plano, setPlano] = useState('');
  /* Guardado para o caso de o navegador bloquear a aba: aí o link vira um
     botão que a pessoa clica manualmente. */
  const [linkWhatsApp, setLinkWhatsApp] = useState<string | null>(null);
  const [popupBloqueado, setPopupBloqueado] = useState(false);

  /* Recebe o plano clicado na seção de Planos. Se o evento não chegar, o
     <select> continua utilizável manualmente. */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setPlano(detail);
    };
    window.addEventListener(PLANO_EVENT, handler);
    return () => window.removeEventListener(PLANO_EVENT, handler);
  }, []);

  /**
   * O formulário não envia nada para servidor nenhum: ele monta a mensagem e
   * entrega ao WhatsApp do próprio visitante. Os dados só saem do navegador
   * dele no momento em que ele toca em enviar.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const dados = new FormData(form);

    /* Honeypot: bots preenchem, humanos não veem. */
    if (dados.get('_honey')) return;
    if (!site.contato.whatsapp) return;

    const href = `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(
      montarMensagem(dados),
    )}`;

    /* window.open precisa acontecer dentro do gesto do clique — se viesse
       depois de qualquer await, o navegador bloquearia a aba. */
    const janela = window.open(href, '_blank', 'noopener');

    setLinkWhatsApp(href);
    setPopupBloqueado(janela === null);
    setStatus('sucesso');
    form.reset();
    setPlano('');
  }

  return (
    <Section id="cta" tone="invert" labelledBy="cta-title">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
        <RevealGroup>
          <RevealItem>
            <h2
              id="cta-title"
              className="text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-bold leading-tight text-on-dark"
            >
              Descubra como está sua presença digital.
            </h2>
          </RevealItem>

          <RevealItem as="p" className="mt-6 max-w-lg text-lg text-on-dark-body">
            Fazemos um diagnóstico gratuito para identificar oportunidades de
            crescimento, automação e fortalecimento da sua autoridade digital.
          </RevealItem>

          <RevealItem>
            <p className="eyebrow mt-10 text-on-dark-accent">O que analisamos</p>
            <ul className="mt-5 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-on-dark-body">
                  <CheckCircle
                    size={20}
                    weight="duotone"
                    aria-hidden="true"
                    className="shrink-0 text-on-dark-accent"
                  />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <a
              href={`mailto:${site.contato.email}`}
              className="mt-10 inline-flex items-center gap-3 text-on-dark-body underline-offset-4 transition-colors hover:text-on-dark hover:underline"
            >
              <Envelope size={20} weight="duotone" aria-hidden="true" />
              {site.contato.email}
            </a>
          </RevealItem>
        </RevealGroup>

        <RevealItem className="rounded-panel bg-surface p-6 shadow-e3 sm:p-8">
          <h3 className="text-2xl font-bold text-ink-strong">
            Agendar diagnóstico gratuito
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Retornamos em até um dia útil.
          </p>

          {status === 'sucesso' ? (
            <div className="mt-8 rounded-frame border border-brand-200 bg-brand-50 p-6 text-center">
              <CheckCircle
                size={32}
                weight="duotone"
                aria-hidden="true"
                className="mx-auto text-brand-700"
              />

              {linkWhatsApp ? (
                <>
                  <p role="status" className="mt-3 font-semibold text-ink-strong">
                    {popupBloqueado
                      ? 'Sua mensagem está pronta.'
                      : 'Abrimos o WhatsApp com sua mensagem pronta.'}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {popupBloqueado
                      ? 'O navegador bloqueou a abertura automática — use o botão abaixo.'
                      : 'É só tocar em enviar na conversa que abriu.'}
                  </p>

                  <a
                    href={linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-control px-6 py-3 font-semibold transition-colors duration-200 ${
                      popupBloqueado
                        ? 'bg-[#25D366] text-white hover:bg-[#1DA851]'
                        : 'border border-line-strong text-ink-brand hover:border-brand-400'
                    }`}
                  >
                    <WhatsAppIcon size={20} />
                    {popupBloqueado ? 'Abrir WhatsApp' : 'Não abriu? Abrir de novo'}
                  </a>
                </>
              ) : (
                <>
                  <p role="status" className="mt-3 font-semibold text-ink-strong">
                    Recebemos seu contato.
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Nossa equipe responde em até um dia útil.
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setLinkWhatsApp(null);
                  setPopupBloqueado(false);
                }}
                className="mt-5 block w-full text-sm font-semibold text-ink-brand underline underline-offset-4"
              >
                Enviar outra solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Honeypot: fora da tela e fora da ordem de tabulação — não
                  display:none, que alguns bots detectam. Evita que script
                  automatizado dispare a abertura do WhatsApp. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="_honey">Não preencha este campo</label>
                <input
                  id="_honey"
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="nome"
                  className="mb-1.5 block text-sm font-medium text-ink-body"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={campoClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink-body"
                >
                  E-mail profissional
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={campoClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="mb-1.5 block text-sm font-medium text-ink-body"
                >
                  WhatsApp
                </label>
                <input
                  id="telefone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  className={campoClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="plano"
                  className="mb-1.5 block text-sm font-medium text-ink-body"
                >
                  O que você procura
                </label>
                <select
                  id="plano"
                  name="plano"
                  value={plano}
                  onChange={(e) => setPlano(e.target.value)}
                  className={campoClasses}
                >
                  <option value="">Ainda não sei</option>
                  {site.planos.map((p) => (
                    <option key={p.nome} value={p.nome}>
                      {p.precoInicial === null
                        ? 'Plano personalizado'
                        : `Marketing · ${p.nome}`}
                    </option>
                  ))}
                  <option value={INTERESSE_ASSESSORIA}>
                    {INTERESSE_ASSESSORIA}
                  </option>
                  <option value="Marketing + assessoria operacional">
                    Marketing + assessoria operacional
                  </option>
                </select>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="consentimento"
                  name="consentimento"
                  type="checkbox"
                  required
                  value="Sim"
                  className="mt-1 size-4 shrink-0 rounded border-line-strong text-brand-700 focus:ring-brand-500"
                />
                <label htmlFor="consentimento" className="text-sm text-ink-muted">
                  Autorizo a Primora a usar meus dados para entrar em contato,
                  conforme a{' '}
                  <a
                    href="/privacidade.html"
                    className="font-medium text-ink-brand underline underline-offset-2"
                  >
                    Política de Privacidade
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-control bg-[#25D366] py-4 font-bold text-white shadow-e1 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-e2"
              >
                {/* O rótulo avisa que uma conversa vai abrir — clicar em
                    "Solicitar contato" e cair no WhatsApp seria surpresa. */}
                <WhatsAppIcon size={20} />
                Enviar pelo WhatsApp
              </button>

              <p className="text-center text-xs text-ink-muted">
                Sua mensagem abre já preenchida no WhatsApp — é só tocar em
                enviar.
              </p>
            </form>
          )}
        </RevealItem>
      </div>
    </Section>
  );
}
