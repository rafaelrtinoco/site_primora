import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    { number: '01', title: 'Diagnóstico', desc: 'Análise do seu momento' },
    { number: '02', title: 'Planejamento', desc: 'Estratégia sob medida' },
    { number: '03', title: 'Produção', desc: 'Criação da estrutura' },
    { number: '04', title: 'Entrega', desc: 'Lançamento oficial' },
    { number: '05', title: 'Otimização', desc: 'Acompanhamento mensal' },
  ];

  return (
    <section id="process" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Como Funciona</h2>
          <p className="text-gray-500 text-lg">Um processo validado e transparente para transformar sua corretora.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block" />
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 hidden md:block origin-left" 
          />

          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-50 shadow-lg flex items-center justify-center mb-6 z-10 relative">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
