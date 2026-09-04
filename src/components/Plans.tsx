import { ArrowRight } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';
import { PLANO_EVENT } from '../lib/planoSelecionado';

const formatPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function Plans() {
  /* Os botões eram "Selecionar Plano" apontando para o mesmo #cta, sem
     informar qual plano foi escolhido — nem para o usuário, nem para o leitor
     de tela, nem para quem recebe o lead. */
  const selecionar = (nome: string) => {
    window.dispatchEvent(new CustomEvent(PLANO_EVENT, { detail: nome }));
  };

  return (
    <Section id="plans" tone="dark" labelledBy="plans-title">
      <SectionHeader
        id="plans-title"
        eyebrow="Planos de conteúdo"
        title="Escolha a solução ideal para a sua fase"
        description="Planos pensados para negócios em estágios diferentes — do primeiro perfil organizado à operação com presença consistente em todos os canais."
      />

      <RevealGroup
        as="ul"
        stagger={0.08}
        /* 4 planos: 2x2 até 1280px e só então 4 colunas. Quatro cards lado a
           lado em 1024px deixariam ~230px úteis cada um. */
        className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {site.planos.map((plano) => (
          <RevealItem
            key={plano.nome}
            as="li"
            className={`relative flex h-full flex-col rounded-card p-7 ${
              plano.destaque
                ? 'z-10 bg-white/[0.08] ring-2 ring-acid-400'
                : plano.precoInicial === null
                  ? /* Plano sob medida: borda tracejada sinaliza que é um
                       recorte aberto, não mais um degrau da escada. */
                    'border-2 border-dashed border-white/25 bg-white/[0.02]'
                  : 'card-dark'
            }`}
          >
            {plano.badge && (
              <span className="absolute -top-3 left-8 rounded-control bg-acid-400 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-carbon-950">
                {plano.badge}
              </span>
            )}

            <h3 className="eyebrow text-on-dark-accent">{plano.nome}</h3>

            {/* A frase de resultado é o que o cliente lê primeiro. */}
            <p className="mt-3 text-lg font-semibold leading-snug text-on-dark">
              {plano.chamada}
            </p>

            <div className="mt-6 border-t border-white/10 pt-6">
              {plano.precoInicial === null ? (
                <p className="text-2xl font-bold text-on-dark">Sob medida</p>
              ) : (
                <p>
                  <span className="text-sm text-on-dark-muted">
                    a partir de{' '}
                  </span>
                  <span className="text-3xl font-bold text-on-dark">
                    {formatPreco(plano.precoInicial)}
                  </span>
                  <span className="text-sm text-on-dark-muted">/mês</span>
                </p>
              )}
            </div>

            {/* Especificação como lastro, em corpo menor — as quantidades
                seguem declaradas, mas não são a promessa do plano. */}
            <p className="mt-6 grow text-sm leading-relaxed text-on-dark-muted">
              <span className="font-semibold text-on-dark-body">Inclui: </span>
              {plano.inclui}
            </p>

            <a
              href="#cta"
              onClick={() => selecionar(plano.nome)}
              aria-label={
                plano.precoInicial === null
                  ? 'Solicitar contato para montar um plano personalizado'
                  : `Solicitar contato sobre o plano ${plano.nome}`
              }
              className={`mt-8 block rounded-control py-4 text-center font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 ${
                plano.destaque
                  ? 'bg-acid-400 text-carbon-950 shadow-e1 hover:bg-acid-500 hover:shadow-e2'
                  : 'border border-white/20 text-on-dark hover:border-acid-400 hover:text-acid-400'
              }`}
            >
              {plano.precoInicial === null
                ? 'Montar meu plano'
                : `Selecionar ${plano.nome}`}
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* O tráfego aparece aqui como complemento, não como item de plano: quem
          só quer conteúdo não é confrontado com o preço dele. */}
      <Reveal>
        <div className="mx-auto mt-12 max-w-3xl rounded-card border border-white/15 bg-white/[0.05] p-7 text-center">
          <p className="eyebrow text-on-dark-accent">Complemento opcional</p>
          <p className="mt-3 text-lg font-semibold text-on-dark">
            Precisa de resultado antes do conteúdo amadurecer?
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-dark-muted">
            A gestão de tráfego pago é contratada à parte, porque o valor dela
            acompanha o número de plataformas e o volume de mídia, não o volume
            de conteúdo. Pode entrar junto de qualquer um dos planos acima ou
            sozinha.
          </p>
          <a
            href="#trafego"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-on-dark-accent underline underline-offset-4"
          >
            Ver a gestão de tráfego
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <Reveal
        as="p"
        className="mx-auto mt-8 max-w-2xl text-center text-sm text-on-dark-muted"
      >
        Os valores acima são o ponto de partida de cada plano. O escopo final —
        volume de conteúdo e páginas do site — é fechado junto com você no
        diagnóstico gratuito.
      </Reveal>
    </Section>
  );
}
