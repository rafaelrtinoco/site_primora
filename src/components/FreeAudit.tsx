import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function FreeAudit() {
  const checklist = [
    'Instagram otimizado',
    'Posicionamento da marca',
    'Oportunidades de automação',
    'Funil de captação',
    'Experiência do cliente'
  ];

  return (
    <section id="free-audit" className="py-24 bg-linear-to-br from-primary to-secondary text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-accent blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Descubra como está sua presença digital.
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Realizamos um diagnóstico gratuito para identificar oportunidades de crescimento, automação e fortalecimento da sua autoridade digital.
            </p>
            <motion.a
              href="#cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold hover:shadow-xl transition-shadow duration-300"
            >
              Solicitar Diagnóstico Gratuito
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20"
          >
            <h3 className="text-xl font-semibold mb-6 text-white">O que analisamos:</h3>
            <ul className="space-y-4">
              {checklist.map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-blue-50"
                >
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                  <span className="font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
