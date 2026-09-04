import {
  Envelope,
  MapPin,
  Phone,
  InstagramLogo,
  LinkedinLogo,
} from '@phosphor-icons/react';
import Logo from '/praxis-horizontal-lime.png';
import { site } from '../content/site';
import { abrirPreferencias } from '../lib/consent';

const navegacao = [
  { name: 'Serviços', href: '#solutions' },
  { name: 'Tráfego pago', href: '#trafego' },
  { name: 'IA no processo', href: '#ia' },
  { name: 'Como Funciona', href: '#process' },
  { name: 'Planos', href: '#plans' },
  { name: 'FAQ', href: '#faq' },
];

type Rede = {
  name: string;
  href: string | null;
  Icon: typeof InstagramLogo;
};

const redes = (
  [
    { name: 'Instagram', href: site.redes.instagram, Icon: InstagramLogo },
    { name: 'LinkedIn', href: site.redes.linkedin, Icon: LinkedinLogo },
  ] satisfies Rede[]
).filter((rede) => Boolean(rede.href));

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-dark pb-10 pt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a
              href="#hero"
              className="mb-6 inline-flex items-center"
              aria-label="Praxis Digital — início"
            >
              {/* Logo colorido: nada de `brightness-0 invert`, que era o que o
                  logo azul-marinho antigo precisava e que aqui destruiria o
                  degradê do símbolo. */}
              <img src={Logo} alt="Praxis Digital" className="h-10 w-auto" />
            </a>
            <p className="text-sm leading-relaxed text-on-dark-muted">
              Conteúdo, site e tráfego pago para corretoras, imobiliárias,
              contabilidade, advocacia e serviços administrativos.
            </p>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="mb-6 font-semibold text-on-dark">
              Navegação
            </h2>
            <ul className="space-y-4">
              {navegacao.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-on-dark-muted transition-colors duration-200 hover:text-acid-400"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-6 font-semibold text-on-dark">Contato</h2>
            <ul className="space-y-4 text-sm text-on-dark-muted">
              {/* Cada linha só existe com dado real. O atendimento hoje é todo
                  por WhatsApp — o botão flutuante é o canal principal. */}
              {site.contato.email && (
                <li className="flex items-center gap-3">
                  <Envelope
                    size={18}
                    weight="duotone"
                    className="shrink-0 text-on-dark-accent"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${site.contato.email}`}
                    className="transition-colors duration-200 hover:text-on-dark"
                  >
                    {site.contato.email}
                  </a>
                </li>
              )}
              {site.contato.telefone && (
                <li className="flex items-center gap-3">
                  <Phone
                    size={18}
                    weight="duotone"
                    className="shrink-0 text-on-dark-accent"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${site.contato.telefone.replace(/\D/g, '')}`}
                    className="transition-colors duration-200 hover:text-on-dark"
                  >
                    {site.contato.telefone}
                  </a>
                </li>
              )}
              {site.contato.whatsapp && (
                <li className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(
                      site.contato.whatsappMensagem,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-on-dark-accent underline underline-offset-4 transition-colors duration-200 hover:text-on-dark"
                  >
                    Falar no WhatsApp
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  weight="duotone"
                  className="mt-0.5 shrink-0 text-on-dark-accent"
                  aria-hidden="true"
                />
                <span>{site.contato.cidade}</span>
              </li>
            </ul>
          </div>

          {/* Só renderiza quando houver URL real: antes eram dois href="#"
              com ícones de câmera e compartilhamento, sem rótulo acessível. */}
          {redes.length > 0 && (
            <div>
              <h2 className="mb-6 font-semibold text-on-dark">Redes sociais</h2>
              <ul className="flex items-center gap-3">
                {redes.map((rede) => (
                  <li key={rede.name}>
                    <a
                      href={rede.href ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Praxis Digital no ${rede.name}`}
                      className="inline-flex size-10 items-center justify-center rounded-frame border border-white/15 bg-white/5 text-on-dark-muted transition-colors duration-200 hover:border-acid-400 hover:text-acid-400"
                    >
                      <rede.Icon size={20} weight="fill" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-on-dark-muted">
            © {new Date().getFullYear()} {site.nome}. Todos os direitos
            reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/termos.html"
              className="text-on-dark-muted transition-colors duration-200 hover:text-acid-400"
            >
              Termos de Uso
            </a>
            <a
              href="/privacidade.html"
              className="text-on-dark-muted transition-colors duration-200 hover:text-acid-400"
            >
              Privacidade
            </a>
            {/* A LGPD exige que revogar o consentimento seja tão fácil
                quanto concedê-lo. */}
            <button
              type="button"
              onClick={abrirPreferencias}
              className="text-on-dark-muted transition-colors duration-200 hover:text-acid-400"
            >
              Preferências de privacidade
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
