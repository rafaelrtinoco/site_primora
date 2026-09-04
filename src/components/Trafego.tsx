import {
  MagnifyingGlass,
  UsersThree,
  Palette,
  ChartLineUp,
  ArrowRight,
  Scales,
} from '@phosphor-icons/react';
import Section from './ui/Section';
import IconFrame from './ui/IconFrame';
import Button from './ui/Button';
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';
import { PLANO_EVENT, INTERESSE_TRAFEGO } from '../lib/planoSelecionado';

const formatPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const menorPreco = Math.min(...site.trafego.faixas.map((f) => f.preco));

const frentes = [
  {
    icon: MagnifyingGlass,
    titulo: 'Google Ads',
    /* A diferença entre os dois canais não é de plataforma, é de intenção —
       e é o que decide onde o orçamento de quem está começando deve ir. */
    resumo: 'Aparecer para quem já está procurando o que você faz.',
    itens: [
      'Campanhas de busca por intenção',
      'Pesquisa e curadoria de palavras-chave',
      'Palavras negativas, para não pagar por clique errado',
      'Extensões, sitelinks e páginas de destino',
      'Acompanhamento de custo por lead',
    ],
  },
  {
    icon: UsersThree,
    titulo: 'Meta Ads',
    resumo: 'Aparecer para quem ainda não sabe que precisa de você.',
    itens: [
      'Campanhas no Instagram e no Facebook',
      'Públicos frios, quentes e semelhantes',
      'Remarketing de quem visitou o site',
      'Testes de criativo e de oferta',
      'Captação por formulário ou WhatsApp',
    ],
  },
  {
    icon: Palette,
    titulo: 'Criativos e páginas',
    resumo: 'O anúncio só funciona se o destino aguentar a visita.',
    itens: [
      'Criativos estáticos e em vídeo curto',
      'Variações para teste A/B',
      'Landing pages dedicadas à campanha',
      'Textos de anúncio e chamadas',
      'Ajuste de formulário e de contato',
    ],
  },
  {
    icon: ChartLineUp,
    titulo: 'Medição e relatórios',
    /* Sem isso o cliente não sabe se comprou resultado ou impressão. */
    resumo: 'Sem medição, verba em anúncio é aposta.',
    itens: [
      'Instalação de tags e conversões',
      'Origem de cada lead que chega',
      'Custo por lead e por canal',
      'Relatório mensal em linguagem clara',
      'Reunião de leitura dos números',
    ],
  },
];

export default function Trafego() {
  return (
    <Section id="trafego" tone="darkAlt" labelledBy="trafego-title">
      <div className="mb-16 max-w-3xl">
        <Reveal as="p" className="eyebrow mb-5 text-on-dark-accent">
          Gestão de tráfego pago
        </Reveal>

        <Reveal>
          <h2
            id="trafego-title"
            className="text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-on-dark"
          >
            Conteúdo constrói autoridade.
            <br />
            <span className="text-on-dark-accent">
              Anúncio traz gente hoje.
            </span>
          </h2>
        </Reveal>

        <Reveal as="p" delay={0.1} className="mt-6 text-lg text-on-dark-body">
          As duas coisas resolvem problemas diferentes, e é por isso que uma não
          substitui a outra. Enquanto o conteúdo amadurece, o anúncio coloca sua
          oferta na frente de quem está decidindo agora — desde que a campanha
          seja montada para gerar contato, e não alcance.
        </Reveal>
      </div>

      <RevealGroup
        as="ul"
        stagger={0.06}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {frentes.map((frente) => (
          <RevealItem key={frente.titulo} as="li" className="card-dark p-7">
            <IconFrame icon={frente.icon} size="md" tone="invert" />
            <h3 className="mt-5 text-lg font-bold text-on-dark">
              {frente.titulo}
            </h3>
            <p className="mt-1 text-sm text-on-dark-accent">{frente.resumo}</p>

            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
              {frente.itens.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-on-dark-muted"
                >
                  <span
                    className="mt-2 size-1 shrink-0 rounded-full bg-acid-400"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Cada segmento que atendemos tem regra própria de publicidade, e a da
          OAB rende processo disciplinar ao cliente se for violada. Isto está
          aqui porque é verificável — ao contrário de promessa de resultado. */}
      <Reveal>
        <div className="mt-14 rounded-panel border border-white/10 p-7 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <IconFrame icon={Scales} size="md" tone="invert" />
            <div>
              <h3 className="text-xl font-bold text-on-dark">
                Anúncio dentro da regra do seu conselho
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-dark-body">
                Quatro dos cinco segmentos que atendemos têm norma própria de
                publicidade. Campanha reprovada não é só verba perdida — em
                advocacia, é processo no Tribunal de Ética.
              </p>

              <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {site.setores.map((setor) => (
                  <div key={setor.nome}>
                    <dt className="text-sm font-semibold text-on-dark">
                      {setor.nome}
                    </dt>
                    <dd className="mt-0.5 text-sm text-on-dark-muted">
                      {setor.nota}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-6 rounded-panel border border-white/15 bg-white/[0.06] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14">
            <div>
              <p className="eyebrow text-on-dark-accent">
                Quanto custa a gestão
              </p>
              <p className="mt-3 text-2xl font-bold text-on-dark">
                a partir de {formatPreco(menorPreco)}
                <span className="text-lg font-medium text-on-dark-muted">
                  /mês
                </span>
              </p>

              {/* O ponto que mais gera ruído na contratação. Dizer aqui afasta
                  parte dos leads; não dizer os afasta na reunião, depois de
                  terem ancorado no preço de partida. */}
              <div className="mt-5 max-w-md border-l-2 border-acid-400 pl-4">
                <p className="text-sm font-semibold text-on-dark">
                  Fee de gestão e verba de mídia são coisas diferentes.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-body">
                  O fee acima é o nosso trabalho. A verba é o que vai para o
                  Google e para a Meta, e você paga direto a eles, no seu cartão
                  — a conta de anúncios é sua, e o histórico dela também.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                  Para o algoritmo sair do modo de aprendizado, recomendamos ao
                  menos {formatPreco(site.trafego.verbaMinima)} por mês de
                  verba. Abaixo disso a campanha demora a aprender e a gestão
                  pesa demais sobre o retorno.
                </p>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-on-dark-body">
                Pode ser contratada junto de qualquer plano de conteúdo ou
                separadamente. O escopo final sai do diagnóstico, que é
                gratuito.
              </p>

              <Button
                href="#cta"
                size="md"
                icon={ArrowRight}
                className="mt-7"
                /* Leva o interesse até o formulário, para o lead não chegar
                   sem indicação do que veio buscar. */
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent(PLANO_EVENT, { detail: INTERESSE_TRAFEGO }),
                  )
                }
              >
                Falar sobre tráfego pago
              </Button>
            </div>

            <dl className="w-full lg:w-96">
              {site.trafego.faixas.map((faixa, i) => (
                <div
                  key={faixa.escopo}
                  className={`flex items-baseline justify-between gap-4 py-3 ${
                    i > 0 ? 'border-t border-white/10' : ''
                  }`}
                >
                  <dt className="text-sm text-on-dark-muted">{faixa.escopo}</dt>
                  <dd className="shrink-0 font-semibold tabular-nums text-on-dark">
                    {formatPreco(faixa.preco)}
                    <span className="text-sm font-normal text-on-dark-muted">
                      /mês
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
