import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { RevealGroup, RevealItem } from './ui/Reveal';
import { site } from '../content/site';

const faqs = [
  {
    q: 'Preciso já possuir um site?',
    a: 'Não. Nossa equipe constrói sua estrutura digital do zero, incluindo um site totalmente focado em conversão e otimizado para o mercado de seguros.',
  },
  {
    q: 'Posso contratar apenas social media?',
    a: 'Embora nosso foco seja a estrutura completa, possuímos pacotes flexíveis. Consulte nossa equipe durante o diagnóstico para encontrar a melhor opção para você.',
  },
  {
    q: 'Como funciona o chat automatizado?',
    /* Antes prometia "Inteligência Artificial treinada". Não trabalhamos com
       IA — o atendimento é por fluxo de respostas pré-definidas. */
    a: 'É um atendimento automatizado no WhatsApp com respostas prontas: o cliente escolhe uma opção do menu e recebe na hora informações sobre produtos, documentos necessários e canais de contato. Quando a dúvida sai do roteiro, a conversa é direcionada para você ou para a nossa equipe.',
  },
  {
    q: 'Vocês produzem vídeos presenciais?',
    a: 'Atualmente, nossa produção de vídeos foca na edição profissional e captação guiada (onde orientamos você a gravar). Para presenciais, atuamos apenas em algumas regiões.',
  },
  {
    q: 'Existe fidelidade?',
    a: 'Não trabalhamos com contratos de fidelidade rígidos, pois confiamos nos resultados entregues, mas recomendamos ciclos de 6 meses para maturação da estratégia digital.',
  },
  {
    q: 'Quanto tempo leva para iniciar?',
    /* Prazo vindo do arquivo de conteúdo: antes esta resposta dizia
       "15 a 20 dias" enquanto outra seção dizia "poucos dias". */
    a: `Após o planejamento estratégico aprovado, sua estrutura de base entra no ar em média dentro de ${site.prazoEntrega}.`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="faq" tone="tint" labelledBy="faq-title">
      <SectionHeader
        id="faq-title"
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
              className="overflow-hidden rounded-card border border-line bg-surface"
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
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink-strong transition-colors duration-200 hover:bg-brand-50"
                >
                  <span>{faq.q}</span>
                  <CaretDown
                    size={20}
                    weight="bold"
                    aria-hidden="true"
                    className={`shrink-0 text-brand-600 transition-transform duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
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
