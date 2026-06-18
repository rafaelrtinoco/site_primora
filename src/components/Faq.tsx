import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Faq() {
  const faqs = [
    { q: 'Preciso já possuir um site?', a: 'Não. Nossa equipe constrói sua estrutura digital do zero, incluindo um site totalmente focado em conversão e otimizado para o mercado de seguros.' },
    { q: 'Posso contratar apenas social media?', a: 'Embora nosso foco seja a estrutura completa, possuímos pacotes flexíveis. Consulte nossa equipe durante o diagnóstico para encontrar a melhor opção para você.' },
    { q: 'Como funciona o chatbot?', a: 'Desenvolvemos uma Inteligência Artificial treinada com os seus produtos e roteiros de vendas, capaz de qualificar leads, agendar reuniões e tirar dúvidas 24h por dia no WhatsApp.' },
    { q: 'Vocês produzem vídeos presenciais?', a: 'Atualmente, nossa produção de vídeos foca na edição profissional e captação guiada (onde orientamos você a gravar). Para presenciais, atuamos apenas em algumas regiões.' },
    { q: 'Existe fidelidade?', a: 'Não trabalhamos com contratos de fidelidade rígidos, pois confiamos nos resultados entregues, mas recomendamos ciclos de 6 meses para maturação da estratégia digital.' },
    { q: 'Quanto tempo leva para iniciar?', a: 'Após o planejamento estratégico aprovado, sua estrutura de base entra no ar em média dentro de 15 a 20 dias.' },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            Dúvidas Frequentes
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-primary focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-secondary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
