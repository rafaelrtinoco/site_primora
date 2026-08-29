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
  /* Os três botões eram "Selecionar Plano" apontando para o mesmo #cta, sem
     informar qual plano foi escolhido — nem para o usuário, nem para o leitor
     de tela, nem para quem recebe o lead. */
  const selecionar = (nome: string) => {
    window.dispatchEvent(new CustomEvent(PLANO_EVENT, { detail: nome }));
  };

  return (
    <Section id="plans" labelledBy="plans-title">
      <SectionHeader
        id="plans-title"
        eyebrow="Planos"
        title="Escolha a solução ideal para sua fase profissional"
        description="Planos criados estrategicamente para atender corretores em diferentes estágios do mercado."
      />

      {/* items-start em vez de items-center: com o card do meio em scale, o
          items-center desalinhava o topo dos três. */}
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
                ? 'z-10 bg-surface shadow-e3 ring-2 ring-brand-600'
                : plano.precoInicial === null
                  ? /* Plano sob medida: borda tracejada sinaliza que é um
                       recorte aberto, não mais um degrau da escada. */
                    'border-2 border-dashed border-line-brand bg-brand-50/40'
                  : 'border border-line bg-surface shadow-e1'
            }`}
          >
            {plano.badge && (
              <span className="absolute -top-3 left-8 rounded-control bg-brand-700 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                {plano.badge}
              </span>
            )}

            <h3
              className={`eyebrow ${
                plano.destaque ? 'text-brand-700' : 'text-ink-brand'
              }`}
            >
              {plano.nome}
            </h3>

            {/* A frase de resultado é o que o cliente lê primeiro. */}
            <p className="mt-3 text-lg font-semibold leading-snug text-ink-strong">
              {plano.chamada}
            </p>

            <div className="mt-6 border-t border-line pt-6">
              {plano.precoInicial === null ? (
                <p className="text-2xl font-bold text-ink-strong">
                  Sob medida
                </p>
              ) : (
                <p>
                  <span className="text-sm text-ink-muted">a partir de </span>
                  <span className="text-3xl font-bold text-ink-strong">
                    {formatPreco(plano.precoInicial)}
                  </span>
                  <span className="text-sm text-ink-muted">/mês</span>
                </p>
              )}
            </div>

            {/* Especificação como lastro, em corpo menor — as quantidades
                seguem declaradas, mas não são a promessa do plano. */}
            <p className="mt-6 grow text-sm leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink-body">Inclui: </span>
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
              className={`mt-8 block rounded-control py-4 text-center font-bold transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 ${
                plano.destaque
                  ? 'bg-brand-700 text-white shadow-e1 hover:bg-brand-800 hover:shadow-e2'
                  : 'bg-brand-50 text-ink-brand hover:bg-brand-100'
              }`}
            >
              {plano.precoInicial === null
                ? 'Montar meu plano'
                : `Selecionar ${plano.nome}`}
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* A assessoria aparece aqui como complemento, não como item de plano:
          quem só quer marketing não é confrontado com o preço dela. */}
      <Reveal>
        <div className="mx-auto mt-12 max-w-3xl rounded-card border border-line-brand bg-brand-50 p-7 text-center">
          <p className="eyebrow text-ink-brand">Complemento opcional</p>
          <p className="mt-3 text-lg font-semibold text-ink-strong">
            Precisa também de ajuda com a demanda operacional?
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            A assessoria operacional é contratada à parte, porque o valor dela
            acompanha o tamanho da sua carteira, não o volume de conteúdo.
            Pode entrar junto de qualquer um dos planos acima ou sozinha.
          </p>
          <a
            href="#assessoria"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-ink-brand underline underline-offset-4"
          >
            Ver a assessoria operacional
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <Reveal as="p" className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-muted">
        Os valores acima são o ponto de partida de cada plano. O escopo final —
        volume de conteúdo e páginas do site — é fechado junto com você no
        diagnóstico gratuito.
      </Reveal>
    </Section>
  );
}
