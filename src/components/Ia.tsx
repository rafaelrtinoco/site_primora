import { Lightbulb, PencilLine, ChartBar, Robot } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import IconFrame from './ui/IconFrame';
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal';

/**
 * Cada etapa declara as duas metades: o que a máquina acelera e o que a pessoa
 * decide. É o que separa "usamos IA" de "você vai receber conteúdo automático",
 * e a segunda leitura é a que o cliente faz sozinho se a página não for
 * explícita.
 */
const etapas = [
  {
    icon: Lightbulb,
    titulo: 'Pesquisa e estratégia',
    ia: 'Levanta concorrentes, termos de busca, objeções recorrentes e ângulos de campanha em horas, não em semanas.',
    humano:
      'Escolhemos o posicionamento, descartamos o que não combina com o seu mercado e definimos a prioridade do trimestre.',
  },
  {
    icon: PencilLine,
    titulo: 'Produção de texto e arte',
    ia: 'Gera as primeiras versões de legenda, roteiro, variação de anúncio e referência visual, em volume.',
    humano:
      'Editamos, cortamos o que soa genérico, checamos cada afirmação e aprovamos peça por peça antes de publicar.',
  },
  {
    icon: ChartBar,
    titulo: 'Leitura de resultado',
    ia: 'Cruza os números das plataformas e aponta padrões de desempenho que passariam despercebidos na planilha.',
    humano:
      'Interpretamos o porquê, decidimos o que muda no mês seguinte e explicamos em reunião, sem jargão.',
  },
];

export default function Ia() {
  return (
    <Section id="ia" tone="moss" labelledBy="ia-title">
      <SectionHeader
        id="ia-title"
        eyebrow="Como trabalhamos"
        title={
          <>
            IA no processo.{' '}
            <span className="text-on-dark-accent">Gente na decisão.</span>
          </>
        }
        description="Usamos inteligência artificial em toda a cadeia — da pesquisa à leitura dos números. O que ela nos dá é velocidade e volume de opções. O que vai ao ar continua passando por uma pessoa."
      />

      <RevealGroup
        as="ul"
        stagger={0.08}
        className="grid gap-6 md:grid-cols-3"
      >
        {etapas.map((etapa) => (
          <RevealItem
            key={etapa.titulo}
            as="li"
            className="flex flex-col rounded-card border border-white/10 bg-carbon-950/40 p-7"
          >
            <IconFrame icon={etapa.icon} size="md" tone="invert" />
            <h3 className="mt-5 text-lg font-bold text-on-dark">
              {etapa.titulo}
            </h3>

            <p className="eyebrow mt-6 text-on-dark-accent">A IA acelera</p>
            <p className="mt-2 text-sm leading-relaxed text-on-dark-body">
              {etapa.ia}
            </p>

            <p className="eyebrow mt-6 text-on-dark-muted">A gente decide</p>
            <p className="mt-2 text-sm leading-relaxed text-on-dark-body">
              {etapa.humano}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Sem esta ressalva, "trabalhamos com IA" vira promessa de agente
          autônomo — que não é o que está nos planos. O atendimento entregue é
          fluxo de respostas fixas, e isso precisa estar escrito antes da
          venda, não depois. */}
      <Reveal>
        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 rounded-card border border-white/15 bg-carbon-950/50 p-6 sm:flex-row sm:items-start sm:gap-5">
          <IconFrame icon={Robot} size="sm" tone="invert" />
          <p className="text-sm leading-relaxed text-on-dark-body">
            <span className="font-semibold text-on-dark">
              Uma distinção honesta:
            </span>{' '}
            a IA é ferramenta nossa, de bastidor. O atendimento automatizado no
            WhatsApp que acompanha os planos funciona com respostas fixas — o
            cliente escolhe uma opção do menu e recebe a informação na hora.
            Quando a dúvida sai do roteiro, a conversa vai para uma pessoa. Não
            vendemos agente autônomo.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
