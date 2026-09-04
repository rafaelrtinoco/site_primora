import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';

const formatPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const faqs = [
  {
    q: 'Preciso já ter um site?',
    a: 'Não. Construímos sua estrutura digital do zero, incluindo um site focado em conversão e ajustado ao vocabulário do seu segmento.',
  },
  {
    q: 'Posso contratar só o conteúdo, ou só o tráfego pago?',
    a: 'Pode. São dois serviços separados justamente por isso: o conteúdo é cobrado por volume de peças e o tráfego, por número de plataformas e volume de mídia. Contratar os dois costuma render mais, mas nenhum depende do outro para funcionar.',
  },
  {
    q: 'A verba dos anúncios está incluída no valor da gestão?',
    /* É a dúvida que mais gera atrito na contratação de tráfego. */
    a: `Não, e essa separação é proposital. O valor da gestão é o nosso trabalho; a verba é o que vai para o Google e para a Meta, paga por você direto a eles. A conta de anúncios fica no seu nome, com o seu histórico — se um dia trocar de agência, ele vai com você. Recomendamos ao menos ${formatPreco(site.trafego.verbaMinima)} por mês de verba para as campanhas saírem do modo de aprendizado.`,
  },
  {
    q: 'Vocês atendem o meu segmento?',
    a: 'Atendemos corretoras de seguros, imobiliárias, escritórios de contabilidade e de advocacia e empresas de serviços administrativos. São mercados de venda consultiva, em que a decisão passa por confiança — e quatro deles têm regra própria de publicidade, que respeitamos na hora de montar as campanhas.',
  },
  {
    q: 'Vocês usam IA para produzir o meu conteúdo?',
    /* A resposta precisa ser afirmativa e delimitada: negar seria falso, e
       afirmar sem limite sugere conteúdo publicado sem revisão. */
    a: 'Usamos, em toda a cadeia: pesquisa, primeiras versões de texto e arte e leitura dos números. O que a IA entrega é velocidade e volume de opções, nunca a palavra final. Toda peça é editada, checada e aprovada por uma pessoa antes de ir ao ar.',
  },
  {
    q: 'Como funciona o atendimento automatizado no WhatsApp?',
    /* Não trabalhamos com agente de IA — o atendimento é por fluxo de
       respostas pré-definidas, e a página não pode sugerir o contrário. */
    a: 'É um atendimento com respostas fixas: o cliente escolhe uma opção do menu e recebe na hora informações sobre serviços, documentos necessários e canais de contato. Quando a dúvida sai do roteiro, a conversa é direcionada para você ou para a nossa equipe. Não é um agente de IA.',
  },
  {
    q: 'Vocês produzem vídeos presenciais?',
    a: 'Nossa produção de vídeo foca na edição profissional e na captação guiada, em que orientamos você a gravar. Para produção presencial, atuamos apenas em algumas regiões.',
  },
  {
    q: 'Existe fidelidade?',
    a: 'Não trabalhamos com contratos de fidelidade rígidos, mas recomendamos ciclos de 6 meses: tanto conteúdo quanto tráfego levam algumas semanas até estabilizar, e trocar de estratégia antes disso costuma jogar fora o aprendizado.',
  },
  {
    q: 'Quanto tempo leva para iniciar?',
    a: `Após o planejamento estratégico aprovado, sua estrutura de base entra no ar em média dentro de ${site.prazoEntrega}.`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="faq" tone="light" labelledBy="faq-title">
      <SectionHeader
        id="faq-title"
        tone="light"
        eyebrow="Dúvidas"
        title="Perguntas frequentes"
      />

      <RevealGroup as="ul" stagger={0.05} className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          const painelId = `faq-painel-${index}`;
          const botaoId = `faq-botao-${index}`;

          return (
            <RevealItem
              key={faq.q}
              as="li"
              className={`overflow-hidden rounded-card border bg-surface transition-colors duration-200 ${
                open ? 'border-acid-800/40' : 'border-line'
              }`}
            >
              <h3>
                <button
                  type="button"
                  id={botaoId}
                  aria-expanded={open}
                  aria-controls={painelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  /* O focus:outline-none daqui deixava o acordeão inteiro
                     invisível para navegação por teclado. */
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink-strong transition-colors duration-200 hover:bg-surface-muted"
                >
                  <span>{faq.q}</span>

                  {/* Gira 135° ao abrir: o + acaba como ×, e a volta a mais
                      torna o movimento visível em vez de apenas trocar o
                      ícone. A rotação é transform, então o MotionConfig
                      global a descarta em prefers-reduced-motion — o estado
                      continua legível pela cor de preenchimento. */}
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ rotate: open ? 135 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                      open
                        ? 'border-acid-400 bg-acid-400 text-carbon-950'
                        : 'border-line-strong text-ink-body'
                    }`}
                  >
                    <Plus size={16} weight="bold" />
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={painelId}
                    role="region"
                    aria-labelledby={botaoId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 leading-relaxed text-ink-muted">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
