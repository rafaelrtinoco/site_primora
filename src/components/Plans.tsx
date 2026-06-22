import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Plans() {
  const plans = [
    {
      name: 'START',
      description: 'Ideal para corretores iniciantes',
      features: [
        'Instagram otimizado',
        '8 posts por mês',
        '8 stories',
        'Landing Page',
        'Suporte básico'
      ],
      highlighted: false
    },
    {
      name: 'GROWTH',
      description: 'Plano recomendado',
      badge: 'Mais Escolhido',
      features: [
        '12 posts por mês',
        '12 stories',
        '2 vídeos',
        'Site profissional',
        'Chat IA',
        'Consultoria mensal'
      ],
      highlighted: true
    },
    {
      name: 'PRIMORA PRO',
      description: 'Estrutura máxima para alta performance',
      features: [
        '16 posts por mês',
        '16 stories',
        '4 vídeos',
        'Site completo',
        'IA treinada',
        'Automação',
        'Consultoria estratégica'
      ],
      highlighted: false
    }
  ];

  return (
    <section id="plans" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
          >
            Escolha a solução ideal para sua fase profissional
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Planos criados estrategicamente para atender corretores em diferentes estágios do mercado.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-3xl p-8 bg-white transition-all duration-300 ${
                plan.highlighted 
                  ? 'ring-2 ring-secondary shadow-2xl scale-100 lg:scale-105 z-10' 
                  : 'border border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-linear-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap py-1.5 px-4 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-secondary' : 'text-primary'}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-secondary' : 'text-gray-400'}`} />
                    <span className="text-gray-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="#cta"
                className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                  plan.highlighted
                    ? 'bg-linear-to-r from-primary to-secondary text-white hover:shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Selecionar Plano
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
