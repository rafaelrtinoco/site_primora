import {
  FileText,
  ArrowsClockwise,
  Headset,
  ShieldCheck,
  ChartLine,
  ArrowRight,
} from '@phosphor-icons/react';
import Section from './ui/Section';
import IconFrame from './ui/IconFrame';
import Button from './ui/Button';
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';
import { PLANO_EVENT, INTERESSE_ASSESSORIA } from '../lib/planoSelecionado';

const formatPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const menorPreco = Math.min(...site.assessoria.faixas.map((f) => f.preco));
const maiorFaixa =
  site.assessoria.faixas[site.assessoria.faixas.length - 1];

const frentes = [
  {
    icon: FileText,
    titulo: 'Pós-venda',
    resumo: 'A apólice sai conferida e o endosso sai no prazo.',
    itens: [
      'Emissão e conferência de apólices',
      'Envio de apólices aos clientes',
      'Endossos e cancelamentos',
      'Alterações cadastrais',
      'Inclusão e exclusão de segurados',
      'Acompanhamento de propostas',
      'Conferência de parcelas e pagamentos',
    ],
  },
  {
    icon: ArrowsClockwise,
    titulo: 'Renovação',
    /* Ângulo levantado na pesquisa: o cliente que não é procurado antes do
       vencimento vai ao mercado sozinho. A carteira não se perde num evento,
       se perde por ausência. */
    resumo: 'Carteira não se perde por preço. Perde-se por silêncio.',
    itens: [
      'Controle de vencimentos',
      'Levantamento das apólices a renovar',
      'Organização das propostas',
      'Controle de renovações fechadas e perdidas',
    ],
  },
  {
    icon: Headset,
    titulo: 'Atendimento operacional',
    resumo: 'A fila do portal da seguradora deixa de ser sua.',
    itens: [
      'Atendimento por WhatsApp e e-mail',
      'Solicitação de documentos',
      'Acompanhamento de pendências',
      'Interface com seguradoras',
      'Acompanhamento de emissão',
    ],
  },
  {
    icon: ShieldCheck,
    titulo: 'Sinistros',
    /* A pesquisa mostrou que as maiores queixas do segurado no sinistro são
       falta de informação clara e dificuldade com documentação — problemas de
       processo, não de mérito da indenização. E o cliente não distingue falha
       da seguradora de falha do corretor. */
    resumo: 'Ninguém fica bravo por esperar. Fica bravo por não ter notícia.',
    itens: [
      'Abertura do aviso de sinistro',
      'Organização dos documentos',
      'Acompanhamento do processo',
      'Cobrança de posicionamento da seguradora',
      'Atualização do cliente e do corretor',
    ],
  },
  {
    icon: ChartLine,
    titulo: 'Organização da corretora',
    resumo: 'Produção, comissão e pendências num lugar só.',
    itens: [
      'Controle de propostas e pendências',
      'Organização de documentos',
      'Relatórios de produção',
      'Controle de comissões',
      'Indicadores de renovação',
      'Fluxo comercial → operacional → pós-venda',
    ],
  },
];

export default function Assessoria() {
  return (
    <Section id="assessoria" tone="invert" labelledBy="assessoria-title">
      <div className="mb-16 max-w-3xl">
        <Reveal as="p" className="eyebrow mb-5 text-on-dark-accent">
          Assessoria operacional
        </Reveal>

        <Reveal>
          <h2
            id="assessoria-title"
            className="text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-on-dark"
          >
            Você vende.
            <br />
            <span className="text-on-dark-accent">
              A gente cuida do operacional.
            </span>
          </h2>
        </Reveal>

        <Reveal as="p" delay={0.1} className="mt-6 text-lg text-on-dark-body">
          A retaguarda que consome o seu dia e não aparece na comissão —
          conferir apólice, transmitir proposta, correr atrás de documento,
          esperar o retorno da seguradora — passa a ser nossa. Inclusive o que
          parece burocracia miúda: é a documentação completa que faz o prazo da
          seguradora começar a correr.
        </Reveal>
      </div>

      <RevealGroup
        as="ul"
        stagger={0.06}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {frentes.map((frente) => (
          <RevealItem
            key={frente.titulo}
            as="li"
            className="rounded-card border border-white/10 bg-white/[0.04] p-7 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.07]"
          >
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
                    className="mt-2 size-1 shrink-0 rounded-full bg-on-dark-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal>
        <div className="mt-14 rounded-panel border border-white/15 bg-white/[0.06] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14">
            <div>
              <p className="eyebrow text-on-dark-accent">
                Quanto custa a assessoria
              </p>
              <p className="mt-3 text-2xl font-bold text-on-dark">
                a partir de {formatPreco(menorPreco)}
                <span className="text-lg font-medium text-on-dark-muted">
                  /mês
                </span>
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-on-dark-muted">
                O valor acompanha o tamanho da sua carteira. Acima de{' '}
                {maiorFaixa.apolices} apólices, ou em carteiras com perfil
                específico, definimos o valor depois de analisar a sua operação
                — essa análise é gratuita.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-on-dark-body">
                Pode ser contratada junto de qualquer plano de marketing ou
                separadamente.
              </p>

              <Button
                href="#cta"
                variant="inverse"
                size="md"
                icon={ArrowRight}
                className="mt-7"
                /* Leva o interesse até o formulário, para o lead não chegar
                   sem indicação do que veio buscar. */
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent(PLANO_EVENT, {
                      detail: INTERESSE_ASSESSORIA,
                    }),
                  )
                }
              >
                Solicitar análise da carteira
              </Button>
            </div>

            <dl className="w-full lg:w-80">
              {site.assessoria.faixas.map((faixa, i) => (
                <div
                  key={faixa.apolices}
                  className={`flex items-baseline justify-between gap-4 py-3 ${
                    i > 0 ? 'border-t border-white/10' : ''
                  }`}
                >
                  <dt className="text-sm text-on-dark-muted">
                    até {faixa.apolices} apólices
                  </dt>
                  <dd className="font-semibold tabular-nums text-on-dark">
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
